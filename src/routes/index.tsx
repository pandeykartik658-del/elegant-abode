import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/landing/TopBar";
import { Hero } from "@/components/landing/Hero";
import { Philosophy } from "@/components/landing/Philosophy";
import { FeaturedProjects } from "@/components/landing/FeaturedProjects";
import { WorksIndex } from "@/components/landing/WorksIndex";
import { ClosingFrame } from "@/components/landing/ClosingFrame";
import { Marquee } from "@/components/landing/Marquee";
import { PageProgress } from "@/components/landing/PageProgress";
import { Cursor } from "@/components/landing/Cursor";
import { useLenis } from "@/hooks/use-lenis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AXIS NOVA — Architecture & Urban Practice" },
      {
        name: "description",
        content:
          "AXIS NOVA is an architecture and urban practice based in Tokyo and New York. Quiet volumes for loud cities — high-rise, civic, masterplanning since 2009.",
      },
      { property: "og:title", content: "AXIS NOVA — Architecture & Urban Practice" },
      {
        property: "og:description",
        content: "Quiet volumes for loud cities. Selected works 2018 — 2024.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  useLenis();
  return (
    <main className="bg-paper text-ink min-h-screen">
      <PageProgress />
      <Cursor />
      <TopBar />
      <Hero />
      <Marquee />
      <Philosophy />
      <FeaturedProjects />
      <WorksIndex />
      <ClosingFrame />
    </main>
  );
}
