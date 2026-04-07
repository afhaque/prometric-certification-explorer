interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
}

export default function Hero({
  searchQuery,
  onSearchChange,
  totalResults,
}: HeroProps) {
  return (
    <section className="bg-navy text-white py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="font-heading font-bold text-3xl md:text-5xl mb-4 leading-tight">
          Explore 433 Certification Programs
        </h1>
        <p className="font-body text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Browse Prometric&apos;s global portfolio of certification and exam
          programs across healthcare, finance, technology, and more.
        </p>
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search programs by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-6 py-4 rounded-pill bg-white text-navy font-body text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-mint shadow-lg"
          />
          <svg
            className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-gray-400 text-sm mt-3 font-body">
          {totalResults} programs found
        </p>
      </div>
    </section>
  );
}
