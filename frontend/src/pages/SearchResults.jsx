import { useLocation } from "react-router-dom";

export default function SearchResults() {
  const query = new URLSearchParams(useLocation().search).get("query");

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 text-green-800">
      <h2 className="text-3xl font-bold mb-4">
        Search Results for "{query}"
      </h2>
      <p className="text-lg text-gray-600">
        (Here you can display actual results from your backend or static data.)
      </p>
    </div>
  );
}
