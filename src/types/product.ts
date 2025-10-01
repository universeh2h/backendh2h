export interface Product {
    jumlah_transaksi: number
kode_produk: string
total_laba: number
kodeOperator : string
}

export interface TransaksiReseller {
    jumlah_transaksi : number
kode_reseller : string
namaReseller: string
produk_breakdown : Product[]
}


export type TransaksiResponse = {
    total_laba: number
total_transaksi: number
transaksi_per_reseller : TransaksiReseller[]
}

export type ApiResponse<T> = {
    data : T
    message : string
    success : boolean
}

export interface ProviderConfig {
  provider: string
  code: string[]
  color: {
    bg: string
    text: string
    badge: string
  }
}

export type ProductTrxTercuan = {
	kode_produk : string
	count_trx :  number
  total_laba : number
}

export type TrxTerCuan  = ProductTrxTercuan &{
  rata_laba : number
} 