"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [superhero, setSuperhero] = useState<{ name: string; image: string; fact: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSuperhero = async () => {
      try {
        const randomId = Math.floor(Math.random() * 731) + 1;
        const response = await fetch(`https://akabab.github.io/superhero-api/api/id/${randomId}.json`);
        
        const data = await response.json();

        const facts = [
          `${data.name} first appeared in ${data.biography.firstAppearance}.`,
          `${data.name} is affiliated with ${data.connections.groupAffiliation}.`,
          `The superhero's ${data.name} real name is ${data.biography.fullName}.`,
          `The superhero ${data.name} was first published by ${data.biography.publisher}.`,
        ];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];

        if (isMounted) setSuperhero({ name: data.name, image: data.images.md, fact: randomFact });
      } catch (error) {
        console.log(error);
      }
    };

    fetchSuperhero();
    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "loading") {
    return <p className="text-center text-lg">Loading user session...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 via-blue-500 to-indigo-900 text-white p-4">
      <h1 className="text-4xl font-extrabold text-center mb-6">
        Welcome, {session?.user?.name || "Guest"}! 🦸‍♂️
      </h1>

      {superhero ? (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center text-center"
        >
          <motion.img
            src={superhero.image}
            alt={superhero.name}
            className="w-64 h-64 object-cover rounded-lg shadow-lg border-4 border-white"
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
          />
          <motion.h2 className="text-3xl font-bold mt-4" animate={{ opacity: [0, 1], transition: { duration: 1.5 } }}>
          Did you know this about {superhero.name}?
          </motion.h2>
          <p className="text-lg italic mt-2">{superhero.fact}</p>
        </motion.div>
      ) : (
        <p className="text-center text-lg">Loading superhero...</p>
      )}

      <div className="flex mt-6 gap-4">
        <button
          onClick={() => router.push("/leaderboard")}
          className="bg-gradient-to-r from-blue-500 to-teal-400 px-6 py-3 rounded-lg shadow-lg text-white font-bold hover:scale-105 transition"
        >
          Check Rating (Leaderboard)
        </button>

        <button
          onClick={() => router.push("/leaderboard/add")}
          className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-lg shadow-lg text-white font-bold hover:scale-105 transition"
        >
          Add Superhero
        </button>
      </div>
    </div>
  );
}
