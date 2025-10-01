import { type ApiResponse, type ProductTrxTercuan, type TransaksiResponse, type TrxTerCuan } from "@/types/product"
import { useEffect, useState } from "react"

export async function useGetData(url : string){
    const data = await fetch(url)
    return data.json()
}

export const day = new Date().toISOString().split('T')[0]

export function useDataAnalysists({
    startDate,
    endDate
} : {
    startDate : string,
    endDate : string
}){
    const [dataAnalyst, setDataAnalyst] = useState<ApiResponse<TransaksiResponse> | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const result = await useGetData(`https://pf69lscd-5000.asse.devtunnels.ms/api/v1?startDate=${startDate}&endDate=${endDate}`) 
                setDataAnalyst(result)
                setError(null)
            } catch (err : any) {
                setError(err.message)
                console.error('Error fetching data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()

       const interval = setInterval(fetchData, 5000)

        return () => clearInterval(interval)
    }, [startDate,endDate])

    return { dataAnalyst, loading, error }
}

export function useGetProdukTerbanyak({
    startDate = day,
    endDate = day,
    kodeReseller
} : {
    startDate?: string,
    endDate?: string
    kodeReseller?: string
}){
    const [dataAnalyst, setDataAnalyst] = useState<ApiResponse<ProductTrxTercuan[]> | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    useEffect(() => {
        // FIX 2: Jangan fetch jika kodeReseller kosong
        if (!kodeReseller) {
            setDataAnalyst(undefined);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true)
                const result = await useGetData(`https://pf69lscd-5000.asse.devtunnels.ms/api/v1/trxterbanyak?startDate=${startDate}&endDate=${endDate}&kodeReseller=${kodeReseller}`) 
                setDataAnalyst(result)
                setError(null)
            } catch (err : any) {
                setError(err.message)
                console.error('Error fetching data:', err)
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
        
    // FIX 3: Tambahkan kodeReseller ke dependency array
    }, [startDate, endDate, kodeReseller])

    return { dataAnalyst, loading, error }
}

export function useGetProdukTerCuan({
    startDate = day,
    endDate = day,
    kodeReseller
} : {
    startDate?: string,
    endDate?: string
    kodeReseller?: string
}){
    const [dataAnalyst, setDataAnalyst] = useState<ApiResponse<TrxTerCuan[]> | undefined>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    useEffect(() => {
        // FIX 2: Jangan fetch jika kodeReseller kosong
        if (!kodeReseller) {
            setDataAnalyst(undefined);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true)
                const result = await useGetData(`https://pf69lscd-5000.asse.devtunnels.ms/api/v1/trxtercuan?startDate=${startDate}&endDate=${endDate}&kodeReseller=${kodeReseller}`) 
                setDataAnalyst(result)
                setError(null)
            } catch (err : any) {
                setError(err.message)
                console.error('Error fetching data:', err)
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
        const interval = setInterval(fetchData, 5000)
        return () => clearInterval(interval)
        
    // FIX 3: Tambahkan kodeReseller ke dependency array
    }, [startDate, endDate, kodeReseller])

    return { dataAnalyst, loading, error }
}

