import { Navigation } from "@/components/portfolio/navigation";
import { Hero } from "@/components/portfolio/hero";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { AboutSection } from "@/components/portfolio/about-section";
import { Footer } from "@/components/portfolio/footer";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { ContactSection } from "@/components/portfolio/contact-section";

export default function Home() {
 return <main className="portfolio"><a className="skip-link" href="#main">Skip to content</a><Navigation /><Hero /><ProjectGrid /><AboutSection /><ExperienceSection /><ContactSection /><Footer /></main>;
}
