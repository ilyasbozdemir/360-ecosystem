/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * TEMİN 360 - Merkezi Sürüm Yöneticisi (Version Manager)
 *
 * Bu modül SemVer uyumlu sürüm ayrıştırma, karşılaştırma, kanal yönetimi,
 * sonraki sürüm hesaplama ve updater doğrulama kurallarını tek bir merkezde toplar.
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

export type Channel = 'alpha' | 'beta' | 'rc' | 'stable'

export interface ChannelMeta {
  name: string
  label: string
  header: string
  description: string
  isPrerelease: boolean
}

export interface VersionPolicy {
  versioning: {
    scheme: 'semver'
    channels: Channel[]
    channelOrder: Record<Channel, number>
    defaultChannel: Channel
    tagPrefix: string
    prerelease: {
      allowAutoUpdate: boolean
      allowChannelUpgrade: boolean
      allowChannelDowngrade: boolean
    }
    channelMeta: Record<Channel, ChannelMeta>
  }
}

export interface ParsedVersion {
  raw: string
  hasPrefix: boolean
  major: number
  minor: number
  patch: number
  channel: Channel
  iteration: number
  isPrerelease: boolean
  baseVersion: string
}

export interface ComputeVersionOptions {
  channel?: Channel | string
  rc?: boolean
  patch?: boolean
  policy?: VersionPolicy
}

export interface UpdateEligibility {
  eligible: boolean
  reason: string
}

/**
 * Merkezi varsayılan sürüm politikası (Fallback)
 */
export const DEFAULT_VERSION_POLICY: VersionPolicy = {
  versioning: {
    scheme: 'semver',
    channels: ['alpha', 'beta', 'rc', 'stable'],
    channelOrder: {
      alpha: 1,
      beta: 2,
      rc: 3,
      stable: 4
    },
    defaultChannel: 'rc',
    tagPrefix: 'v',
    prerelease: {
      allowAutoUpdate: true,
      allowChannelUpgrade: true,
      allowChannelDowngrade: false
    },
    channelMeta: {
      alpha: {
        name: 'Alpha',
        label: 'Geliştirici / Alpha Sürümü',
        header: '🚀 **TEMİN 360 {tag} (Geliştirici / Alpha Sürümü)**',
        description: 'Geliştirme aşamasındaki deneysel sürümdür.',
        isPrerelease: true
      },
      beta: {
        name: 'Beta',
        label: 'Erken Erişim (Early Access)',
        header: '🚀 **TEMİN 360 {tag} (Erken Erişim / Early Access)**',
        description: 'Bu sürümdeki en son değişiklikler ve geliştirmeler aşağıda listelenmiştir.',
        isPrerelease: true
      },
      rc: {
        name: 'Release Candidate',
        label: 'Sürüm Adayı (Release Candidate)',
        header: '🎯 **TEMİN 360 {tag} (Sürüm Adayı / Release Candidate)**',
        description:
          'Kararlı sürüm öncesi test ve doğrulama sürümüdür. Bu sürümdeki değişiklikler aşağıda listelenmiştir.',
        isPrerelease: true
      },
      stable: {
        name: 'Stable',
        label: 'Kararlı Sürüm',
        header: '⚖️ **TEMİN 360 {tag} (Kararlı Sürüm)**',
        description: 'Kamu Harcama, İhale, Doğrudan Temin ve Hakediş Yönetim Sistemi.',
        isPrerelease: false
      }
    }
  }
}

function getCurrentDir(): string {
  if (typeof __dirname !== 'undefined') {
    return __dirname
  }
  try {
    // Windows path fix: /D:/path -> D:/path
    const urlPath = new URL(import.meta.url).pathname
    return path.dirname(urlPath.replace(/^\/([a-zA-Z]:)/, '$1'))
  } catch {
    return process.cwd()
  }
}

/**
 * YAML veya JSON dosyasından sürüm politikasını yükler.
 * Bulunamaz veya hata verirse güvenli DEFAULT_VERSION_POLICY döner.
 */
export function loadVersionPolicy(customPath?: string): VersionPolicy {
  const candidatePaths: string[] = []

  if (customPath) {
    candidatePaths.push(customPath)
  }

  const baseDir = getCurrentDir()

  // 1. Proje kök dizini (scripts veya geliştirme ortamı)
  candidatePaths.push(path.resolve(baseDir, '../../../../../version-policy.yaml'))
  candidatePaths.push(path.resolve(process.cwd(), 'version-policy.yaml'))
  candidatePaths.push(path.resolve(process.cwd(), 'resources/version-policy.yaml'))

  // 2. Electron packaged resources dizini
  if (typeof process !== 'undefined' && (process as any).resourcesPath) {
    candidatePaths.push(path.join((process as any).resourcesPath, 'version-policy.yaml'))
  }

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf-8')
        // js-yaml varsa kullan
        let yamlLib: any = null
        try {
          yamlLib = require('js-yaml')
        } catch {
          try {
            const resolved = require.resolve('js-yaml', { paths: [path.resolve(baseDir, '../../../')] })
            yamlLib = require(resolved)
          } catch {
            yamlLib = null
          }
        }

        if (yamlLib && typeof yamlLib.load === 'function') {
          const loaded = yamlLib.load(content) as Partial<VersionPolicy>
          if (loaded && loaded.versioning && Array.isArray(loaded.versioning.channels)) {
            return loaded as VersionPolicy
          }
        }
      } catch (err) {
        console.warn(`[VersionManager] version-policy.yaml yüklenirken hata oluştu (${p}), varsayılan kullanılıyor:`, err)
      }
    }
  }

  return DEFAULT_VERSION_POLICY
}

/**
 * SemVer formatında sürüm dizesini ayrıştırır.
 * Biçim: MAJOR.MINOR.PATCH[-KANAL.SIRA] (örn: 1.0.0-rc.1, v1.0.0-beta.256, 1.0.0)
 */
export function parseVersion(versionStr: string, policy: VersionPolicy = DEFAULT_VERSION_POLICY): ParsedVersion {
  if (!versionStr || typeof versionStr !== 'string') {
    throw new Error('Geçersiz versiyon: Boş veya string olmayan değer verildi.')
  }

  const trimmed = versionStr.trim()
  const hasPrefix = trimmed.startsWith('v') || trimmed.startsWith('V')
  const clean = hasPrefix ? trimmed.slice(1) : trimmed

  const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9]+)\.(\d+))?$/
  const match = clean.match(semverRegex)

  if (!match) {
    throw new Error(
      `Desteklenmeyen veya geçersiz sürüm formatı: "${versionStr}". Beklenen format: MAJOR.MINOR.PATCH[-KANAL.SIRA] (örn: 1.0.0-rc.1)`
    )
  }

  const major = parseInt(match[1], 10)
  const minor = parseInt(match[2], 10)
  const patch = parseInt(match[3], 10)
  const rawChannel = match[4]?.toLowerCase()
  const rawIteration = match[5] ? parseInt(match[5], 10) : 0

  let channel: Channel = 'stable'
  let iteration = 0
  let isPrerelease = false

  if (rawChannel) {
    const validChannels = policy.versioning.channels
    if (!validChannels.includes(rawChannel as Channel)) {
      throw new Error(
        `Geçersiz veya desteklenmeyen sürüm kanalı: "${rawChannel}". İzin verilen kanallar: ${validChannels.join(', ')}`
      )
    }
    channel = rawChannel as Channel
    iteration = rawIteration
    isPrerelease = true
  }

  return {
    raw: trimmed,
    hasPrefix,
    major,
    minor,
    patch,
    channel,
    iteration,
    isPrerelease,
    baseVersion: `${major}.${minor}.${patch}`
  }
}

/**
 * Güvenli ayrıştırma (hata fırlatmaz, geçersizse null döner)
 */
export function tryParseVersion(
  versionStr: string,
  policy: VersionPolicy = DEFAULT_VERSION_POLICY
): ParsedVersion | null {
  try {
    return parseVersion(versionStr, policy)
  } catch {
    return null
  }
}

/**
 * Sürüm dizesinin geçerli olup olmadığını doğrular
 */
export function isValidVersion(versionStr: string, policy: VersionPolicy = DEFAULT_VERSION_POLICY): boolean {
  return tryParseVersion(versionStr, policy) !== null
}

/**
 * İki sürümü SemVer kurallarına göre karşılaştırır.
 *
 * Sıralama Kuralları:
 * 1. MAJOR, MINOR, PATCH sayısal karşılaştırılır.
 * 2. Temel sürüm aynıysa: Stable sürüm (`1.0.0`), prerelease sürümlerden (`1.0.0-rc.1`) büyüktür.
 * 3. Her ikisi de prerelease ise: Kanal önceliği `alpha < beta < rc` karşılaştırılır.
 * 4. Kanallar aynıysa: İterasyon numarası sayısal karşılaştırılır (`beta.10 > beta.9`).
 *
 * @returns 1 if v1 > v2, -1 if v1 < v2, 0 if v1 === v2
 */
export function compareVersions(
  v1: string | ParsedVersion,
  v2: string | ParsedVersion,
  policy: VersionPolicy = DEFAULT_VERSION_POLICY
): number {
  const p1 = typeof v1 === 'string' ? parseVersion(v1, policy) : v1
  const p2 = typeof v2 === 'string' ? parseVersion(v2, policy) : v2

  // 1. Major karşılaştırması
  if (p1.major !== p2.major) {
    return p1.major > p2.major ? 1 : -1
  }

  // 2. Minor karşılaştırması
  if (p1.minor !== p2.minor) {
    return p1.minor > p2.minor ? 1 : -1
  }

  // 3. Patch karşılaştırması
  if (p1.patch !== p2.patch) {
    return p1.patch > p2.patch ? 1 : -1
  }

  // 4. Temel sürüm aynı (Major.Minor.Patch eşit)
  // Durum A: Biri stable, biri prerelease ise Stable > Prerelease
  if (!p1.isPrerelease && p2.isPrerelease) {
    return 1
  }
  if (p1.isPrerelease && !p2.isPrerelease) {
    return -1
  }

  // Durum B: Her ikisi de stable
  if (!p1.isPrerelease && !p2.isPrerelease) {
    return 0
  }

  // Durum C: Her ikisi de prerelease
  const order = policy.versioning.channelOrder
  const p1Rank = order[p1.channel] || 0
  const p2Rank = order[p2.channel] || 0

  if (p1Rank !== p2Rank) {
    return p1Rank > p2Rank ? 1 : -1
  }

  // Kanallar aynı: İterasyon numarası sayısal karşılaştırılır (örn: rc.10 > rc.9)
  if (p1.iteration !== p2.iteration) {
    return p1.iteration > p2.iteration ? 1 : -1
  }

  return 0
}

/**
 * Verilen mevcut sürüm ve seçeneklere göre sonraki sürümü dinamik olarak hesaplar.
 */
export function computeNextVersion(
  currentVersionStr: string,
  options: ComputeVersionOptions = {}
): string {
  const policy = options.policy || loadVersionPolicy()
  const current = parseVersion(currentVersionStr, policy)

  // Hedef kanal belirleme
  let targetChannel: Channel = policy.versioning.defaultChannel

  if (options.channel) {
    const rawChan = options.channel.toLowerCase().trim() as Channel
    if (!policy.versioning.channels.includes(rawChan)) {
      throw new Error(
        `Geçersiz hedef kanal: "${options.channel}". İzin verilen kanallar: ${policy.versioning.channels.join(', ')}`
      )
    }
    targetChannel = rawChan
  } else if (options.rc) {
    targetChannel = 'rc'
  } else if (options.patch) {
    // --patch tek başına verildiğinde mevcut kanalı koru
    targetChannel = current.channel
  }

  const order = policy.versioning.channelOrder
  const currentRank = order[current.channel]
  const targetRank = order[targetChannel]

  // Senaryo 1: Mevcut sürüm zaten Stable (Örn: 1.0.0)
  if (current.channel === 'stable') {
    if (targetChannel === 'stable') {
      // 1.0.0 + stable/patch -> 1.0.1
      return `${current.major}.${current.minor}.${current.patch + 1}`
    } else {
      // 1.0.0 + alpha/beta/rc -> bir sonraki patch'in prerelease'i (1.0.1-rc.1)
      return `${current.major}.${current.minor}.${current.patch + 1}-${targetChannel}.1`
    }
  }

  // Senaryo 2: Hedef kanal Stable (Örn: 1.0.0-rc.2 + stable -> 1.0.0)
  if (targetChannel === 'stable') {
    return current.baseVersion
  }

  // Senaryo 3: Aynı kanal içinde iterasyon artışı (Örn: 1.0.0-beta.256 -> 1.0.0-beta.257, 1.0.0-rc.1 -> 1.0.0-rc.2)
  if (current.channel === targetChannel) {
    return `${current.baseVersion}-${targetChannel}.${current.iteration + 1}`
  }

  // Senaryo 4: Kanal geçişi (Örn: alpha -> beta, beta -> rc)
  if (targetRank > currentRank) {
    // İleri kanal geçişinde iterasyon 1 ile başlar
    return `${current.baseVersion}-${targetChannel}.1`
  }

  // Senaryo 5: Kanal düşürme (Örn: rc -> beta)
  if (!policy.versioning.prerelease.allowChannelDowngrade) {
    throw new Error(
      `Kanal düşürme engellendi: "${current.channel}" kanalından daha düşük bir kanal olan "${targetChannel}" kanalına geçişe izin verilmiyor.`
    )
  }

  return `${current.baseVersion}-${targetChannel}.1`
}

/**
 * Geriye dönük uyumluluk patch artışı
 */
export function bumpPatch(versionStr: string, policy: VersionPolicy = DEFAULT_VERSION_POLICY): string {
  return computeNextVersion(versionStr, { patch: true, policy })
}

/**
 * Electron Updater: Gelen güncellemenin indirilmeye ve kurulmaya uygun olup olmadığını doğrular.
 */
export function isUpdateEligible(
  currentVersionStr: string,
  incomingVersionStr: string,
  policy: VersionPolicy = DEFAULT_VERSION_POLICY
): UpdateEligibility {
  const current = tryParseVersion(currentVersionStr, policy)
  if (!current) {
    return { eligible: false, reason: `Geçersiz mevcut sürüm formatı: "${currentVersionStr}"` }
  }

  const incoming = tryParseVersion(incomingVersionStr, policy)
  if (!incoming) {
    return { eligible: false, reason: `Geçersiz gelen sürüm formatı: "${incomingVersionStr}"` }
  }

  const comparison = compareVersions(incoming, current, policy)
  if (comparison <= 0) {
    return {
      eligible: false,
      reason: `Gelen sürüm (${incoming.raw}) mevcut sürümden (${current.raw}) daha eski veya aynı.`
    }
  }

  // Kanal düşürme kontrolü (aynı baseVersion üzerinde rc -> beta gibi)
  const order = policy.versioning.channelOrder
  if (
    current.baseVersion === incoming.baseVersion &&
    order[incoming.channel] < order[current.channel] &&
    !policy.versioning.prerelease.allowChannelDowngrade
  ) {
    return {
      eligible: false,
      reason: `Kanal düşürme engellendi: ${current.channel} -> ${incoming.channel}`
    }
  }

  return { eligible: true, reason: 'Geçerli yeni sürüm' }
}

/**
 * Verilen etiket için Changelog sürüm başlığını üretir
 */
export function getReleaseHeader(tag: string, policy: VersionPolicy = DEFAULT_VERSION_POLICY): string {
  const parsed = tryParseVersion(tag, policy)
  const channel = parsed ? parsed.channel : (tag.includes('rc') ? 'rc' : tag.includes('beta') ? 'beta' : 'stable')
  const meta = policy.versioning.channelMeta[channel] || policy.versioning.channelMeta.stable

  const header = meta.header.replace(/\{tag\}/g, tag)
  const desc = meta.description

  return `> ${header}\n> ${desc}`
}

/**
 * Git deposunda belirtilen etiketin mevcut olup olmadığını kontrol eder
 */
export function checkTagExists(tag: string, cwd?: string): boolean {
  try {
    const gitCwd = cwd || path.resolve(getCurrentDir(), '../../../../..')
    const existing = execSync('git tag --list', { cwd: gitCwd, encoding: 'utf-8', stdio: 'pipe' })
    const list = existing.split('\n').map((t) => t.trim())
    return list.includes(tag)
  } catch {
    return false
  }
}

/**
 * Release Notes üretimi için bir önceki geçerli Git etiketini bulur
 */
export function findPreviousTag(currentTag: string, cwd?: string): string {
  const gitCwd = cwd || path.resolve(getCurrentDir(), '../../../../..')
  try {
    const prev = execSync(`git describe --tags --abbrev=0 "${currentTag}^"`, {
      cwd: gitCwd,
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim()
    return prev
  } catch {
    return ''
  }
}

/**
 * VersionManager ana sınıfı
 */
export class VersionManager {
  private policy: VersionPolicy
  private cwd: string

  constructor(policyPath?: string, cwd?: string) {
    this.policy = loadVersionPolicy(policyPath)
    this.cwd = cwd || path.resolve(getCurrentDir(), '../../../../..')
  }

  getPolicy(): VersionPolicy {
    return this.policy
  }

  parse(versionStr: string): ParsedVersion {
    return parseVersion(versionStr, this.policy)
  }

  compare(v1: string | ParsedVersion, v2: string | ParsedVersion): number {
    return compareVersions(v1, v2, this.policy)
  }

  computeNext(currentVersionStr: string, options: ComputeVersionOptions = {}): string {
    return computeNextVersion(currentVersionStr, { ...options, policy: this.policy })
  }

  isEligible(currentVersionStr: string, incomingVersionStr: string): UpdateEligibility {
    return isUpdateEligible(currentVersionStr, incomingVersionStr, this.policy)
  }

  getHeader(tag: string): string {
    return getReleaseHeader(tag, this.policy)
  }

  tagExists(tag: string): boolean {
    return checkTagExists(tag, this.cwd)
  }

  getPreviousTag(currentTag: string): string {
    return findPreviousTag(currentTag, this.cwd)
  }
}

// CommonJS uyumluluk dışa aktarımı
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Channel: {} as any,
    DEFAULT_VERSION_POLICY,
    loadVersionPolicy,
    parseVersion,
    tryParseVersion,
    isValidVersion,
    compareVersions,
    computeNextVersion,
    bumpPatch,
    isUpdateEligible,
    getReleaseHeader,
    checkTagExists,
    findPreviousTag,
    VersionManager
  }
}
