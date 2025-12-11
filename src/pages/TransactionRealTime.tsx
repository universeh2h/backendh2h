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
  "https://res.cloudinary.com/dikf91ikq/image/upload/v1760421960/workspaces/Pngtree_realistic_rotating_planet_earth_globe_22507042_kzi2gf.png",
  "https://res.cloudinary.com/dikf91ikq/image/upload/v1760420937/workspaces/astronot_tiqilf.png"
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
      const res = await fetch("http://103.184.122.173:4000/api/v1/transactions");
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

      {/* Floating Planets - Left Side */}
      <motion.div
        className="fixed left-[5%] top-[18%] w-28 h-28 rounded-full bg-gradient-to-br from-purple-500/25 to-pink-500/25 blur-2xl pointer-events-none"
        animate={{
          y: [0, 45, 0],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="fixed left-[10%] top-[68%] w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-xl pointer-events-none"
        animate={{
          y: [0, -28, 0],
          x: [0, 18, 0],
          scale: [1, 0.85, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Earth Image - Right Side */}
      <motion.div
        className="fixed right-[3%] top-[25%] w-56 h-56 pointer-events-none z-20"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 360],
        }}
        transition={{
          y: {
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        <img 
          src={images[0]} 
          alt="Earth" 
          className="w-full h-full object-contain drop-shadow-2xl"
        />
        {/* Glow effect for Earth */}
        <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-3xl -z-10" />
      </motion.div>

      {/* Astronaut Image 1 - Left Top */}
      <motion.div
        className="fixed left-[2%] top-[25%] w-48 h-48 pointer-events-none z-20"
        animate={{
          y: [0, -30, 0],
          x: [0, 15, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img 
          src={images[1]} 
          alt="Astronaut" 
          className="w-full h-full object-contain drop-shadow-2xl"
        />
        {/* Glow effect for Astronaut */}
        <div className="absolute inset-0 rounded-full bg-purple-400/10 blur-2xl -z-10" />
      </motion.div>

      {/* Astronaut Image 2 - Right Bottom */}
      <motion.div
        className="fixed right-[4%] bottom-[15%] w-56 h-56 pointer-events-none z-20"
        animate={{
          y: [0, 25, 0],
          x: [0, -10, 0],
          rotate: [3, -3, 3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img 
          src={images[1]} 
          alt="Astronaut 2" 
          className="w-full h-full object-contain drop-shadow-2xl transform scale-x-[-1]"
        />
        {/* Glow effect for Astronaut */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/10 blur-2xl -z-10" />
      </motion.div>

      {/* Sun Image - Left Bottom */}
      <motion.div
        className="fixed left-[3%] bottom-[10%] w-44 h-44 pointer-events-none z-20"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.15, 1],
        }}
        transition={{
          rotate: {
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <div className="relative w-full h-full">
          {/* Sun core */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 shadow-2xl" />
          {/* Sun rays layer 1 */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200/60 to-orange-300/60 blur-xl" />
          {/* Sun rays layer 2 - outer glow */}
          <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-3xl scale-150" />
          {/* Animated pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-yellow-300/20 blur-2xl"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      {/* Floating Planets - Right Side Bottom */}
      <motion.div
        className="fixed right-[8%] top-[70%] w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/30 to-red-500/30 blur-2xl pointer-events-none"
        animate={{
          y: [0, 35, 0],
          x: [0, -12, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orbiting Rings - Around Astronaut 1 (Left Top) */}
      <motion.div
        className="fixed left-[0.5%] top-[23%] w-60 h-60 border-2 border-purple-500/20 rounded-full pointer-events-none"
        animate={{
          rotate: 360,
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/70" />
      </motion.div>

      {/* Orbiting Rings - Around Astronaut 2 (Right Bottom) */}
      <motion.div
        className="fixed right-[2%] bottom-[13%] w-72 h-72 border-2 border-cyan-500/20 rounded-full pointer-events-none"
        animate={{
          rotate: -360,
          scale: [1, 1.06, 1],
        }}
        transition={{
          rotate: {
            duration: 22,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/70" />
      </motion.div>

      {/* Orbiting Rings - Around Sun */}
      <motion.div
        className="fixed left-[1.5%] bottom-[8%] w-60 h-60 border-2 border-yellow-500/25 rounded-full pointer-events-none"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-orange-400 rounded-full shadow-lg shadow-orange-400/70" />
      </motion.div>

      {/* Orbiting Rings - Around Earth */}
      <motion.div
        className="fixed right-[1%] top-[23%] w-72 h-72 border-2 border-emerald-500/20 rounded-full pointer-events-none"
        animate={{
          rotate: -360,
          scale: [1, 1.08, 1],
        }}
        transition={{
          rotate: {
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          },
          scale: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/70" />
      </motion.div>

      {/* Constellation Lines - Left */}
      <svg className="fixed left-[2%] top-[15%] w-64 h-64 pointer-events-none opacity-30">
        <motion.line
          x1="20" y1="20" x2="80" y2="60"
          stroke="#64748b"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.line
          x1="80" y1="60" x2="120" y2="40"
          stroke="#64748b"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
        <circle cx="20" cy="20" r="2" fill="#94a3b8" />
        <circle cx="80" cy="60" r="2" fill="#94a3b8" />
        <circle cx="120" cy="40" r="2" fill="#94a3b8" />
      </svg>

      {/* Constellation Lines - Right */}
      <svg className="fixed right-[2%] top-[25%] w-64 h-64 pointer-events-none opacity-30">
        <motion.line
          x1="140" y1="30" x2="100" y2="80"
          stroke="#64748b"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.line
          x1="100" y1="80" x2="60" y2="70"
          stroke="#64748b"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
        />
        <circle cx="140" cy="30" r="2" fill="#94a3b8" />
        <circle cx="100" cy="80" r="2" fill="#94a3b8" />
        <circle cx="60" cy="70" r="2" fill="#94a3b8" />
      </svg>

      {/* Falling Meteors */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`meteor-${i}`}
          className="fixed pointer-events-none z-30"
          initial={{
            left: `${10 + i * 15}%`,
            top: '-10%',
          }}
          animate={{
            left: [`${10 + i * 15}%`, `${-5 + i * 15}%`],
            top: ['-10%', '110%'],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear",
          }}
        >
          {/* Meteor body */}
          <div className="relative">
            {/* Main meteor */}
            <motion.div 
              className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-300 via-orange-500 to-red-600 shadow-lg shadow-orange-500/50"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Meteor trail - multiple layers for depth */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 origin-top -rotate-45">
              {/* Trail layer 1 - bright core */}
              <div 
                className="w-full bg-gradient-to-b from-orange-400 via-orange-500/80 to-transparent"
                style={{ height: '80px' }}
              />
            </div>
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 origin-top -rotate-45">
              {/* Trail layer 2 - mid glow */}
              <div 
                className="w-full bg-gradient-to-b from-orange-300/60 via-orange-400/40 to-transparent blur-sm"
                style={{ height: '100px' }}
              />
            </div>
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 origin-top -rotate-45">
              {/* Trail layer 3 - outer glow */}
              <div 
                className="w-full bg-gradient-to-b from-yellow-200/40 via-orange-300/20 to-transparent blur-md"
                style={{ height: '120px' }}
              />
            </div>

            {/* Sparkles along the trail */}
            {[...Array(4)].map((_, j) => (
              <motion.div
                key={`sparkle-${i}-${j}`}
                className="absolute w-1 h-1 bg-yellow-300 rounded-full -rotate-45"
                style={{
                  top: `${j * 25}px`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: j * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Additional decorative stars around images */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`deco-star-${i}`}
          className="fixed w-1.5 h-1.5 bg-yellow-300 rounded-full pointer-events-none"
          style={{
            left: `${i < 6 ? 3 + (i * 2) : 88 + ((i - 6) * 2)}%`,
            top: `${i < 6 ? 30 + (i * 5) : 25 + ((i - 6) * 6)}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.8, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
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
                        {transactions.map((tx) => (
                          <motion.tr
                            key={tx.trx_id}
                            // initial={{ opacity: 0, x: -20 }}
                            // animate={{ opacity: 1, x: 0 }}
                            // exit={{ opacity: 0, x: 20 }}
                            // transition={{ delay: index * 0.05 }}
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