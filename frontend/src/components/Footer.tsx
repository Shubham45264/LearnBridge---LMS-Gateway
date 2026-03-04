import { Link } from "react-router-dom";
import { GraduationCap, Mail, MapPin, Phone, Github, Twitter, Linkedin, Youtube, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t py-16">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                LearnBridge
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Empowering learners worldwide with premium, expert-led courses. Join our community of over 10,000+ students and start your journey today.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary transition-all duration-300">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary transition-all duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary transition-all duration-300">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base mb-6">Explore</h3>
            <ul className="space-y-4">
              {["Development", "Business", "Design", "Marketing", "Data Science"].map((item) => (
                <li key={item}>
                  <Link to="/search" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base mb-6">Company</h3>
            <ul className="space-y-4">
              {["About Us", "Contact", "Careers", "Terms of Service", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-base mb-6">Get Monthly Updates</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Subscribe to our newsletter for the latest courses and updates.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-4 py-3 rounded-xl bg-secondary border-0 focus:ring-2 focus:ring-primary text-sm transition-all"
              />
              <button
                className="w-full px-4 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LearnBridge. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms</Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
