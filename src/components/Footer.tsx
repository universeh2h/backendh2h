import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

const LINK_PROVIDER = [
    "https://res.cloudinary.com/dikf91ikq/image/upload/v1760411172/workspaces/pngwing.com_1_nydxc1.png",
    "https://res.cloudinary.com/dikf91ikq/image/upload/v1760411172/workspaces/pngwing.com_3_fap0dk.png",
    "https://res.cloudinary.com/dikf91ikq/image/upload/v1760411171/workspaces/pngwing.com_5_agxajm.png",
    "https://res.cloudinary.com/dikf91ikq/image/upload/v1760411172/workspaces/pngwing.com_4_ow5bym.png",
    "https://res.cloudinary.com/dikf91ikq/image/upload/v1760411171/workspaces/pngwing.com_szv76a.png",
    "https://res.cloudinary.com/dikf91ikq/image/upload/v1760411171/workspaces/pngwing.com_2_mvg0v0.png",
]

export function Footer(){
    return (
        <footer className="relative pt-20 pb-12 bg-transparent" aria-label="Footer Vazzuniverse">
            {/* Decorative elements */}

            <div className="container mx-auto px-4 max-w-7xl relative z-10">
                {/* Provider Marquee */}
             

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                    {/* Informasi Perusahaan */}
                  <div className="space-y-6">
  <>
    <div className="flex flex-col items-center space-x-24">
      <div className="relative flex overflow-hidden rounded-lg p-1 shadow-lg">
        <img
          src={"https://res.cloudinary.com/dikf91ikq/image/upload/v1753870220/Horizontal_Logo_m8ei71.png"}
          alt="Logo Vazzuniverse"
          width={200}
          height={200}
          className="bg-cover"
        />
      </div>
      <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-purple-500 pl-4">
        {(
          "Universe H2H menyediakan layanan top-up game dengan harga terbaik, proses cepat, dan pelayanan 24/7 untuk semua kebutuhan gaming Anda."
        ).split(".")[0] + "."}
      </p>
    </div>
  </>
</div>

                    {/* a Game */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-white relative">
                            <span className="relative z-10">Game Populer</span>
                            <span className="absolute bottom-0 left-0 h-1 w-10 bg-gradient-to-r from-blue-500 to-purple-500"></span>
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="/order/mobile-legend"
                                    className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                >
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                                    Mobile Legends Bang Bang
                                </a>
                            </li>
                          
                            <li>
                                <a
                                    href="/order/free-fire"
                                    className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                >
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                                    Free Fire
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/order/valorant"
                                    className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                >
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                                    Valorant
                                </a>
                            </li>
                          
                        </ul>
                    </div>

                    {/* a Bantuan */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-white relative">
                            <span className="relative z-10">Bantuan</span>
                            <span className="absolute bottom-0 left-0 h-1 w-10 bg-gradient-to-r from-blue-500 to-purple-500"></span>
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a
                                    href="/cara-top-up"
                                    className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                >
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                                    Cara Top Up
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/syarat-ketentuan"
                                    className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                >
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                                    Syarat & Ketentuan
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/kebijakan-privasi"
                                    className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                >
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                                    Kebijakan Privasi
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-white relative">
                            <span className="relative z-10">Top Provider</span>
                            <span className="absolute bottom-0 left-0 h-1 w-10 bg-gradient-to-r from-blue-500 to-purple-500"></span>
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <span
                                    className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                >
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                                    Indosat
                                </span>
                            </li>
                            <li>
                                <span
                                    className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                >
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                                    Telkomsel
                                </span>
                            </li>
                            <li>
                                <span
                                    className="group flex items-center text-gray-400 transition-colors hover:text-white"
                                >
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></span>
                                   Three
                                </span>
                            </li>
                        </ul>
                    </div>
                    

                </div>
                   <div className="mb-12  rounded-lg p-6 overflow-hidden">
                    <h3 className="text-lg font-semibold text-center text-white mb-4 relative w-full inline-block">
                        <span className="relative z-10 ">Provider Pulsa Populer</span>
                        <span className="absolute bottom-[-4px] left-[43%] h-1 w-40 bg-gradient-to-r from-blue-500 to-purple-500"></span>
                    </h3>
                    <div className="overflow-hidden">
                        <motion.div
                            animate={{ x: [-1000, 0] }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                            className="flex gap-6"
                        >
                            {[...LINK_PROVIDER, ...LINK_PROVIDER, ...LINK_PROVIDER].map((provider, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    className="flex-shrink-0 h-20 w-28 rounded-lg p-3 mt-5 flex items-center justify-center cursor-pointer  transition-all duration-300 backdrop-blur-sm"
                                >
                                    <img
                                        src={provider}
                                        alt={`Provider ${index}`}
                                        className="object-contain h-16 w-24 drop-shadow-lg"
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>


                {/* Copyright */}
                <div className="mt-12">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-center text-sm text-gray-400">
                            © {new Date().getFullYear()}{" "}
                            <span className="font-medium text-white">UniverseH2H</span>.
                            Seluruh hak cipta dilindungi.
                        </p>
                        <div className="flex items-center gap-6">
                            <a
                                href="/kebijakan-privasi"
                                className="text-xs text-gray-500 hover:text-gray-300"
                            >
                                Privasi
                            </a>
                            <a
                                href="/syarat-ketentuan"
                                className="text-xs text-gray-500 hover:text-gray-300"
                            >
                                Ketentuan
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    )
}