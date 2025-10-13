import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetProdukTerbanyak, useGetProdukTerCuan } from "@/hooks/api";
import type { ProductTrxTercuan, TrxTerCuan } from "@/types/product";
import { formatCurrency } from "@/utils/utils";
import {
    Package
} from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";

export default function AnalyticsPage() {
  const [searchParams,setSearchParams] = useSearchParams();
  const kodeReseller = searchParams.get("kode_reseller") as string;

  const [startDate1, setStartDate1] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate1, setEndDate1] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [startDate2, setStartDate2] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate2, setEndDate2] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [startDate3, setStartDate3] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate3, setEndDate3] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Fetch data untuk 3 periode berbeda
  const { dataAnalyst: data1 } = useGetProdukTerbanyak({
    startDate: startDate1,
    endDate: endDate1,
    kodeReseller,
  });

  const { dataAnalyst: data2 } = useGetProdukTerbanyak({
    startDate: startDate2,
    endDate: endDate2,
    kodeReseller,
  });

  const { dataAnalyst: data3 } = useGetProdukTerbanyak({
    startDate: startDate3,
    endDate: endDate3,
    kodeReseller,
  });
  const { dataAnalyst: tercuan1 } = useGetProdukTerCuan({
    startDate: startDate1,
    endDate: endDate1,
    kodeReseller,
  });

  const { dataAnalyst: tercuan2 } = useGetProdukTerCuan({
    startDate: startDate2,
    endDate: endDate2,
    kodeReseller,
  });

  const { dataAnalyst: tercuan3 } = useGetProdukTerCuan({
    startDate: startDate3,
    endDate: endDate3,
    kodeReseller,
  });


  const renderPeriodCard = (
    data: { data: ProductTrxTercuan[] } | undefined,
dataCuan : {data : TrxTerCuan[]}  |  undefined,
    index: number,
    startDate: string,
    endDate: string,
    setStartDate: (value: string) => void,
    setEndDate: (value: string) => void
  ) => {


    return (
      <Card key={index} className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg">
              Periode {index + 1}
              <Badge variant="outline" className="ml-2 text-xs">
                {startDate} - {endDate}
              </Badge>
            </CardTitle>
          </div>
          <div className="flex flex-row gap-2 space-y-2 w-full">
            <div className="">
              <label className="text-xs font-medium mb-1 block">
                Start Date
              </label>
              <Input
                type="date"
                value={startDate}
                className="w-full"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">End Date</label>
              <Input
                type="date"
                className="w-full"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-3 ">
          {data?.data && data.data.length > 0 ? (
            <>

              <div className="overflow-x-auto max-w-[500px] w-full">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                        No
                      </th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                        Produk
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Trx
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Laba
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((product, idx) => (
                      <tr key={idx} className="border-b hover:bg-accent/50">
                        <td className="py-2 px-2 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2 font-medium truncate max-w-[120px]">
                          {product.kode_produk}
                        </td>
                        <td className="py-2 px-2 text-right">
                          <Badge variant="secondary" className="text-xs">
                            {product.count_trx}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 text-right font-semibold text-green-600">
                          {formatCurrency(product.total_laba)}
                        </td>
                      </tr>
                    ))}
                
                  </tbody>
                </table>
              
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package size={48} className="mx-auto mb-2 opacity-50" />
              <p>Tidak ada data</p>
              <p className="text-xs">Pilih tanggal untuk melihat data</p>
            </div>
          )}
          {dataCuan?.data && dataCuan.data.length > 0 ? (
            <>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                        No
                      </th>
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                        Produk
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Trx
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Laba
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">
                        Rata
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataCuan.data.map((product, idx) => (
                      <tr key={idx} className="border-b hover:bg-accent/50">
                        <td className="py-2 px-2 text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2 font-medium truncate max-w-[120px]">
                          {product.kode_produk}
                        </td>
                        <td className="py-2 px-2 text-right">
                          <Badge variant="secondary" className="text-xs">
                            {product.count_trx}
                          </Badge>
                        </td>
                        <td className="py-2 px-2 text-right font-semibold text-green-600">
                          {formatCurrency(product.total_laba)}
                        </td>
                        <td className="py-2 px-2 text-right font-semibold text-green-600">
                          {formatCurrency(product.rata_laba)}
                        </td>
                      </tr>
                    ))}
                
                  </tbody>
                </table>
              
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Package size={48} className="mx-auto mb-2 opacity-50" />
              <p>Tidak ada data</p>
              <p className="text-xs">Pilih tanggal untuk melihat data</p>
            </div>
          )}
          
        </CardContent>
      </Card>
    );
  };


  return (
    <main className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2 uppercase">
          TOLONG NAIKAN GAJI IT
        </h1>
        <p className="text-muted-foreground">FIX LABA NAIK YE???</p>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {renderPeriodCard(
          data1,
          tercuan1,
          0,
          startDate1,
          endDate1,
          setStartDate1,
          setEndDate1
        )}
        {renderPeriodCard(
          data2,
          tercuan2,
          1,
          startDate2,
          endDate2,
          setStartDate2,
          setEndDate2
        )}
        {renderPeriodCard(
          data3,
          tercuan3,
          2,
          startDate3,
          endDate3,
          setStartDate3,
          setEndDate3
        )}
      </div>

     
    </main>
  );
}
