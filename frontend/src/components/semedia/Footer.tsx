export const Footer = () => (
  <footer className="container py-10 border-t border-black/10 mt-10">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-foreground/60">
      <span className="font-display text-lg">Se<span className="gradient-text">Media</span></span>
      <nav className="flex gap-6">
        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        <a href="#" className="hover:text-foreground transition-colors">About</a>
      </nav>
      <span>© 2026 SeMedia</span>
    </div>
  </footer>
);
