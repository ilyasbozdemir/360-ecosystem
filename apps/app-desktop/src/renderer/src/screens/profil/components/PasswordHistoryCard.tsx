import React, { useState } from 'react'
import { Key, Lock, User, Eye, EyeOff, Check, Copy, Laptop, Calendar } from 'lucide-react'

export interface PasswordHistoryItem {
  id?: string
  username?: string
  password?: string
  hostname?: string
  osUsername?: string
  createdAt?: string
}

interface PasswordHistoryCardProps {
  passwordHistory: PasswordHistoryItem[]
  adminPassword: string
}

export const PasswordHistoryCard: React.FC<PasswordHistoryCardProps> = ({
  passwordHistory,
  adminPassword
}) => {
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (itemId: string, pass?: string): void => {
    if (!pass) return
    navigator.clipboard.writeText(pass)
    setCopiedId(itemId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleVisibility = (itemId: string): void => {
    setVisiblePasswords((prev) => ({ ...prev, [itemId]: !prev[itemId] }))
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Geçmiş Şifre ve Veritabanı Kilit Arşivi ({passwordHistory.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Migration kolon güncellemeleri gibi, geçmiş şifreler de tarih ve cihazla
              ilişkilendirilerek saklanır. Eski yedek veya çalışma dosyalarını açmak için aşağıdaki
              geçmiş kilit şifrelerini kullanabilirsiniz.
            </p>
          </div>
        </div>
        <span className="text-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <Lock className="w-3.5 h-3.5" /> SQLite Kilit Uyumlu
        </span>
      </div>

      {passwordHistory.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          Henüz kaydedilmiş geçmiş şifre kaydı bulunmuyor. Şifre değişiklikleri otomatik olarak
          buraya arşivlenir.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {passwordHistory.map((item, index) => {
            const itemId = item.id || `hist_${index}`
            const isShown = !!visiblePasswords[itemId]
            const isCurrent = item.password === adminPassword
            const isCopied = copiedId === itemId

            return (
              <div
                key={itemId}
                className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between gap-2 transition-all ${
                  isCurrent
                    ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60'
                    : 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {item.username || 'admin'}
                  </span>
                  {isCurrent ? (
                    <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
                      Güncel Şifre
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      Geçmiş Kayıt
                    </span>
                  )}
                </div>

                <div className="space-y-1 my-1">
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 select-all">
                      {isShown ? item.password : '••••••••••••'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleVisibility(itemId)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        title={isShown ? 'Gizle' : 'Göster'}
                      >
                        {isShown ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(itemId, item.password)}
                        className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Şifreyi Kopyala"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                  <span
                    className="flex items-center gap-1 truncate max-w-[140px]"
                    title={item.hostname}
                  >
                    <Laptop className="w-3 h-3 text-slate-400 shrink-0" />{' '}
                    {item.hostname || 'Bilinmiyor'}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('tr-TR') : '-'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
