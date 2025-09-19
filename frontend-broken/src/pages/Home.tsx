export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 text-white">
      <h1 className="text-5xl font-bold mb-4">Proposal Devta 💘</h1>
      <p className="text-lg mb-8 text-center max-w-md">
        Generate the perfect proposal for your crush, your date, or even your pitch —
        instantly crafted with style and emotion.
      </p>
      <a
        href="/proposal"
        className="bg-white text-pink-600 font-semibold px-6 py-3 rounded-2xl shadow-lg hover:bg-pink-100 transition"
      >
        Generate Proposal
      </a>
    </div>
  );
}
