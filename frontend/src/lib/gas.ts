// Cliente JSONP para Google Apps Script
// GAS soporta JSONP automáticamente con el parámetro ?callback=

const GAS_URL =
  'https://script.google.com/a/macros/mercadolibre.com/s/' +
  'AKfycbyV6w9BwYpJmJSnW6CzdCVdYaPxr4xuwwOVOt5HQ7yucJDGCD-a1dx0pNWz99u_XXIR/exec'

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface GASEmbajador {
  id: string
  nombre: string
  mercado: string
  coins_balance: number
  coupon_code: string | null
  estado?: string
  referidos_activos?: number
}

export interface GASMilestone {
  tipo: string
  coins?: number
}

export interface GASReferralMGM {
  id: string | number
  nombre_negocio: string
  ruc?: string
  referred_email?: string | null
  estado: string
  motivo_rechazo?: string | null
  expires_at?: string | null
  milestones: GASMilestone[]
}

export interface GASTransaction {
  id?: string | number
  created_at: string
  descripcion: string
  tipo: 'credito' | 'debito'
  coins: number
}

// ─── JSONP helper ─────────────────────────────────────────────────────────────

function jsonp<T>(params: Record<string, string>, timeoutMs = 12000): Promise<T> {
  return new Promise((resolve, reject) => {
    const cbName = `_gas_cb_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const query = new URLSearchParams({ ...params, callback: cbName }).toString()
    const script = document.createElement('script')
    script.src = `${GAS_URL}?${query}`

    let done = false

    const cleanup = () => {
      if (document.head.contains(script)) document.head.removeChild(script)
      delete (window as unknown as Record<string, unknown>)[cbName]
    }

    ;(window as unknown as Record<string, unknown>)[cbName] = (data: T) => {
      done = true
      cleanup()
      resolve(data)
    }

    script.onerror = () => {
      done = true
      cleanup()
      reject(new Error('Error al conectar con la API'))
    }

    document.head.appendChild(script)

    setTimeout(() => {
      if (!done) {
        cleanup()
        reject(new Error('Tiempo de espera agotado'))
      }
    }, timeoutMs)
  })
}

// ─── Endpoints ────────────────────────────────────────────────────────────────

export const getEmbajadores = () =>
  jsonp<GASEmbajador[]>({ action: 'getEmbajadores' })

export const getEmbajador = (id: string) =>
  jsonp<GASEmbajador>({ action: 'getEmbajador', id })

export const getReferidosMGM = (ambassadorId: string) =>
  jsonp<GASReferralMGM[]>({ action: 'getReferidosMGM', ambassador_id: ambassadorId })

export const getWallet = (ambassadorId: string) =>
  jsonp<GASTransaction[]>({ action: 'getWallet', ambassador_id: ambassadorId })
