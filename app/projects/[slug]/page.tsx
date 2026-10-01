import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { projects } from "@/lib/portfolio";
import { Navigation } from "@/components/portfolio/navigation";
import { Footer } from "@/components/portfolio/footer";

type Props={params:Promise<{slug:string}>};
export function generateStaticParams() {return projects.map(project=>({slug:project.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata> {
 const {slug}=await params;const project=projects.find(project=>project.slug===slug);
 return {title:project?.title??"Project not found",description:project?.description};
}
export default async function ProjectPage({params}:Props) {
 const {slug}=await params;const project=projects.find(project=>project.slug===slug);if(!project)notFound();
 return <main className="portfolio"><Navigation home/><article className="case-study rounded-panel"><Link href="/#work" className="outline-button">Back to selected work</Link><div className="case-intro"><span className="dialog-pill">Concept exploration</span><h1>{project.title}</h1><p>{project.description}</p><div className="tool-pills">{project.technologies.map(technology=><span key={technology}>{technology}</span>)}</div></div><div className="case-columns"><section><h2>The idea</h2><p>{project.problem}</p></section><section><h2>The approach</h2><p>{project.approach}</p></section></div><section className="case-details"><h2>What this explores</h2>{project.details.map(detail=><p key={detail}><Sparkles size={18}/>{detail}</p>)}</section><p className="dialog-note">This is an illustrative concept project. Replace it with your own work in the portfolio content file.</p></article><Footer/></main>;
}
