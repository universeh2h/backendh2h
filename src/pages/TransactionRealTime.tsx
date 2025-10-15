import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { formatCurrency, formatDate, getStatusColor, Star, validationLengthSn, type Transaction } from "./helpers";

const images = [
  ""
]
export function TransactionRealtime() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stars, setStars] = useState<{ id: number; left: string; delay: number }[]>([]);

  useEffect(() => {
    const starArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + "%",
      delay: Math.random() * 3,
    }));
    setStars(starArray);
  }, []);

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("http://localhost:5000/api/v1/transactions");
      const data = await res.json();
      setTransactions(data.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      {/* Falling Stars Background - Fixed positioning tanpa overflow hidden */}
      <div className="fixed inset-0 top-0 pointer-events-none">
        {stars.map((star) => (
          <Star key={star.id} left={star.left} delay={star.delay} />
        ))}
      </div>
      

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-50 flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-emerald-500" />
              Real-time Transactions
            </h1>
            <p className="text-slate-400 mt-2">
              Monitor semua transaksi secara real-time
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={fetchData}
              disabled={isRefreshing}
              className="gap-2"
              variant="default"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </motion.div>
        </motion.div>

        {/* Main Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Transaksi Terbaru</CardTitle>
              <CardDescription className="text-slate-400">
                {transactions.length} transaksi ditemukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="p-12 text-center text-slate-400"
                >
                  <div className="text-6xl mb-4">📡</div>
                  <p className="text-lg">Loading transactions...</p>
                </motion.div>
              ) : transactions.length === 0 ? (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="p-12 text-center text-slate-400"
                >
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-lg">No transactions available</p>
                </motion.div>
              ) : (
                <div className="w-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700 hover:bg-transparent">
                        <TableHead className="text-muted">ID</TableHead>
                        <TableHead className="text-muted">Kode Product</TableHead>
                        <TableHead className="text-muted">Tujuan</TableHead>
                        <TableHead className="text-muted">Harga</TableHead>
                        <TableHead className="text-muted">Status</TableHead>
                        <TableHead className="text-muted">Sn</TableHead>
                        <TableHead className="text-muted">Tanggal Dibuat</TableHead>
                        <TableHead className="text-muted">Tanggal Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence mode="popLayout">
                        {transactions.map((tx, index) => (
                          <motion.tr
                            key={tx.trx_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-slate-700 hover:bg-slate-700/50"
                          >
                            <TableCell className="text-slate-100 font-mono font-bold">
                              {tx.trx_id}
                            </TableCell>

                            <TableCell>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="inline-block"
                              >
                                <Badge 
                                  variant="secondary"
                                  className="bg-blue-500/20 text-blue-300 border border-blue-400/30"
                                >
                                  {tx.product_code}
                                </Badge>
                              </motion.div>
                            </TableCell>

                            <TableCell className="text-slate-300">
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="inline-block"
                              >
                                {validationLengthSn(tx.tujuan, 3)}
                              </motion.span>
                            </TableCell>

                            <TableCell className="font-semibold text-emerald-400">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="inline-block"
                              >
                                {formatCurrency(tx.selling_price)}
                              </motion.div>
                            </TableCell>

                            <TableCell>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="inline-block"
                              >
                                <Badge className={`${getStatusColor(tx.status)} border`}>
                                  {tx.status}
                                </Badge>
                              </motion.div>
                            </TableCell>

                            <TableCell className="font-semibold text-emerald-400">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="inline-block"
                              >
                                {tx.sn ? validationLengthSn(tx.sn, 3,"end") : "-"}
                              </motion.div>
                            </TableCell>

                            <TableCell className="text-slate-400">
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="inline-block"
                              >
                                {formatDate(tx.tgl_entri)}
                              </motion.span>
                            </TableCell>

                            <TableCell className="text-slate-400">
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="inline-block"
                              >
                                {formatDate(tx.tgl_status)}
                              </motion.span>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </main>
    </>
  );
}