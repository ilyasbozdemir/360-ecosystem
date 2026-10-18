import { describe, it, expect } from 'vitest'
import { execSync } from 'child_process'
import path from 'path'
import {
  parseVersion,
  tryParseVersion,
  isValidVersion,
  compareVersions,
  computeNextVersion,
  isUpdateEligible,
  getReleaseHeader,
  loadVersionPolicy,
  DEFAULT_VERSION_POLICY,
  VersionManager
} from '../../src/shared/version/versionManager'

const GIT_ROOT = path.resolve(__dirname, '../../../..')

function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1B\[[0-9;]*[mGKF]/g, '')
}

describe('Merkezi Version Manager & Sürüm Karşılaştırma Testleri', () => {
  describe('1. SemVer Karşılaştırma Kuralları (compareVersions)', () => {
    it('aynı kanal içindeki sayısal artışları doğrular (örn: alpha.1 < alpha.2)', () => {
      expect(compareVersions('1.0.0-alpha.1', '1.0.0-alpha.2')).toBe(-1)
      expect(compareVersions('1.0.0-alpha.2', '1.0.0-alpha.1')).toBe(1)
    })

    it('sayısal çok basamaklı iterasyonları doğru karşılaştırır (alpha.2 < alpha.10, beta.9 < beta.10)', () => {
      expect(compareVersions('1.0.0-alpha.2', '1.0.0-alpha.10')).toBe(-1)
      expect(compareVersions('1.0.0-beta.9', '1.0.0-beta.10')).toBe(-1)
      expect(compareVersions('1.0.0-rc.9', '1.0.0-rc.10')).toBe(-1)
    })

    it('kanallar arası öncelik hiyerarşisini uygular (alpha < beta < rc < stable)', () => {
      expect(compareVersions('1.0.0-alpha.79', '1.0.0-beta.1')).toBe(-1)
      expect(compareVersions('1.0.0-beta.255', '1.0.0-beta.256')).toBe(-1)
      expect(compareVersions('1.0.0-beta.256', '1.0.0-rc.1')).toBe(-1)
      expect(compareVersions('1.0.0-rc.1', '1.0.0-rc.2')).toBe(-1)
      expect(compareVersions('1.0.0-rc.2', '1.0.0')).toBe(-1)
    })

    it('kararlı sürüm (stable), aynı taban sürümün tüm prerelease sürümlerinden büyüktür', () => {
      expect(compareVersions('1.0.0', '1.0.0-rc.1')).toBe(1)
      expect(compareVersions('1.0.0', '1.0.0-beta.256')).toBe(1)
      expect(compareVersions('1.0.0', '1.0.0-alpha.99')).toBe(1)
    })

    it('taban sürüm artışında (major/minor/patch) prerelease kararlıdan büyük olabilir', () => {
      // 1.0.0 < 1.0.1-alpha.1
      expect(compareVersions('1.0.0', '1.0.1-alpha.1')).toBe(-1)
      expect(compareVersions('1.0.1-alpha.1', '1.0.0')).toBe(1)
      // 1.0.0 < 1.1.0-alpha.1
      expect(compareVersions('1.0.0', '1.1.0-alpha.1')).toBe(-1)
      // 1.0.0 < 2.0.0-alpha.1
      expect(compareVersions('1.0.0', '2.0.0-alpha.1')).toBe(-1)
    })

    it('aynı sürümler karşılaştırıldığında 0 döner', () => {
      expect(compareVersions('1.0.0-rc.1', '1.0.0-rc.1')).toBe(0)
      expect(compareVersions('v1.0.0-rc.1', '1.0.0-rc.1')).toBe(0)
      expect(compareVersions('1.0.0', '1.0.0')).toBe(0)
    })

    it('versions.json içinde bulunmayan rastgele geçerli sürümleri de SemVer ile doğru karşılaştırır', () => {
      expect(compareVersions('3.4.5-rc.8', '3.4.5-rc.9')).toBe(-1)
      expect(compareVersions('4.0.0', '3.9.9')).toBe(1)
    })
  })

  describe('2. Sürüm Ayrıştırma ve Doğrulama (parseVersion & isValidVersion)', () => {
    it('geçerli SemVer sürümlerini başarıyla ayrıştırır', () => {
      const p1 = parseVersion('v1.0.0-beta.256')
      expect(p1.major).toBe(1)
      expect(p1.minor).toBe(0)
      expect(p1.patch).toBe(0)
      expect(p1.channel).toBe('beta')
      expect(p1.iteration).toBe(256)
      expect(p1.isPrerelease).toBe(true)
      expect(p1.baseVersion).toBe('1.0.0')

      const p2 = parseVersion('1.2.3')
      expect(p2.major).toBe(1)
      expect(p2.minor).toBe(2)
      expect(p2.patch).toBe(3)
      expect(p2.channel).toBe('stable')
      expect(p2.iteration).toBe(0)
      expect(p2.isPrerelease).toBe(false)
    })

    it('geçersiz veya desteklenmeyen sürüm formatlarında açık hata fırlatır', () => {
      expect(() => parseVersion('invalid-version')).toThrow(/Desteklenmeyen veya geçersiz/)
      expect(() => parseVersion('1.0')).toThrow(/Desteklenmeyen veya geçersiz/)
      expect(() => parseVersion('')).toThrow(/Geçersiz versiyon/)
      expect(() => parseVersion('1.0.0-unsupported.1')).toThrow(/Geçersiz veya desteklenmeyen/)
    })

    it('tryParseVersion ve isValidVersion sessiz doğrulama yapar', () => {
      expect(isValidVersion('1.0.0-rc.1')).toBe(true)
      expect(isValidVersion('not-semver')).toBe(false)
      expect(tryParseVersion('not-semver')).toBeNull()
    })
  })

  describe('3. Sonraki Sürüm Hesaplama (computeNextVersion)', () => {
    it('1.0.0-alpha.79 + alpha → 1.0.0-alpha.80', () => {
      expect(computeNextVersion('1.0.0-alpha.79', { channel: 'alpha' })).toBe('1.0.0-alpha.80')
    })

    it('1.0.0-beta.256 + beta → 1.0.0-beta.257', () => {
      expect(computeNextVersion('1.0.0-beta.256', { channel: 'beta' })).toBe('1.0.0-beta.257')
      expect(computeNextVersion('1.0.0-beta.256', { patch: true })).toBe('1.0.0-beta.257')
    })

    it('1.0.0-beta.256 + rc → 1.0.0-rc.1 (ve --rc / --rc --patch kombinasyonları)', () => {
      expect(computeNextVersion('1.0.0-beta.256', { channel: 'rc' })).toBe('1.0.0-rc.1')
      expect(computeNextVersion('1.0.0-beta.256', { rc: true })).toBe('1.0.0-rc.1')
      expect(computeNextVersion('1.0.0-beta.256', { rc: true, patch: true })).toBe('1.0.0-rc.1')
    })

    it('1.0.0-rc.1 + rc → 1.0.0-rc.2', () => {
      expect(computeNextVersion('1.0.0-rc.1', { channel: 'rc' })).toBe('1.0.0-rc.2')
      expect(computeNextVersion('1.0.0-rc.1', { rc: true })).toBe('1.0.0-rc.2')
      expect(computeNextVersion('1.0.0-rc.1', { patch: true })).toBe('1.0.0-rc.2')
    })

    it('1.0.0-rc.2 + stable → 1.0.0', () => {
      expect(computeNextVersion('1.0.0-rc.2', { channel: 'stable' })).toBe('1.0.0')
    })

    it('stable sürümden sonra yeniden prerelease kanalına geçiş taban sürümü artırır', () => {
      expect(computeNextVersion('1.0.0', { channel: 'alpha' })).toBe('1.0.1-alpha.1')
      expect(computeNextVersion('1.0.0', { channel: 'beta' })).toBe('1.0.1-beta.1')
      expect(computeNextVersion('1.0.0', { channel: 'rc' })).toBe('1.0.1-rc.1')
      expect(computeNextVersion('1.0.0', { channel: 'stable' })).toBe('1.0.1')
      expect(computeNextVersion('1.0.0', { patch: true })).toBe('1.0.1')
    })

    it('kanal düşürme teşebbüslerini engeller (örn: rc -> beta)', () => {
      expect(() => computeNextVersion('1.0.0-rc.1', { channel: 'beta' })).toThrow(/Kanal düşürme engellendi/)
    })
  })

  describe('4. Electron Updater Uygunluk Doğrulaması (isUpdateEligible)', () => {
    it('yeni ve geçerli bir sürüm geldiğinde güncellemeyi kabul eder', () => {
      const res = isUpdateEligible('1.0.0-beta.256', '1.0.0-rc.1')
      expect(res.eligible).toBe(true)
    })

    it('RC sürümünden Stable sürüme geçişi onaylar', () => {
      const res = isUpdateEligible('1.0.0-rc.3', '1.0.0')
      expect(res.eligible).toBe(true)
    })

    it('aynı sürüm veya daha eski sürüm geldiğinde güncellemeyi kesinlikle reddeder', () => {
      const same = isUpdateEligible('1.0.0-rc.2', '1.0.0-rc.2')
      expect(same.eligible).toBe(false)
      expect(same.reason).toMatch(/daha eski veya aynı/)

      const older = isUpdateEligible('1.0.0-rc.2', '1.0.0-rc.1')
      expect(older.eligible).toBe(false)
      expect(older.reason).toMatch(/daha eski veya aynı/)
    })

    it('geçersiz formatlı gelen sürümleri reddeder', () => {
      const invalid = isUpdateEligible('1.0.0-rc.2', 'bad-format')
      expect(invalid.eligible).toBe(false)
      expect(invalid.reason).toMatch(/Geçersiz/)
    })

    it('aynı temel sürümde kanal düşürmeyi reddeder (örn: rc.1 iken beta.256 gelmesi)', () => {
      const downgrade = isUpdateEligible('1.0.0-rc.1', '1.0.0-beta.256')
      expect(downgrade.eligible).toBe(false)
    })
  })

  describe('5. Merkezi Yapılandırma ve Politika Yükleyici (loadVersionPolicy)', () => {
    it('version-policy.yaml dosyasını yükler ve kanalları doğrular', () => {
      const policy = loadVersionPolicy()
      expect(policy.versioning.scheme).toBe('semver')
      expect(policy.versioning.channels).toEqual(['alpha', 'beta', 'rc', 'stable'])
      expect(policy.versioning.defaultChannel).toBe('rc')
    })

    it('dosya bulunamadığında veya bozuk olduğunda güvenli fallback DEFAULT_VERSION_POLICY döner', () => {
      const fallback = loadVersionPolicy('/non/existent/path/policy.yaml')
      expect(fallback).toBeDefined()
      expect(fallback.versioning.defaultChannel).toBe(DEFAULT_VERSION_POLICY.versioning.defaultChannel)
    })

    it('getReleaseHeader tüm kanallar için doğru başlık ve açıklamayı üretir', () => {
      const rcHeader = getReleaseHeader('v1.0.0-rc.1')
      expect(rcHeader).toContain('🎯 **TEMİN 360 v1.0.0-rc.1 (Sürüm Adayı / Release Candidate)**')

      const betaHeader = getReleaseHeader('v1.0.0-beta.256')
      expect(betaHeader).toContain('🚀 **TEMİN 360 v1.0.0-beta.256 (Erken Erişim / Early Access)**')

      const stableHeader = getReleaseHeader('v1.0.0')
      expect(stableHeader).toContain('⚖️ **TEMİN 360 v1.0.0 (Kararlı Sürüm)**')
    })

    it('VersionManager sınıfı tüm yetenekleri OOP arayüzüyle sunar', () => {
      const vm = new VersionManager()
      expect(vm.compare('1.0.0-alpha.1', '1.0.0-beta.1')).toBe(-1)
      expect(vm.computeNext('1.0.0-rc.1', { channel: 'rc' })).toBe('1.0.0-rc.2')
      expect(vm.isEligible('1.0.0-rc.1', '1.0.0-rc.2').eligible).toBe(true)
    })
  })

  describe('6. CLI & Dry-run Entegrasyonu', () => {
    it('--channel rc --dry-run çalıştırıldığında 1.0.0-rc.1 geçişini simüle eder', () => {
      const raw = execSync('node apps/app-desktop/scripts/release.js --channel rc --dry-run', {
        cwd: GIT_ROOT,
        encoding: 'utf-8'
      })
      const output = stripAnsi(raw)
      expect(output).toContain('1.0.0-beta.256 → 1.0.0-rc.1')
      expect(output).toContain('Tag:      v1.0.0-rc.1')
      expect(output).toContain('DRY RUN - Hiçbir değişiklik yapılmadı')
    })

    it('--channel beta --patch --dry-run çalıştırıldığında 1.0.0-beta.257 geçişini simüle eder', () => {
      const raw = execSync('node apps/app-desktop/scripts/release.js --channel beta --patch --dry-run', {
        cwd: GIT_ROOT,
        encoding: 'utf-8'
      })
      const output = stripAnsi(raw)
      expect(output).toContain('1.0.0-beta.256 → 1.0.0-beta.257')
      expect(output).toContain('DRY RUN - Hiçbir değişiklik yapılmadı')
    })

    it('--channel stable --dry-run çalıştırıldığında 1.0.0 kararlı geçişini simüle eder', () => {
      const raw = execSync('node apps/app-desktop/scripts/release.js --channel stable --dry-run', {
        cwd: GIT_ROOT,
        encoding: 'utf-8'
      })
      const output = stripAnsi(raw)
      expect(output).toContain('1.0.0-beta.256 → 1.0.0')
      expect(output).toContain('DRY RUN - Hiçbir değişiklik yapılmadı')
    })
  })
})
