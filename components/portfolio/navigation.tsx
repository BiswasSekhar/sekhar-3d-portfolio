"use client";
import Link from "next/link";
import { Asterisk, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { portfolio } from "@/lib/portfolio";
const subscribe = () => () => {};
export function Navigation({ home = false }: { home?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const dark = mounted && resolvedTheme === "dark";
  const prefix = home ? "/" : "";
  return <header className="navigation"><Link className="brand" href="/" aria-label={`${portfolio.name} home`}><Asterisk size={28} strokeWidth={2.3} /><span>{portfolio.shortName.toLowerCase()}<span className="brand-dot">.</span></span></Link><nav aria-label="Main navigation"><Link href={`${prefix}#work`}>Work</Link><Link href={`${prefix}#about`}>About</Link><Link className="nav-experience" href={`${prefix}#experience`}>Experience</Link><Link href={`${prefix}#contact`}>Let’s talk</Link></nav><button className="theme-button" disabled={!mounted} onClick={() => setTheme(dark ? "light" : "dark")} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button></header>;
}
