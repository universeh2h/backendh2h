import type { ApiResponse, Product, TransaksiReseller, TransaksiResponse } from "@/types/product";
import { groupProductsByProvider } from "@/utils/utils";
import { useMemo } from "react";



// Option 1: Sebagai custom hook
export function useProviderTotals(dataAnalyst: ApiResponse<TransaksiResponse> | undefined) {
  return useMemo(() => {
    if (!dataAnalyst?.data?.transaksi_per_reseller) {
      return {
        INDOSAT: 0,
        TELKOMSEL: 0,
        XL: 0,
        AXIS: 0,
        THREE: 0,
        GAME: 0,
        OTHER: 0,
        totalTrx: 0,
        totalLaba: 0
      };
    }

    const totals = {
      INDOSAT: 0,
      TELKOMSEL: 0,
      XL: 0,
      AXIS: 0,
      THREE: 0,
      GAME: 0,
      OTHER: 0,
      totalTrx: 0,
      totalLaba: 0
    };

    dataAnalyst.data.transaksi_per_reseller.forEach((reseller: TransaksiReseller) => {
      const grouped = groupProductsByProvider(reseller.produk_breakdown);
      
      // Sum each provider
      totals.INDOSAT += grouped.INDOSAT?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
      totals.TELKOMSEL += grouped.TELKOMSEL?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
      totals.XL += grouped.XL?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
      totals.AXIS += grouped.AXIS?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
      totals.THREE += grouped.THREE?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
      totals.GAME += grouped.GAME?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
      totals.OTHER += grouped.OTHER?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
      
      // Sum transactions and profit
      totals.totalTrx += reseller.jumlah_transaksi;
      totals.totalLaba += reseller.produk_breakdown?.reduce(
        (sum: number, product: Product) => sum + product.total_laba,
        0
      ) || 0;
    });

    return totals;
  }, [dataAnalyst?.data?.transaksi_per_reseller]); // ✅ Dependency yang benar
}

// Option 2: Sebagai function biasa (jika tidak perlu memoization)
export function calculateProviderTotals(dataAnalyst: ApiResponse<TransaksiResponse> | undefined) {
  if (!dataAnalyst?.data?.transaksi_per_reseller) {
    return {
      INDOSAT: 0,
      TELKOMSEL: 0,
      XL: 0,
      AXIS: 0,
      THREE: 0,
      GAME: 0,
      OTHER: 0,
      totalTrx: 0,
      totalLaba: 0
    };
  }

  const totals = {
    INDOSAT: 0,
    TELKOMSEL: 0,
    XL: 0,
    AXIS: 0,
    THREE: 0,
    GAME: 0,
    OTHER: 0,
    totalTrx: 0,
    totalLaba: 0
  };

  dataAnalyst.data.transaksi_per_reseller.forEach((reseller: TransaksiReseller) => {
    const grouped = groupProductsByProvider(reseller.produk_breakdown);
    
    totals.INDOSAT += grouped.INDOSAT?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
    totals.TELKOMSEL += grouped.TELKOMSEL?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
    totals.XL += grouped.XL?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
    totals.AXIS += grouped.AXIS?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
    totals.THREE += grouped.THREE?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
    totals.GAME += grouped.GAME?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
    totals.OTHER += grouped.OTHER?.reduce((sum, p) => sum + p.total_laba, 0) || 0;
    
    totals.totalTrx += reseller.jumlah_transaksi;
    totals.totalLaba += reseller.produk_breakdown?.reduce(
      (sum: number, product: Product) => sum + product.total_laba,
      0
    ) || 0;
  });

  return totals;
}