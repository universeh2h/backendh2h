import { providers } from "@/hooks/provider"
import type { Product } from "@/types/product"
export interface GroupedProducts {
  [key: string]: Product[]
}
export const formatCurrency = (amount?: number): string => {
    if (!amount) return "Rp 0"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const extractLettersOnly = (code: string): string => {
    return code.replace(/[^A-Za-z]/g, "")
  }



  // Function to group products by provider
export const groupProductsByProvider = (products?: Product[]): GroupedProducts => {
    if (!products) return {}
    
    const grouped: GroupedProducts = {
      INDOSAT: [],
      TELKOMSEL: [],
      XL: [],
      AXIS: [],
      THREE: [],
      GAME :[],
      OTHER: []
    }

    products
    .forEach((product: Product) => {
      const productCode = extractLettersOnly(product.kodeOperator)
      let assigned = false

      // Check each provider
      for (const provider of providers) {
        if (provider.code.some((code: string) => productCode.includes(code))) {
          grouped[provider.provider].push(product)
          assigned = true
          break
        }
      }
      if (!assigned) {
        grouped.OTHER.push(product)
      }
    })

    return grouped
  }



  export const formatDate = (date?: Date): string => {
    if (!date) return "Rp 0"
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle : "medium",
      minute : "2-digit",
    }).format(date)
  }