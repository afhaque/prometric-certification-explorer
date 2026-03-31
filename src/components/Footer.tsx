export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-mint rounded-sm flex items-center justify-center">
                <span className="text-navy font-heading font-bold text-xs">
                  P
                </span>
              </div>
              <span className="font-heading font-semibold text-base">
                Prometric
              </span>
            </div>
            <p className="text-sm text-gray-400 font-body leading-relaxed">
              A trusted test development and delivery partner to more than 300
              organizations worldwide.
            </p>
          </div>

          {/* Test Takers */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wide text-gray-300">
              Test Takers
            </h4>
            <ul className="space-y-2 text-sm text-gray-400 font-body">
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  Find Your Exam
                </a>
              </li>
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  Schedule an Exam
                </a>
              </li>
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  Test Center Locator
                </a>
              </li>
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  Prepare for Your Test
                </a>
              </li>
            </ul>
          </div>

          {/* Organizations */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wide text-gray-300">
              Organizations
            </h4>
            <ul className="space-y-2 text-sm text-gray-400 font-body">
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  Solutions
                </a>
              </li>
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  Industries
                </a>
              </li>
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  Research & Insights
                </a>
              </li>
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wide text-gray-300">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-gray-400 font-body">
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  Press Room
                </a>
              </li>
              <li>
                <a
                  href="https://www.prometric.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mint transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-body">
            &copy; {new Date().getFullYear()} Prometric LLC. All rights
            reserved. This is an independent directory, not affiliated with
            Prometric.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 font-body">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
