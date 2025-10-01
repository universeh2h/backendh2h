import { day, useDataAnalysists } from "@/hooks/api";
import type {
  Product,
  TransaksiReseller
} from "@/types/product";
import type { SortField, SortState } from "@/types/sorted";
import { getProviderColor, getSortedData, handleSort } from "@/usecases/SortedData";
import {
  formatCurrency,
  groupProductsByProvider,
  type GroupedProducts,
} from "@/utils/utils";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { useState, useMemo, type ChangeEvent, type JSX, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { calculateProviderTotals } from "@/usecases/providerTotals";
import { useNavigate } from "react-router";

function Component(): JSX.Element {
  const navigate = useNavigate()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [sortState, setSortState] = useState<SortState>({
    field: null,
    direction: null
  });

  const { dataAnalyst } = useDataAnalysists({
    startDate,
    endDate,
  });

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value);
  };
  
  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

   const providerTotals = calculateProviderTotals(dataAnalyst); 


  const renderProductGroup = (
    products: Product[],
    providerName: string
  ): JSX.Element => {
    if (!products || products.length === 0) {
      return <span className="text-gray-400 text-xs">-</span>;
    }
    const colors = getProviderColor(providerName);
    const totalProviderProfit = products.reduce(
      (sum: number, product: Product) => sum + product.total_laba,
      0
    );

    return (
      <span className={`text-sm font-bold ${colors.text}`}>
        {formatCurrency(totalProviderProfit)}
      </span>
    );
  };

  const toggleRowExpansion = (kodeReseller: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(kodeReseller)) {
      newExpandedRows.delete(kodeReseller);
    } else {
      newExpandedRows.add(kodeReseller);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderExpandedContent = (reseller: TransaksiReseller): JSX.Element => {
    const groupedProducts = groupProductsByProvider(reseller.produk_breakdown);

    return (
      <div className="p-6 bg-gray-50 border-t">
        <h4 className="font-semibold text-gray-800 mb-4 text-lg">
          Detail Produk - {reseller.namaReseller}
        </h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(groupedProducts).map(([provider, products]) => {
            if (products.length === 0) return null;
            const colors = getProviderColor(provider);
            const totalLaba = products.reduce(
              (sum, p) => sum + p.total_laba,
              0
            );
            const totalTrx = products.reduce(
              (sum, p) => sum + p.jumlah_transaksi,
              0
            );

            return (
              <Card key={provider} className={`${colors.bg}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className={`text-base ${colors.text}`}>
                      {provider === "INDOSAT" && "🟡"}
                      {provider === "TELKOMSEL" && "🔴"}
                      {provider === "XL" && "🔵"}
                      {provider === "AXIS" && "🟣"}
                      {provider === "THREE" && "🩷"}
                      {provider === "GAME" && "🎮"}
                      {provider === "OTHER" && "⚫"}
                      {" " + provider}
                    </CardTitle>
                    <div className="text-right">
                      <div className={`text-sm font-bold ${colors.text}`}>
                        {formatCurrency(totalLaba)}
                      </div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {totalTrx} TRX
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">No</TableHead>
                        <TableHead>Kode Produk</TableHead>
                        <TableHead>Total Laba</TableHead>
                        <TableHead>Trx</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products
                        .sort((a, b) =>
                          a.kode_produk.localeCompare(b.kode_produk, undefined, {
                            numeric: true,
                          })
                        )
                        .map((product, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-center">{idx + 1}</TableCell>
                            <TableCell className="font-medium">
                              {product.kode_produk}
                            </TableCell>
                            <TableCell className={`font-semibold ${colors.text}`}>
                              {formatCurrency(product.total_laba)}
                            </TableCell>
                            <TableCell className="text-gray-500 text-sm">
                              {product.jumlah_transaksi}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSortButton = (field: SortField, label: string, className?: string) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field, setSortState)}
      className="flex items-center gap-1 h-auto p-1"
      title="Klik untuk sort"
    >
      <span className={className}>{label}</span>
      <div className="flex flex-col -space-y-1">
        <ChevronUp
          size={14}
          className={`transition-colors ${
            sortState.field === field && sortState.direction === "asc"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        />
        <ChevronDown
          size={14}
          className={`transition-colors ${
            sortState.field === field && sortState.direction === "desc"
              ? "text-blue-600"
              : "text-gray-400"
          }`}
        />
      </div>
    </Button>
  );

  const data = dataAnalyst?.data;
  const sortedData = getSortedData(data?.transaksi_per_reseller, sortState);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-[1350px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Dashboard Analytics
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-700">
                  Total Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">
                  {data?.total_transaksi?.toLocaleString("id-ID") ?? "0"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-700">
                  Total Laba
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(data?.total_laba)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-700">
                  Member Aktif
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-600">
                  {data?.transaksi_per_reseller?.length ?? 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Date Filter */}
          <div className="flex justify-end items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-auto"
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="w-auto"
              />
            </div>
          </div>
        </div>

        {/* Main Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="w-16">No</TableHead>
                    <TableHead>Kode Reseller</TableHead>
                    <TableHead>Nama Reseller</TableHead>
                    <TableHead className="text-center">
                      {renderSortButton("trx", "TRX")}
                    </TableHead>
                    <TableHead>
                      {renderSortButton("laba", "Laba")}
                    </TableHead>
                    <TableHead>
                      {renderSortButton("indosat", "🟡 Indosat", "text-yellow-700")}
                    </TableHead>
                    <TableHead>
                      {renderSortButton("telkomsel", "🔴 Telkomsel", "text-red-700")}
                    </TableHead>
                    <TableHead>
                      {renderSortButton("xl", "🔵 XL", "text-blue-700")}
                    </TableHead>
                    <TableHead>
                      {renderSortButton("axis", "🟣 AXIS", "text-purple-700")}
                    </TableHead>
                    <TableHead>
                      {renderSortButton("three", "🩷 THREE", "text-pink-700")}
                    </TableHead>
                    <TableHead>
                      {renderSortButton("game", "🎮 GAMES", "text-emerald-700")}
                    </TableHead>
                    <TableHead>
                      {renderSortButton("other", "⚫ Other", "text-gray-700")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData?.map((reseller: TransaksiReseller, idx: number) => {
                    const totalLaba: number =
                      reseller.produk_breakdown?.reduce(
                        (sum: number, product: Product) =>
                          sum + product.total_laba,
                        0
                      ) || 0;

                    const groupedProducts: GroupedProducts =
                      groupProductsByProvider(reseller.produk_breakdown);
                    const isExpanded = expandedRows.has(reseller.kode_reseller);

                    return (
                      <Fragment key={reseller.kode_reseller}>
                        <TableRow >
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                toggleRowExpansion(reseller.kode_reseller)
                              }
                              className="h-8 w-8 p-0"
                              title={isExpanded ? "Tutup detail" : "Lihat detail"}
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">
                            {idx + 1}
                          </TableCell>
                          <TableCell onClick={()  => navigate(`/analytics?kode_reseller=${reseller.kode_reseller}&startDate=${day}&endDate=${day}`)} className="font-medium cursor-pointer">
                            
                            {reseller.kode_reseller}
                          </TableCell>
                          <TableCell>
                            {reseller.namaReseller.slice(0, 15)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">
                              {reseller.jumlah_transaksi.toLocaleString("id-ID")}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            {formatCurrency(totalLaba)}
                          </TableCell>
                          <TableCell>
                            {renderProductGroup(
                              groupedProducts.INDOSAT,
                              "INDOSAT"
                            )}
                          </TableCell>
                          <TableCell>
                            {renderProductGroup(
                              groupedProducts.TELKOMSEL,
                              "TELKOMSEL"
                            )}
                          </TableCell>
                          <TableCell>
                            {renderProductGroup(groupedProducts.XL, "XL")}
                          </TableCell>
                          <TableCell>
                            {renderProductGroup(groupedProducts.AXIS, "AXIS")}
                          </TableCell>
                          <TableCell>
                            {renderProductGroup(groupedProducts.THREE, "THREE")}
                          </TableCell>
                          <TableCell>
                            {renderProductGroup(groupedProducts.GAME, "GAME")}
                          </TableCell>
                          <TableCell>
                            {renderProductGroup(groupedProducts.OTHER, "OTHER")}
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow>
                            <TableCell colSpan={13} className="p-0">
                              {renderExpandedContent(reseller)}
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    );
                  }) ?? []}
                  
                  {/* TOTAL ROW */}
                  <TableRow className="bg-gray-100 font-bold border-t-2 border-gray-300">
                    <TableCell colSpan={4} className="text-left uppercase">
                      TOTAL
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-bold">
                        {providerTotals.totalTrx.toLocaleString("id-ID")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-green-700 font-bold">
                      {formatCurrency(providerTotals.totalLaba)}
                    </TableCell>
                    <TableCell className="text-yellow-700 font-bold">
                      {formatCurrency(providerTotals.INDOSAT)}
                    </TableCell>
                    <TableCell className="text-red-700 font-bold">
                      {formatCurrency(providerTotals.TELKOMSEL)}
                    </TableCell>
                    <TableCell className="text-blue-700 font-bold">
                      {formatCurrency(providerTotals.XL)}
                    </TableCell>
                    <TableCell className="text-purple-700 font-bold">
                      {formatCurrency(providerTotals.AXIS)}
                    </TableCell>
                    <TableCell className="text-pink-700 font-bold">
                      {formatCurrency(providerTotals.THREE)}
                    </TableCell>
                    <TableCell className="text-emerald-700 font-bold">
                      {formatCurrency(providerTotals.GAME)}
                    </TableCell>
                    <TableCell className="text-gray-700 font-bold">
                      {formatCurrency(providerTotals.OTHER)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Component;