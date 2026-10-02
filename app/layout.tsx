import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { portfolio } from "@/lib/portfolio";
import "./globals.css";
export const metadata:Metadata={
 title:{default:`${portfolio.name} — ${portfolio.title}`,template:`%s | ${portfolio.name}`},
 description:portfolio.description,
 icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"},
};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) {
 return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning><body><Providers>{children}</Providers></body></html>;
}
