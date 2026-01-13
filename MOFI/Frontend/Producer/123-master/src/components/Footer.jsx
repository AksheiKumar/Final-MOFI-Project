function Footer() {
  return (
    <footer className="bg-gradient-to-r from-black/95 via-zinc-900/95 to-black/95 backdrop-blur-xl border-t border-amber-700/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Copyright */}
          <p className="text-zinc-400 text-sm">
            © {new Date().getFullYear()} Producer Hub. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex space-x-6">
            <a href="#" className="text-zinc-400 hover:text-amber-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-zinc-400 hover:text-amber-400 text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-zinc-400 hover:text-amber-400 text-sm transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
