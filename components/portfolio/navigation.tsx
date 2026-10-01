"use client";
import Link from "next/link";
import { Asterisk, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { portfolio } from "@/lib/portfolio";
const subscribe = () => () => {};
export function Navigation({home=false}:{home?:boolean}) {
 const { resolvedTheme, setTheme } = useTheme();
 const mounted = useSyncExternalStore(subscribe, () => true, () => false);
 const dark = mounted && resolvedTheme === "dark";
 return <header className="navigation"><Link className="brand" href="/" aria-label={`${portfolio.name} home`}><Asterisk size={31} strokeWidth={2.5}/><span>{portfolio.name.toLowerCase()}<span className="brand-dot">.</span></span></Link><nav aria-label="Main navigation"><Link href={home?"/#work":"#work"}>Work</Link><Link href={home?"/#about":"#about"}>About</Link><Link href={home?"/#playground":"#playground"}>Playground</Link></nav><button className="theme-button" disabled={!mounted} onClick={()=>setTheme(dark?"light":"dark")} aria-label={dark?"Switch to light mode":"Switch to dark mode"}>{dark?<Sun size={20}/>:<Moon size={20}/>}</button></header>;
}
