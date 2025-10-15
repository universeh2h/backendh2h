import {motion} from "framer-motion"

export interface Transaction {
  product_code: string;
  selling_price: number;
  sn: string | null;
  status: string;
  tgl_entri: string;
  tgl_status: string;
  trx_id: number;
  tujuan: string;
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (date?: Date | string): string => {
  if (!date) return "-";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  dateObj.setHours(dateObj.getHours() - 7);
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(dateObj);
};

export const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("success") || statusLower.includes("completed")) return "bg-green-500/20 text-green-300 border-green-400/30";
  if (statusLower.includes("pending")) return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
  if (statusLower.includes("failed") || statusLower.includes("error")) return "bg-red-500/20 text-red-300 border-red-400/30";
  return "bg-slate-500/20 text-slate-300 border-slate-400/30";
};

export function validationLengthSn(
  sn: string,
  length: number,
  position: "start" | "end" = "start"
): string {
  if (sn.length > length) {
    if (position === "start") {
      return sn.slice(0, length) + ".....";
    } else {
      return "....." + sn.slice(-length);
    }
  } else {
    return sn;
  }
}

export const Star = ({ delay, left }: { delay: number; left: string }) => (
  <motion.div
    initial={{ top: "-30px", opacity: 1 }}
    animate={{ top: "100vh", opacity: 0 }}
    transition={{ duration: 8, delay, ease: "linear", repeat: Infinity }}
    className="absolute text-yellow-300 text-3xl pointer-events-none"
    style={{ left }}
  >
    ✨
  </motion.div>
);