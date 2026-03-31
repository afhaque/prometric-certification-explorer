export default function Header() {
  return (
    <header className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-mint rounded-sm flex items-center justify-center">
            <span className="text-navy font-heading font-bold text-sm">P</span>
          </div>
          <span className="font-heading font-semibold text-lg tracking-tight">
            Prometric
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-body text-gray-300">
          <a href="#programs" className="hover:text-mint transition-colors">
            Programs
          </a>
          <a href="#about" className="hover:text-mint transition-colors">
            About
          </a>
          <a
            href="https://www.prometric.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-mint transition-colors"
          >
            Prometric.com
          </a>
        </nav>
      </div>
    </header>
  );
}
