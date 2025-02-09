"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const superheroImage = "/superhero-logo.png";

  return (
    <nav className="relative flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-700 to-teal-500 text-white shadow-lg">
      {/* Center: Animated Fight Scene */}
      <div className="relative flex justify-center items-center w-32 h-16">
        {/* Superhero 1 (Left Side) */}
        <motion.div
          className="absolute left-0 bg-orange-500 w-8 h-12 rounded-full flex items-center justify-center"
          animate={{ x: [0, 10, 0], rotate: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        >
          <div className="w-5 h-5 bg-orange-300 rounded-full"></div>
        </motion.div>

        {/* Punch Effect */}
        <motion.div
          className="absolute bg-yellow-400 w-6 h-6 rounded-full opacity-50"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
        ></motion.div>

        {/* Superhero 2 (Right Side) */}
        <motion.div
          className="absolute right-0 bg-green-500 w-8 h-12 rounded-full flex items-center justify-center"
          animate={{ x: [0, -10, 0], rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
        >
          <div className="w-5 h-5 bg-green-300 rounded-full"></div>
        </motion.div>
      </div>

      {/* Right: Profile & Logout/Login */}
      {session ? (
        <div className="flex items-center gap-4">
          <img
            src={superheroImage}
            alt="User"
            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
          />
          <button
            onClick={() => signOut({ callbackUrl: "/" })} // Redirects to localhost:3000/ after logout
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-semibold transition duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-semibold transition duration-300 transform hover:scale-105"
        >
          Login
        </button>
      )}
    </nav>
  );
}
