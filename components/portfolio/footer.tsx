import Link from "next/link";
import { Asterisk, Mail, Code2 } from "lucide-react";
import { portfolio } from "@/lib/portfolio";
export function Footer() {
 return <footer className="footer"><Link href="/" className="brand"><Asterisk size={23}/>{portfolio.name.toLowerCase()}.</Link><p>Thoughtfully designed. Playfully built.</p><div className="footer-links">{portfolio.email && <a href={`mailto:${portfolio.email}`} aria-label="Email Sekhar"><Mail size={19}/></a>}{portfolio.github && <a href={portfolio.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><Code2 size={19}/></a>}<span>© {new Date().getFullYear()} {portfolio.name}</span></div></footer>;
}
