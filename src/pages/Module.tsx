import { useGetModule, useGetSaldoModule } from "@/hooks/api";
import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { dateNow } from "./Report";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type SortField = "kode" | "label" | "saldo" | "total_trx";
type SortOrder = "asc" | "desc";

export function ModuleOtomax() {
  const [sortField, setSortField] = useState<SortField>("kode");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [select, setSelectKode] = useState<number | null>(null);
  const [period1Start, setPeriod1Start] = useState(dateNow);
  const { dataModul } = useGetModule(period1Start);
  const { dataModul: parameter_parsing, isLoading, open, setOpen } = useGetSaldoModule(select);
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedData = useMemo(() => {
    const sorted = [...dataModul].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [dataModul, sortField, sortOrder]);

  const criticalBalance = useMemo(() => {
    return dataModul.filter((modul) => modul.saldo < 200000);
  }, [dataModul]);

  const lowBalanceModules = useMemo(() => {
    return dataModul.filter(
      (modul) => modul.saldo >= 200000 && modul.saldo < 500000
    );
  }, [dataModul]);

  const yellowWarning = useMemo(() => {
    return dataModul.filter(
      (modul) => modul.saldo < 1500000 || modul.total_trx < 10
    );
  }, [dataModul]);

  const totalSaldo = useMemo(() => {
    return dataModul.reduce((sum, modul) => sum + modul.saldo, 0);
  }, [dataModul]);

  const totalTrx = useMemo(() => {
    return dataModul.reduce((sum, modul) => sum + modul.total_trx, 0);
  }, [dataModul]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 inline" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 inline" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 inline" />
    );
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <style>{`
                @keyframes blink {
                    0%, 100% { 
                        background-color: rgba(220, 38, 38, 0.95);
                        color: white;
                    }
                    50% { 
                        background-color: rgba(153, 27, 27, 0.95);
                        color: white;
                    }
                }
                .blink-row {
                    animation: blink 1.5s ease-in-out infinite;
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Wallet className="h-10 w-10 text-blue-600" />
            Modul Otomax Dashboard
          </h1>
          <p className="text-slate-600">
            Monitor dan kelola saldo modul Anda secara real-time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-blue-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="text-sm font-medium text-slate-600 mb-2">
              Total Modul
            </div>
            <div className="text-3xl font-bold text-blue-600">
              {dataModul.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Modul Aktif</p>
          </div>

          <div className="bg-white border border-green-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="text-sm font-medium text-slate-600 mb-2">
              Total Saldo
            </div>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(totalSaldo)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Saldo Keseluruhan</p>
          </div>

          <div className="bg-white border border-purple-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="text-sm font-medium text-slate-600 mb-2">
              Total Transaksi
            </div>
            <div className="text-3xl font-bold text-purple-600">{totalTrx}</div>
            <p className="text-xs text-slate-500 mt-1">Transaksi Hari Ini</p>
          </div>

          <div className="bg-white border border-red-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="text-sm font-medium text-slate-600 mb-2">
              Peringatan
            </div>
            <div className="text-3xl font-bold text-red-600">
              {criticalBalance.length +
                lowBalanceModules.length +
                yellowWarning.length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Perlu Perhatian</p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Periode Tanggal
              </label>
              <input
                type="date"
                value={period1Start}
                onChange={(e) => setPeriod1Start(e.target.value)}
                className="max-w-xs border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Alerts */}
        {criticalBalance.length > 0 && (
          <div className="mb-4 shadow-lg animate-slide-in border border-red-400 bg-red-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-800 mb-1">
                  🚨 Saldo Kritis!
                </h3>
                <p className="mb-2 font-medium text-red-700">
                  Ada {criticalBalance.length} modul dengan saldo di bawah Rp
                  200.000:
                </p>
                <ul className="mt-2 space-y-1">
                  {criticalBalance.map((modul) => (
                    <li
                      key={modul.kode}
                      className="flex items-center gap-2 p-2 bg-red-100 rounded"
                    >
                      <AlertTriangle className="h-4 w-4 text-red-700" />
                      <span className="font-medium">{modul.label}</span>
                      <span className="text-sm text-slate-600">
                        ({modul.kode})
                      </span>
                      <span className="ml-auto font-bold text-red-700">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(modul.saldo)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {lowBalanceModules.length > 0 && (
          <div className="mb-4 shadow-lg animate-slide-in border border-orange-400 bg-orange-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-orange-800 mb-1">
                  ⚠️ Saldo Rendah!
                </h3>
                <p className="mb-2 font-medium text-orange-700">
                  Ada {lowBalanceModules.length} modul dengan saldo Rp 200.000 -
                  Rp 500.000:
                </p>
                <ul className="mt-2 space-y-1">
                  {lowBalanceModules.map((modul) => (
                    <li
                      key={modul.kode}
                      className="flex items-center gap-2 p-2 bg-orange-100 rounded"
                    >
                      <AlertTriangle className="h-4 w-4 text-orange-700" />
                      <span className="font-medium">{modul.label}</span>
                      <span className="text-sm text-slate-600">
                        ({modul.kode})
                      </span>
                      <span className="ml-auto font-bold text-orange-700">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(modul.saldo)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {yellowWarning.length > 0 && (
          <div className="mb-4 shadow-lg animate-slide-in bg-yellow-50 border border-yellow-400 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-yellow-800 mb-1">
                  💡 Aktivitas Rendah!
                </h3>
                <p className="mb-2 font-medium text-yellow-900">
                  Ada {yellowWarning.length} modul dengan saldo dibawah Rp
                  1.500.000 dan transaksi kurang dari 10:
                </p>
                <ul className="mt-2 space-y-1">
                  {yellowWarning.map((modul) => (
                    <li
                      key={modul.kode}
                      className="flex items-center gap-2 p-2 bg-yellow-100 rounded"
                    >
                      <TrendingUp className="h-4 w-4 text-yellow-700" />
                      <span className="font-medium">{modul.label}</span>
                      <span className="text-sm text-slate-600">
                        ({modul.kode})
                      </span>
                      <span className="text-sm text-yellow-700 ml-auto">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(modul.saldo)}{" "}
                        | {modul.total_trx} trx
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Data Modul</h2>
            <p className="text-sm text-slate-600 mt-1">
              Klik pada header kolom untuk mengurutkan data
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th
                    className="text-left p-4 cursor-pointer hover:bg-slate-200 transition-colors font-bold"
                    onClick={() => {
                      handleSort("kode");
                    }}
                  >
                    Kode
                    <SortIcon field="kode" />
                  </th>
                  <th
                    className="text-left p-4 cursor-pointer hover:bg-slate-200 transition-colors font-bold"
                    onClick={() => handleSort("label")}
                  >
                    Label
                    <SortIcon field="label" />
                  </th>
                  <th
                    className="text-left p-4 cursor-pointer hover:bg-slate-200 transition-colors font-bold"
                    onClick={() => handleSort("total_trx")}
                  >
                    Total Trx
                    <SortIcon field="total_trx" />
                  </th>
                  <th
                    className="text-right p-4 cursor-pointer hover:bg-slate-200 transition-colors font-bold"
                    onClick={() => handleSort("saldo")}
                  >
                    Saldo
                    <SortIcon field="saldo" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-500">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  sortedData.map((modul) => (
                    <tr
                      key={modul.kode}
                      className={`border-t border-slate-200 transition-colors ${
                        criticalBalance.includes(modul)
                          ? "blink-row"
                          : lowBalanceModules.includes(modul)
                          ? "bg-red-50 hover:bg-red-100"
                          : yellowWarning.includes(modul)
                          ? "bg-yellow-50 hover:bg-yellow-100"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <td
                        onClick={() => setSelectKode(parseInt(modul.kode))}
                        className={`p-4 cursor-pointer ${
                          criticalBalance.includes(modul)
                            ? "font-bold"
                            : "font-medium"
                        }`}
                      >
                        {modul.kode}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              criticalBalance.includes(modul) ? "font-bold" : ""
                            }
                          >
                            {modul.label}
                          </span>
                          {criticalBalance.includes(modul) && (
                            <AlertTriangle className="h-5 w-5 text-white animate-pulse" />
                          )}
                          {!criticalBalance.includes(modul) &&
                            lowBalanceModules.includes(modul) && (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                          {!criticalBalance.includes(modul) &&
                            !lowBalanceModules.includes(modul) &&
                            yellowWarning.includes(modul) && (
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            )}
                        </div>
                      </td>
                      <td
                        className={`p-4 ${
                          criticalBalance.includes(modul) ? "font-bold" : ""
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">
                          {modul.total_trx}
                          {modul.total_trx < 10 &&
                            !criticalBalance.includes(modul) && (
                              <span className="text-xs text-slate-500">
                                (rendah)
                              </span>
                            )}
                        </span>
                      </td>
                      <td
                        className={`p-4 text-right ${
                          criticalBalance.includes(modul)
                            ? "font-bold text-lg"
                            : lowBalanceModules.includes(modul)
                            ? "text-red-700 font-bold"
                            : yellowWarning.includes(modul)
                            ? "text-yellow-700 font-semibold"
                            : "font-medium"
                        }`}
                      >
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(modul.saldo)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <Dialog open={open} onOpenChange={setOpen} >
        <DialogContent>
                <h3 className="text-lg font-bold mb-4">Detail Saldo Modul</h3>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (   
                    <div>
                        {JSON.stringify(parameter_parsing)}
                    </div>
                )}

        </DialogContent>
    </Dialog>
    </>

  );
}
