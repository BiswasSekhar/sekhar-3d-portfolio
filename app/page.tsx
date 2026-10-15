import { Navigation } from "@/components/portfolio/navigation";
import { MascotRunner } from "@/components/portfolio/mascot-runner";
import { Hero } from "@/components/portfolio/hero";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { AboutSection } from "@/components/portfolio/about-section";
import { Footer } from "@/components/portfolio/footer";
import { ExperienceSection } from "@/components/portfolio/experience-section";
import { ContactSection } from "@/components/portfolio/contact-section";

export default function Home() {
 return <main className="portfolio app-window">
  <a className="skip-link" href="#main">Skip to content</a>
  <div className="app-windowbar">
   <div className="window-controls" aria-hidden="true"><i /><i /><i /></div>
   <span className="windowbar-title">Biswas Studio</span>
   <MascotRunner />
   <span className="windowbar-status"><i className="status-dot" />Kochi, India</span>
  </div>
  <div className="app-layout">
   <aside className="app-sidebar" aria-label="Portfolio navigation">
    <Navigation appMode />
   </aside>
   <div className="app-content">
    <Hero />
    <ProjectGrid />
    <AboutSection />
    <ExperienceSection />
    <ContactSection />
    <Footer />
   </div>
  </div>
 </main>;
}
