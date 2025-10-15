import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "./helpers";

interface ReportKontol {
  time_range: string;
  count_member: number;
  count_trx: number;
  total_profit: number;
}

const dateNow = new Date().toISOString().split("T")[0];

export default function ReportDashboard() {
  const [period1Start, setPeriod1Start] = useState(dateNow);
  const [period1End, setPeriod1End] = useState(dateNow);
  const [period2Start, setPeriod2Start] = useState(dateNow);
  const [period2End, setPeriod2End] = useState(dateNow);

  const [data1, setData1] = useState<ReportKontol[]>();
  const [data2, setData2] = useState<ReportKontol[]>();
  const [compareMode, setCompareMode] = useState(false);

 

  // Merge data for comparison charts
  const mergedData = data1?.map((item, index) => ({
    time_range: item.time_range,
    count_member_p1: item.count_member,
    count_trx_p1: item.count_trx,
    total_profit_p1: item.total_profit,
    count_member_p2: data2?.[index]?.count_member || 0,
    count_trx_p2: data2?.[index]?.count_trx || 0,
    total_profit_p2: data2?.[index]?.total_profit || 0,
  }));

  const handleFetch = async () => {
    try {
      // Fetch period 1
      const req1 = await fetch(
        `http://localhost:5000/api/v1/report-kontol?startDate=${period1Start}&endDate=${period1End}`
      );
      const result1 = await req1.json();
      setData1(result1.data);

      // Fetch period 2 if compare mode is on
      if (compareMode) {
        const req2 = await fetch(
          `http://localhost:5000/api/v1/report-kontol?startDate=${period2Start}&endDate=${period2End}`
        );
        const result2 = await req2.json();
        setData2(result2.data);
      } else {
        setData2(undefined);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setQuickFilter = (type: string, period: 1 | 2 = 1) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (type) {
      case "today":
        start = today;
        end = today;
        break;
      case "yesterday":
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        break;
      case "last7":
        start.setDate(today.getDate() - 6);
        end = today;
        break;
      case "last30":
        start.setDate(today.getDate() - 29);
        end = today;
        break;
      case "thisMonth":
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = today;
        break;
      case "lastMonth":
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "thisWeek":
        const dayOfWeek = today.getDay();
        const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        start.setDate(today.getDate() - diff);
        end = today;
        break;
      case "lastWeek":
        const lastWeekEnd = new Date(today);
        const dayOfWeek2 = today.getDay();
        const diff2 = dayOfWeek2 === 0 ? 0 : dayOfWeek2;
        lastWeekEnd.setDate(today.getDate() - diff2);
        start = new Date(lastWeekEnd);
        start.setDate(lastWeekEnd.getDate() - 6);
        end = new Date(lastWeekEnd);
        end.setDate(lastWeekEnd.getDate());
        break;
    }

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    if (period === 1) {
      setPeriod1Start(startStr);
      setPeriod1End(endStr);
    } else {
      setPeriod2Start(startStr);
      setPeriod2End(endStr);
    }
  };

  const setComparePreset = (type: string) => {
    switch (type) {
      case "thisVsLast":
        setQuickFilter("thisMonth", 1);
        setQuickFilter("lastMonth", 2);
        break;
      case "thisWeekVsLast":
        setQuickFilter("thisWeek", 1);
        setQuickFilter("lastWeek", 2);
        break;
      case "todayVsYesterday":
        setQuickFilter("today", 1);
        setQuickFilter("yesterday", 2);
        break;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <header className="w-full flex justify-center items-center mb-8">
        <div className="max-w-7xl w-full">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
            Dashboard Report dengan Perbandingan
          </h1>
          <p className="text-slate-600 mt-2">
            Bandingkan performa 2 periode berbeda
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Compare Mode Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={compareMode}
                  onChange={(e) => setCompareMode(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Mode Perbandingan</span>
              </label>

              {compareMode && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setComparePreset("todayVsYesterday")}
                    className="hover:bg-violet-50"
                  >
                    Hari Ini vs Kemarin
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setComparePreset("thisWeekVsLast")}
                    className="hover:bg-violet-50"
                  >
                    Minggu Ini vs Lalu
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setComparePreset("thisVsLast")}
                    className="hover:bg-violet-50"
                  >
                    Bulan Ini vs Lalu
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filter Section */}
        <div
          className={`grid gap-4 ${
            compareMode ? "lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Period 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {compareMode ? "Periode 1" : "Pilih Periode"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Quick Filter
                </label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickFilter("today", 1)}
                  >
                    Hari Ini
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickFilter("yesterday", 1)}
                  >
                    Kemarin
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickFilter("thisWeek", 1)}
                  >
                    Minggu Ini
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickFilter("last7", 1)}
                  >
                    7 Hari
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickFilter("thisMonth", 1)}
                  >
                    Bulan Ini
                  </Button>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">
                    Start
                  </label>
                  <Input
                    type="date"
                    value={period1Start}
                    onChange={(e) => setPeriod1Start(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">End</label>
                  <Input
                    type="date"
                    value={period1End}
                    onChange={(e) => setPeriod1End(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Period 2 - Only show in compare mode */}
          {compareMode && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Periode 2 (Pembanding)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Quick Filter
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickFilter("yesterday", 2)}
                    >
                      Kemarin
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickFilter("lastWeek", 2)}
                    >
                      Minggu Lalu
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickFilter("last7", 2)}
                    >
                      7 Hari Lalu
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuickFilter("lastMonth", 2)}
                    >
                      Bulan Lalu
                    </Button>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      Start
                    </label>
                    <Input
                      type="date"
                      value={period2Start}
                      onChange={(e) => setPeriod2Start(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-2 block">
                      End
                    </label>
                    <Input
                      type="date"
                      value={period2End}
                      onChange={(e) => setPeriod2End(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleFetch}
            className="bg-violet-600 hover:bg-violet-700 px-8"
          >
            Tampilkan Report
          </Button>
        </div>

        {/* Charts Grid */}
        {data1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transaksi Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-600" />
                  Transaksi per Rentang Waktu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mergedData || data1}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="time_range"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    {compareMode && data2 && <Legend />}
                    <Bar
                      dataKey={compareMode ? "count_trx_p1" : "count_trx"}
                      fill="#8b5cf6"
                      radius={[8, 8, 0, 0]}
                      name="Periode 1"
                    />
                    {compareMode && data2 && (
                      <Bar
                        dataKey="count_trx_p2"
                        fill="#06b6d4"
                        radius={[8, 8, 0, 0]}
                        name="Periode 2"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profit Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-600" />
                  Profit per Rentang Waktu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mergedData || data1}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="time_range"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    {compareMode && data2 && <Legend />}
                    <Line
                      type="monotone"
                      dataKey={compareMode ? "total_profit_p1" : "total_profit"}
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ fill: "#f59e0b", r: 5 }}
                      name="Periode 1"
                    />
                    {compareMode && data2 && (
                      <Line
                        type="monotone"
                        dataKey="total_profit_p2"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        dot={{ fill: "#06b6d4", r: 5 }}
                        name="Periode 2"
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Members Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-600" />
                  Member Aktif per Rentang Waktu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mergedData || data1}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="time_range"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    {compareMode && data2 && <Legend />}
                    <Bar
                      dataKey={compareMode ? "count_member_p1" : "count_member"}
                      fill="#06b6d4"
                      radius={[8, 8, 0, 0]}
                      name="Periode 1"
                    />
                    {compareMode && data2 && (
                      <Bar
                        dataKey="count_member_p2"
                        fill="#8b5cf6"
                        radius={[8, 8, 0, 0]}
                        name="Periode 2"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Combined Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Overview Kombinasi</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data1}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="time_range"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="count_trx"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      name="Transaksi"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="count_member"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="Member"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
