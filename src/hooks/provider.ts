import type { ProviderConfig } from "@/types/product";

export const providers: ProviderConfig[] = [
    {
      provider: "INDOSAT",
      code: ["ISAT"],
      color: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        badge: "bg-yellow-100 border-yellow-300"
      }
    },
    {
      provider: "TELKOMSEL", 
      code: ["TSEL"],
      color: {
        bg: "bg-red-50",
        text: "text-red-700",
        badge: "bg-red-100 border-red-300"
      }
    },
    {
      provider: "XL",
      code: ["XL", "XLP", "XLD"],
      color: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        badge: "bg-blue-100 border-blue-300"
      }
    },
      {
      provider: "GAME",
      code: ["GAME"],
      color: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        badge: "bg-blue-100 border-blue-300"
      }
    },
    {
      provider: "AXIS",
      code: ["AXIS"],
      color: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        badge: "bg-purple-100 border-purple-300"
      }
    },
    {
      provider: "THREE",
      code: ["THRE", "3", "THP", "THD"],
      color: {
        bg: "bg-pink-50",
        text: "text-pink-700",
        badge: "bg-pink-100 border-pink-300"
      }
    }
  ]