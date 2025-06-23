// pages/index.tsx (or app/page.tsx)
import NewsSearch from "./components/NewsSearch"; // Adjust path if needed

export default function Home() {
  return (
    <section className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 mb-6 space-y-4">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 tracking-tight text-center">
        👋 Welcome to the News Portal
      </h1>
      {/* --- PROBLEM SOLVED HERE: Change <p> to <div> --- */}
      <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
        Search Global News by Country Code (e.g. <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">us</code>, <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">np</code>, <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">in</code>).
        <br />
        <NewsSearch/> {/* NewsSearch component itself starts with a <section> */}
      </div>
      {/* --- End of change --- */}
    </section>
  );
}