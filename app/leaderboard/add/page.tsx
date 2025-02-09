"use client";
import { useState } from "react";

export default function AddSuperhero() {
  const [name, setName] = useState("");
  const [superpower, setSuperpower] = useState("");
  const [humilityScore, setHumilityScore] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle file input change and restrict file types
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];
      if (!allowedTypes.includes(uploadedFile.type)) {
        setError("Only PNG, JPEG, and SVG files are allowed!");
        setFile(null);
        return;
      }
      setFile(uploadedFile);
    }
  };

  // Submit form data as FormData (for file upload)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !superpower || typeof humilityScore !== "number" || !file) {
      setError("All fields, including an image, are required!");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("superpower", superpower);
    formData.append("humility", String(humilityScore));
    formData.append("image", file);

    try {
      const res = await fetch("/superhero", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        // Log error to console if adding superhero failed
        console.error("Error adding superhero:", await res.text());
        setError("Error adding superhero!");
      } else {
        // Alert the user on success
        window.alert("Superhero added successfully!");
        setError("");
        setName("");
        setSuperpower("");
        setHumilityScore("");
        setFile(null);
      }
    } catch (err) {
      console.error("Error adding superhero:", err);
      setError("Error adding superhero!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-800 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 hover:scale-105">
        <h1 className="text-3xl font-extrabold text-center text-black">
          ✨ Add a Superhero ✨
        </h1>
        <p className="text-center text-gray-600">Become part of the league!</p>

        <div className="flex justify-center mt-4">
          {file ? (
            <img
              src={URL.createObjectURL(file)}
              alt="Superhero Preview"
              className="w-24 h-24 rounded-full shadow-md object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              📸
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <input
            type="text"
            placeholder="Superhero Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-xl p-3 w-full text-lg text-black placeholder-gray-600"
            required
          />

          <input
            type="text"
            placeholder="Superpower"
            value={superpower}
            onChange={(e) => setSuperpower(e.target.value)}
            className="border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-xl p-3 w-full text-lg text-black placeholder-gray-600"
            required
          />

          <input
            type="number"
            min="1"
            max="10"
            placeholder="Humility Score (1-10)"
            value={humilityScore}
            onChange={(e) => setHumilityScore(Number(e.target.value))}
            className="border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-xl p-3 w-full text-lg text-black placeholder-gray-600"
            required
          />

          <div className="flex flex-col gap-3">
            <label className="block text-center font-semibold text-gray-700">
              Upload or Capture Superhero Image
            </label>
            <input
              type="file"
              accept=".png, .jpeg, .jpg, .svg"
              capture="environment"
              onChange={handleFileChange}
              className="border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-xl p-2 w-full"
              required
            />
          </div>

          {error && <p className="text-center text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl w-full font-bold hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            {loading ? "Adding..." : "Add Superhero"}
          </button>
        </form>
      </div>
    </div>
  );
}
