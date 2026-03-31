const STATS = [
  { value: "8,000+", label: "Test Centers" },
  { value: "180+", label: "Countries" },
  { value: "70+", label: "Languages" },
];

export default function StatsBanner() {
  return (
    <section className="bg-navy/5 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="font-heading font-bold text-2xl md:text-3xl text-navy">
                  {stat.value}
                </div>
                <div className="font-body text-sm text-gray-500 mt-1">
                  {stat.label}
                </div>
              </div>
              {i < STATS.length - 1 && (
                <div className="hidden md:block w-px h-10 bg-gray-300" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
