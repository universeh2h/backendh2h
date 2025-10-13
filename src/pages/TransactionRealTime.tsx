import { formatCurrency } from "@/utils/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Transaction {
  product_code: string;
  selling_price: number;
  tgl_entri: Date;
  tgl_status: Date;
  trx_id: number;
  tujuan: string;
}

interface TransactionUpdate {
  transactions: Transaction[];
  timestamp: string;
}

const formatDate = (date?: Date | string): string => {
  if (!date) return "-";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(dateObj);
};

export function TransactionRealtime() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTxIds, setNewTxIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:1000/ws/transactions");

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      ws.send(
        JSON.stringify({
          command: "start",
          interval: 5,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const data: TransactionUpdate = JSON.parse(event.data);
        if (data.transactions) {
          // Track new transactions
          const newIds = new Set<number>();
          data.transactions.forEach((tx) => {
            if (!transactions.some((t) => t.trx_id === tx.trx_id)) {
              newIds.add(tx.trx_id);
            }
          });
          setNewTxIds(newIds);

          // Remove highlight after animation
          setTimeout(() => setNewTxIds(new Set()), 2000);

          setTransactions(data.transactions);
        }
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    };

    ws.onerror = (error) => {
      setIsConnected(false);
      setError("WebSocket connection error");
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [transactions]);

  return (
    <main className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Real-time Transactions
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor semua transaksi secara real-time
            </p>
          </div>
          <motion.div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow">
            <motion.div
              animate={{ scale: isConnected ? 1 : 0.8 }}
              transition={{ repeat: isConnected ? Infinity : 0, duration: 2 }}
              className={`w-4 h-4 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </motion.div>
        </motion.div>



        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {transactions.length === 0 ? (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="p-12 text-center text-gray-500"
            >
              <div className="text-6xl mb-4">📡</div>
              <p className="text-lg">Waiting for transactions...</p>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Kode Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Tujuan
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Harga
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Tanggal Dibuat
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Tanggal Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence mode="popLayout">
                    {transactions.map((tx, index) => (
                      <motion.tr
                        key={tx.trx_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`hover:bg-gray-50 transition group ${
                          newTxIds.has(tx.trx_id) ? "bg-yellow-50" : ""
                        }`}
                      >
                        {/* Background animation untuk row baru */}
                        {newTxIds.has(tx.trx_id) && (
                          <motion.td
                            colSpan={6}
                            className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-transparent pointer-events-none rounded"
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ opacity: 0, scale: 1 }}
                            transition={{ duration: 2, delay: 0.2 }}
                          />
                        )}

                        <td className="px-6 py-4 text-sm text-gray-900 font-mono font-bold">
                          {tx.trx_id}
                        </td>

                        <td className="px-6 py-4 text-sm">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium"
                          >
                            {tx.product_code}
                          </motion.div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="inline-block"
                          >
                            {tx.tujuan}
                          </motion.span>
                        </td>

                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="inline-block"
                          >
                            {formatCurrency(tx.selling_price)}
                          </motion.div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="inline-block"
                          >
                            {formatDate(tx.tgl_entri)}
                          </motion.span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className="inline-block"
                          >
                            {formatDate(tx.tgl_status)}
                          </motion.span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-between bg-white rounded-lg shadow p-4"
        >
          <div className="text-sm text-gray-600">
            Total transactions:{" "}
            <motion.span
              key={transactions.length}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="font-bold text-lg text-blue-600"
            >
              {transactions.length}
            </motion.span>
          </div>
          <div className="text-xs text-gray-500">
            Last update: {new Date().toLocaleTimeString("id-ID")}
          </div>
        </motion.div>
      </div>
    </main>
  );
}