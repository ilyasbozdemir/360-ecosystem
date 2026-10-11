import React from 'react'
import {
  BarChart3,
  BookOpen,
  Building2,
  Calculator,
  Coins,
  Database,
  FileText,
  FolderKanban,
  FolderOpen,
  FolderTree,
  Hammer,
  HelpCircle,
  Home,
  Key,
  Landmark,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  Megaphone,
  PackageSearch,
  Ruler,
  Scale,
  Settings,
  Star,
  Tag,
  User,
  Users,
  Boxes
} from 'lucide-react'

export interface SubItem {
  name: string
  path: string
  icon: React.ElementType
  badge?: string
}

export interface MenuItem {
  name: string
  path?: string
  icon: React.ElementType
  badge?: string
  children?: SubItem[]
  onClick?: () => void
}

export interface MenuGroup {
  title: string
  items: MenuItem[]
}

export type ProcurementMode = 'dogrudan_temin' | 'ihale' | 'devlet_ihale_2886'

export function getSidebarMenuGroups(
  procurementMode: ProcurementMode,
  activeDosyaId?: string | number | null
): MenuGroup[] {
  if (procurementMode === 'devlet_ihale_2886') {
    return [
      {
        title: '2886 Devlet İhale (Gelir)',
        items: [
          { name: 'Gösterge Paneli', path: '/', icon: Home },
          {
            name: '2886 İhale Dosyaları Yönetimi',
            path: '/devlet-ihale-2886?tab=dosyalar',
            icon: FolderOpen,
            badge: 'DOSYALAR'
          },
          {
            name: '2886 Satış & Kiralama Masası',
            path: '/devlet-ihale-2886',
            icon: Landmark,
            badge: 'GELİR'
          }
        ]
      },
      {
        title: '2886 Süreç İşlemleri',
        items: [
          {
            name: '📁 İhale Dosyaları Yönetimi',
            path: '/devlet-ihale-2886?tab=dosyalar',
            icon: FolderOpen,
            badge: 'YÖNETİM'
          },
          {
            name: '🏛️ Satış & Kiralama Masası',
            path: '/devlet-ihale-2886',
            icon: Landmark,
            badge: '2886'
          },
          {
            name: '📊 Muhammen Bedel & Takdir',
            path: '/devlet-ihale-2886?tab=takdir',
            icon: Calculator
          },
          {
            name: '⚖️ Usul & Karar Matrisi (Md. 45/36/51)',
            path: '/devlet-ihale-2886?tab=usul',
            icon: Scale
          },
          {
            name: '🔨 İhale Günü & Teklifler',
            path: '/devlet-ihale-2886?tab=ihale_gunu',
            icon: Hammer
          },
          {
            name: '📑 Süreç & İlan Evrakları (16 Evrak)',
            path: '/devlet-ihale-2886?tab=evraklar',
            icon: FileText
          },
          {
            name: '💰 Kira Artış & Tahsilat Takibi',
            path: '/devlet-ihale-2886?tab=tahsilat',
            icon: Coins,
            badge: '5018'
          },
          {
            name: '🧮 İhale, Belge & Ofis Araçları',
            path: '/hesaplama-araclari',
            icon: Calculator,
            badge: 'ARAÇLAR'
          }
        ]
      },
      {
        title: 'Kayıtlar & Tanımlar (2886)',
        items: [
          {
            name: 'İdare & Emlak Servisi',
            icon: Building2,
            children: [
              { name: 'İdare Bilgileri', path: '/kurum', icon: Building2 },
              { name: 'Emlak & İstimlak Servisleri', path: '/birimler', icon: LayoutGrid },
              { name: 'İhale Yetkilileri & Raportörler', path: '/personel', icon: Users },
              { name: 'Encümen & Takdir Komisyonu', path: '/komisyonlar', icon: Users },
              { name: 'Görev Tanımları', path: '/komisyon-gorevleri', icon: Settings }
            ]
          },
          { name: 'İstekliler & Kiracılar / Alıcılar', path: '/firmalar', icon: Building2 },
          {
            name: 'Malzeme & Kodlar (2886)',
            icon: PackageSearch,
            children: [
              {
                name: 'Taşınmaz & Mal Kataloğu',
                path: '/malzemeler',
                icon: PackageSearch
              },
              { name: 'Taşınmaz / Taşınır Kodları', path: '/tasinirkod', icon: FolderTree },
              { name: 'Ölçü Birimleri', path: '/olcubirimleri', icon: Ruler }
            ]
          }
        ]
      },
      {
        title: 'Sistem',
        items: [
          { name: 'Raporlar & Gelir Cetvelleri', path: '/raporlar', icon: BarChart3 },
          { name: 'EBYS Resmî Yazı Şablonları', path: '/ebys', icon: FileText, badge: 'YENİ' },
          { name: '2886 Mevzuat ve Parametreler', path: '/mevzuat', icon: Scale },
          { name: 'Şablon Listesi ve Süreçler', path: '/taslakyonetim', icon: Star },
          { name: 'Sürüm Notları', path: '/changelog', icon: Megaphone },
          { name: 'Yardım & Kılavuzlar', path: '/yardim', icon: HelpCircle },
          {
            name: 'Ayarlar',
            icon: Settings,
            children: [
              { name: 'Genel Ayarlar', path: '/ayarlar', icon: Settings },
              { name: 'Kullanıcı Profili & Şifre', path: '/profil', icon: User },
              { name: 'Mevzuat ve Parametreler', path: '/mevzuat', icon: Scale },
              { name: 'Toplu İçe Aktarma', path: '/import', icon: Database },
              {
                name: 'Form Builder v2 (Sürükle & Bırak)',
                path: '/form-builder',
                icon: LayoutTemplate,
                badge: 'YENİ'
              },
              { name: 'Şablon Yönetimi', path: '/sablonlar', icon: FileText },
              { name: 'Şablon & Kategori Yönetimi', path: '/degiskenler', icon: Key }
            ]
          }
        ]
      }
    ]
  }

  if (procurementMode === 'ihale') {
    return [
      {
        title: 'İhale Süreçleri (KİK 19/21)',
        items: [
          { name: 'Gösterge Paneli', path: '/', icon: Home },
          {
            name: 'Harcama & İhale Merkezi',
            path: '/harcama-merkezi',
            icon: Landmark,
            badge: 'KİK'
          },
          {
            name: 'İhale Hakediş & Harcama',
            path: '/hakedis',
            icon: Hammer,
            badge: 'HAKEDİŞ'
          }
        ]
      },
      {
        title: 'İhale Süreç Yönetimi',
        items: [
          ...(activeDosyaId
            ? [
                {
                  name: 'Aktif Dosya (Süreç Takip)',
                  path: '/takip',
                  icon: FolderOpen,
                  badge: 'AÇIK'
                }
              ]
            : []),
          {
            name: 'Açık & Pazarlık İhale Masası',
            path: '/harcama-merkezi',
            icon: Landmark,
            badge: '19/21'
          },
          {
            name: 'Hakediş & Harcama İşlemleri',
            path: '/hakedis',
            icon: Hammer,
            badge: 'YENİ'
          },
          {
            name: 'İhale & Hesaplama Araçları',
            path: '/hesaplama-araclari',
            icon: Calculator,
            badge: '4734/2886'
          },
          {
            name: 'Proje Yönetimi & Yatırımlar',
            path: '/projeler',
            icon: FolderKanban
          },
          {
            name: 'Şablon Listesi ve Dokümanlar',
            path: '/taslakyonetim',
            icon: Star
          }
        ]
      },
      {
        title: 'Kayıtlar & Tanımlar (İhale)',
        items: [
          {
            name: 'İdare & Makam Yönetimi',
            icon: Building2,
            children: [
              { name: 'İdare Bilgileri', path: '/kurum', icon: Building2 },
              { name: 'İhale Birimleri (EKAP)', path: '/birimler', icon: LayoutGrid },
              { name: 'İhale Yetkilileri & Raportörler', path: '/personel', icon: Users },
              { name: 'İhale Komisyonları (Md. 6)', path: '/komisyonlar', icon: Users },
              { name: 'Muayene & Kabul Heyetleri', path: '/komisyonlar', icon: Users },
              { name: 'Görev Tanımları', path: '/komisyon-gorevleri', icon: Settings }
            ]
          },
          { name: 'Müteahhit & İstekli Firmalar', path: '/firmalar', icon: Building2 },
          {
            name: 'Pozlar & OKAS Kodları',
            icon: PackageSearch,
            children: [
              { name: 'ÇŞB Birim Fiyat Pozları', path: '/pozlar', icon: BookOpen },
              { name: 'OKAS Kodları', path: '/okaskod', icon: Tag },
              { name: 'Bütçe Kodları (4 Düzey)', path: '/butcekod', icon: Coins },
              {
                name: 'Mal, Hizmet & Yapım Kataloğu',
                path: '/malzemeler',
                icon: PackageSearch
              },
              { name: 'Ölçü Birimleri', path: '/olcubirimleri', icon: Ruler }
            ]
          }
        ]
      },
      {
        title: 'Sistem',
        items: [
          { name: 'Raporlar & Harcama Analizleri', path: '/raporlar', icon: BarChart3 },
          { name: 'EBYS Resmî Yazı Şablonları', path: '/ebys', icon: FileText, badge: 'YENİ' },
          { name: 'İhale Mevzuatı ve Parametreler', path: '/mevzuat', icon: Scale },
          { name: 'Sürüm Notları', path: '/changelog', icon: Megaphone },
          { name: 'Yardım & Kılavuzlar', path: '/yardim', icon: HelpCircle },
          {
            name: 'Ayarlar',
            icon: Settings,
            children: [
              { name: 'Genel Ayarlar', path: '/ayarlar', icon: Settings },
              { name: 'Kullanıcı Profili & Şifre', path: '/profil', icon: User },
              { name: 'Mevzuat ve Parametreler', path: '/mevzuat', icon: Scale },
              { name: 'Toplu İçe Aktarma', path: '/import', icon: Database },
              {
                name: 'Form Builder v2 (Sürükle & Bırak)',
                path: '/form-builder',
                icon: LayoutTemplate,
                badge: 'YENİ'
              },
              { name: 'Şablon Yönetimi', path: '/sablonlar', icon: FileText },
              { name: 'Şablon & Kategori Yönetimi', path: '/degiskenler', icon: Key }
            ]
          }
        ]
      }
    ]
  }

  // Doğrudan Temin (Varsayılan)
  return [
    {
      title: 'Ana Menü',
      items: [
        { name: 'Gösterge Paneli', path: '/', icon: Home },
        {
          name: 'Doğrudan Temin Dosyaları',
          path: '/dosyalar',
          icon: FileText,
          badge: '22'
        },
        {
          name: 'Harcama & Hakediş Merkezi',
          path: '/harcama-merkezi',
          icon: Landmark,
          badge: 'YENİ'
        }
      ]
    },
    {
      title: 'Süreç Yönetimi',
      items: [
        ...(activeDosyaId
          ? [
              {
                name: 'Aktif Dosya (Süreç Takip)',
                path: '/takip',
                icon: FolderOpen,
                badge: 'AÇIK'
              },
              {
                name: 'Süreç Akış Haritası',
                path: '/surec-akisi',
                icon: Layers,
                badge: 'BETA'
              }
            ]
          : []),
        {
          name: 'Doğrudan Temin Dosyaları',
          path: '/dosyalar',
          icon: FileText
        },
        {
          name: 'Proje Yönetimi & Yatırımlar',
          path: '/projeler',
          icon: FolderKanban,
          badge: 'YENİ'
        },
        {
          name: 'Hızlı Dosya Ekle / Güncelle',
          path: '/hizli-dosya-ekle',
          icon: Database
        },
        {
          name: 'Süreç Akış Haritası',
          path: '/surec-akisi',
          icon: Layers,
          badge: 'BETA'
        },
        {
          name: 'Hakediş & Harcama İşlemleri',
          path: '/hakedis',
          icon: Hammer
        },
        {
          name: 'İhale & Hesaplama Araçları',
          path: '/hesaplama-araclari',
          icon: Calculator,
          badge: '4734/2886'
        }
      ]
    },
    {
      title: 'Kayıtlar & Tanımlar',
      items: [
        {
          name: 'Kurum Yönetimi',
          icon: Building2,
          children: [
            { name: 'Kurum Bilgileri', path: '/kurum', icon: Building2 },
            { name: 'Birim Yönetimi', path: '/birimler', icon: LayoutGrid },
            { name: 'Personel Yönetimi', path: '/personel', icon: Users },
            { name: 'Ambar & Stok Yönetimi', path: '/ambar', icon: Boxes },
            { name: 'Proje Yönetimi & Yatırımlar', path: '/projeler', icon: FolderKanban },
            { name: 'Komisyon Yönetimi', path: '/komisyonlar', icon: Users },
            {
              name: 'Görev Tanımları',
              path: '/komisyon-gorevleri',
              icon: Settings
            }
          ]
        },
        { name: 'İstekli Firma Yönetimi', path: '/firmalar', icon: Building2 },
        {
          name: 'Malzeme & Kodlar',
          icon: PackageSearch,
          children: [
            {
              name: 'Mal, Hizmet & Yapım Kataloğu',
              path: '/malzemeler',
              icon: PackageSearch
            },
            { name: 'Taşınır Kodları', path: '/tasinirkod', icon: FolderTree },
            { name: 'OKAS Kodları', path: '/okaskod', icon: Tag },
            { name: 'Bütçe Kodları (4 Düzey)', path: '/butcekod', icon: Coins },
            { name: 'Birim Fiyat Pozları', path: '/pozlar', icon: BookOpen },
            { name: 'Ölçü Birimleri', path: '/olcubirimleri', icon: Ruler }
          ]
        }
      ]
    },
    {
      title: 'Sistem',
      items: [
        { name: 'Raporlar', path: '/raporlar', icon: BarChart3 },
        { name: 'EBYS Resmî Yazı Şablonları', path: '/ebys', icon: FileText, badge: 'YENİ' },
        {
          name: 'Şablon Listesi ve Süreçler',
          path: '/taslakyonetim',
          icon: Star
        },
        { name: 'Sürüm Notları', path: '/changelog', icon: Megaphone },
        { name: 'Yardım & Kılavuzlar', path: '/yardim', icon: HelpCircle },
        {
          name: 'Ayarlar',
          icon: Settings,
          children: [
            { name: 'Genel Ayarlar', path: '/ayarlar', icon: Settings },
            { name: 'Kullanıcı Profili & Şifre', path: '/profil', icon: User },
            { name: 'Mevzuat ve Parametreler', path: '/mevzuat', icon: Scale },
            { name: 'Toplu İçe Aktarma', path: '/import', icon: Database },
            {
              name: 'Form Builder v2 (Sürükle & Bırak)',
              path: '/form-builder',
              icon: LayoutTemplate,
              badge: 'YENİ'
            },
            {
              name: 'Şablon Yönetimi',
              path: '/sablonlar',
              icon: FileText
            },
            {
              name: 'Şablon & Kategori Yönetimi',
              path: '/degiskenler',
              icon: Key
            }
          ]
        }
      ]
    }
  ]
}
