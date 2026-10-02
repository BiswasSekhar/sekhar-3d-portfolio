import Link from "next/link";
import { Asterisk } from "lucide-react";
import { portfolio } from "@/lib/portfolio";
export function Footer() {
  return <footer className="footer"><Link href="/" className="brand"><Asterisk size={22} />{portfolio.shortName.toLowerCase()}.</Link><p>Made with care, and a little curiosity.</p><span>© {new Date().getFullYear()} {portfolio.name}</span></footer>;
}
