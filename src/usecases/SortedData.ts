import { providers } from "@/hooks/provider";
import type { Product, ProviderConfig, TransaksiReseller } from "@/types/product";
import type { SortField, SortState } from "@/types/sorted";
import { groupProductsByProvider, type GroupedProducts } from "@/utils/utils";
export const getProviderTotal = (reseller: TransaksiReseller, provider: string): number => {
    const groupedProducts = groupProductsByProvider(reseller.produk_breakdown);
    const products = groupedProducts[provider as keyof GroupedProducts] || [];
    return products.reduce((sum: number, product: Product) => sum + product.total_laba, 0);
  };
export const getProviderColor = (providerName: string): ProviderConfig["color"] => {
    const provider = providers.find((p) => p.provider === providerName);
    return provider
      ? provider.color
      : {
          bg: "bg-gray-50",
          text: "text-gray-700",
          badge: "bg-gray-100 border-gray-300",
        };
  };

export  const handleSort = (field: SortField,setSortState : React.Dispatch<React.SetStateAction<SortState>>) => {
      setSortState(prevState => {
        if (prevState.field === field) {
          // Same field, toggle direction
          if (prevState.direction === "asc") {
            return { field, direction: "desc" };
          } else if (prevState.direction === "desc") {
            return { field: null, direction: null };
          } else {
            return { field, direction: "asc" };
          }
        } else {
          // Different field, start with asc
          return { field, direction: "asc" };
        }
      });
    };

export const getSortedData = (data: TransaksiReseller[] | undefined, sortState : SortState) => {
    if (!data || !sortState.field || !sortState.direction) return data;

    return [...data].sort((a, b) => {
      let aValue: number = 0;
      let bValue: number = 0;

      switch (sortState.field) {
        case "trx":
          aValue = a.jumlah_transaksi;
          bValue = b.jumlah_transaksi;
          break;
        case "laba":
          aValue = a.produk_breakdown?.reduce((sum: number, product: Product) => sum + product.total_laba, 0) || 0;
          bValue = b.produk_breakdown?.reduce((sum: number, product: Product) => sum + product.total_laba, 0) || 0;
          break;
        case "indosat":
          aValue = getProviderTotal(a, "INDOSAT");
          bValue = getProviderTotal(b, "INDOSAT");
          break;
        case "telkomsel":
          aValue = getProviderTotal(a, "TELKOMSEL");
          bValue = getProviderTotal(b, "TELKOMSEL");
          break;
        case "xl":
          aValue = getProviderTotal(a, "XL");
          bValue = getProviderTotal(b, "XL");
          break;
        case "axis":
          aValue = getProviderTotal(a, "AXIS");
          bValue = getProviderTotal(b, "AXIS");
          break;
        case "three":
          aValue = getProviderTotal(a, "THREE");
          bValue = getProviderTotal(b, "THREE");
          break;
        case "game":
          aValue = getProviderTotal(a, "GAME");
          bValue = getProviderTotal(b, "GAME");
          break;
        case "other":
          aValue = getProviderTotal(a, "OTHER");
          bValue = getProviderTotal(b, "OTHER");
          break;
      }

      if (sortState.direction === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  };