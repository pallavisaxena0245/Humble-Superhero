"use client";
import { useEffect, useState } from "react";

type Superhero = {
  id: number;
  name: string;
  superpower: string;
  humility: number;
  image: string;
};

export default function Leaderboard() {
  const [superheroes, setSuperheroes] = useState<Superhero[]>([]);

  useEffect(() => {
    const fetchSuperheroes = async () => {
      const response = await fetch("/superhero");
      const data = await response.json();
      setSuperheroes(data);
    };

    fetchSuperheroes();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-800 to-blue-500 text-white">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-yellow-400 drop-shadow-lg">
     
          Superhero Leaderboard 🏆
        </h1>

        <div className="w-full overflow-hidden rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/20 text-yellow-300 text-lg">
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Hero</th>
                <th className="p-4 text-left">Humility Score</th>
              </tr>
            </thead>
            <tbody>
              {superheroes.map((hero, index) => (
                <tr key={hero.id} className="border-b border-white/20 hover:bg-white/20 transition duration-300">
                  <td className="p-4 font-bold text-yellow-300">{index + 1}</td>
                  <td className="p-4 flex items-center gap-4">
                    <img
                      src={hero.image}
                      alt={hero.name}
                      className="w-12 h-12 rounded-full shadow-lg"
                    />
                    <span>{hero.name}</span>
                  </td>
                  <td className="p-4">{hero.humility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
