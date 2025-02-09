"use client";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-800 to-blue-500">
      <div className="flex items-center justify-center gap-4 mb-8">
        <h1 className="text-5xl font-bold text-white">Welcome</h1>
        <div className="flex items-center justify-center w-32 h-16">
          {/* Superhero 1 (Left Side) */}
          <motion.div
            className="bg-orange-500 w-8 h-12 rounded-full flex items-center justify-center"
            animate={{ x: [0, 10, 0], rotate: [0, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          >
            <div className="w-5 h-5 bg-orange-300 rounded-full"></div>
          </motion.div>
          {/* Punch Effect */}
          <motion.div
            className="mx-2 bg-yellow-400 w-6 h-6 rounded-full opacity-50"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          ></motion.div>
          {/* Superhero 2 (Right Side) */}
          <motion.div
            className="bg-green-500 w-8 h-12 rounded-full flex items-center justify-center"
            animate={{ x: [0, -10, 0], rotate: [0, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          >
            <div className="w-5 h-5 bg-green-300 rounded-full"></div>
          </motion.div>
        </div>
        <h1 className="text-5xl font-bold text-white">Superhero</h1>
      </div>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => signIn("google", { callbackUrl: "/home" })}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition duration-300 transform hover:scale-105"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => (window.location.href = "/home")}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition duration-300 transform hover:scale-105"
        >
          Sign in as Guest
        </button>
      </div>
    </div>
  );
}
