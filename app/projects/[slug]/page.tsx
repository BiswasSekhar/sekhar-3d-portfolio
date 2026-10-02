import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { projects } from "@/lib/portfolio";
import { Navigation } from "@/components/portfolio/navigation";
import { Footer } from "@/components/portfolio/footer";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export const dynamicParams = false;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(project => project.slug === slug);
  return { title: project?.title ?? "Project not found", description: project?.description };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find(project => project.slug === slug);
  if (!project) notFound();
  return <main className="portfolio"><Navigation home /><article className="case-study rounded-panel"><Link href="/#work" className="outline-button">Back to selected work</Link><div className="case-intro"><span className="section-label">{project.category}</span><h1>{project.title}</h1><p>{project.description}</p><div className="tool-pills">{project.technologies.map(technology => <span key={technology}>{technology}</span>)}</div></div><div className="case-columns"><section><h2>The idea</h2><p>{project.problem}</p></section><section><h2>How I built it</h2><p>{project.approach}</p></section></div><section className="case-details"><h2>What it does</h2>{project.details.map(detail => <p key={detail}><Check size={18} />{detail}</p>)}</section>{project.liveUrl && <a className="primary-button" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit {project.title} <ArrowUpRight size={17} /></a>}</article><Footer /></main>;
}
