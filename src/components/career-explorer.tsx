"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Category mapping for "Explore Course Topics" ─────────────
const COURSE_TOPICS = [
  { label: "IT & Software", icon: "💻", keywords: ["software", "web", "mobile", "it-and", "cloud", "devops", "technical-writing"] },
  { label: "Data & AI", icon: "📊", keywords: ["data", "machine-learning", "artificial"] },
  { label: "Business", icon: "📈", keywords: ["business", "finance", "sales", "e-commerce", "entrepreneur", "project", "supply-chain", "retail", "insurance", "real-estate"] },
  { label: "Design & Creative", icon: "🎨", keywords: ["ux", "graphic", "photography", "fashion", "interior", "game", "music"] },
  { label: "Marketing", icon: "📱", keywords: ["digital-marketing", "public-relations", "journalism"] },
  { label: "Security", icon: "🔒", keywords: ["cyber", "public-safety"] },
  { label: "Healthcare", icon: "🏥", keywords: ["health", "mental-health", "fitness", "psychology", "veterinary", "laboratory"] },
  { label: "Education", icon: "📚", keywords: ["teaching", "library", "translation"] },
  { label: "People & HR", icon: "👥", keywords: ["human-resources", "people-management", "non-profit"] },
  { label: "Engineering", icon: "🏗️", keywords: ["architecture", "automotive", "manufacturing", "environment", "urban", "agriculture", "aviation", "telecom", "skilled"] },
  { label: "Legal", icon: "⚖️", keywords: ["legal"] },
  { label: "Culinary", icon: "🍳", keywords: ["culinary"] },
];

// Stock images for career cards
const CAREER_IMAGES: Record<string, string> = {
  "software": "/images/careers/software.jpg",
  "data": "/images/careers/data.jpg",
  "digital-marketing": "/images/careers/digital-marketing.jpg",
  "cloud": "/images/careers/cloud.jpg",
  "cyber": "/images/careers/cyber.jpg",
  "game": "/images/careers/game.jpg",
  "ux": "/images/careers/ux.jpg",
  "graphic": "/images/careers/graphic.jpg",
  "finance": "/images/careers/finance.jpg",
  "health": "/images/careers/health.jpg",
  "teaching": "/images/careers/teaching.jpg",
  "photography": "/images/careers/photography.jpg",
  "architecture": "/images/careers/architecture.jpg",
  "music": "/images/careers/music.jpg",
  "fashion": "/images/careers/fashion.jpg",
  "legal": "/images/careers/legal.jpg",
  "culinary": "/images/careers/culinary.jpg",
  "aviation": "/images/careers/aviation.jpg",
  "mobile": "/images/careers/mobile.jpg",
  "project": "/images/careers/project.jpg",
  "entrepreneur": "/images/careers/entrepreneur.jpg",
  "real-estate": "/images/careers/real-estate.jpg",
  "automotive": "/images/careers/automotive.jpg",
  "sales": "/images/careers/sales.jpg",
  "retail": "/images/careers/retail.jpg",
  "insurance": "/images/careers/insurance.jpg",
  "supply-chain": "/images/careers/supply-chain.jpg",
  "e-commerce": "/images/careers/e-commerce.jpg",
  "human-resources": "/images/careers/human-resources.jpg",
  "psychology": "/images/careers/psychology.jpg",
  "product-management": "/images/careers/product-management.jpg",
  "agriculture": "/images/careers/agriculture.jpg",
  "manufacturing": "/images/careers/manufacturing.jpg",
  "veterinary": "/images/careers/veterinary.jpg",
  "library": "/images/careers/library.jpg",
  "skilled-trades": "/images/careers/skilled-trades.jpg",
  "non-profit": "/images/careers/non-profit.jpg",
  "interior": "/images/careers/interior.jpg",
  "environmental": "/images/careers/environmental.jpg",
  "translation": "/images/careers/translation.jpg",
  "telecom": "/images/careers/telecom.jpg",
  "public-relations": "/images/careers/public-relations.jpg",
  "journalism": "/images/careers/journalism.jpg",
  "public-safety": "/images/careers/public-safety.jpg",
  "fitness": "/images/careers/fitness.jpg",
  "urban": "/images/careers/urban.jpg",
  "it-and": "/images/careers/it-and.jpg",
  "technical-writing": "/images/careers/technical-writing.jpg",
  "people-management": "/images/careers/people-management.jpg",
  "default": "/images/careers/default.jpg",
};

function getCareerImage(slug: string): string {
  for (const [key, url] of Object.entries(CAREER_IMAGES)) {
    if (key !== "default" && slug.includes(key)) return url;
  }
  return CAREER_IMAGES.default;
}

interface Career {
  id: string;
  name: string;
  slug: string;
  description: string;
  pathCount: number;
  skillCount: number;
}

interface Props {
  careers: Career[];
}

const INITIAL_SHOW = 9;

export function CareerExplorer({ careers }: Props) {
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    let result = careers;

    // Topic filter
    if (selectedTopic) {
      const topic = COURSE_TOPICS.find((t) => t.label === selectedTopic);
      if (topic) {
        result = result.filter((c) =>
          topic.keywords.some((kw) => c.slug.includes(kw))
        );
      }
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    return result;
  }, [careers, search, selectedTopic]);

  const displayed = showAll || search || selectedTopic
    ? filtered
    : filtered.slice(0, INITIAL_SHOW);

  return (
    <div>
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setShowAll(true); }}
            placeholder="Search for a career or skill..."
            className="w-full rounded-full pl-12 pr-6 py-4 text-base
                       bg-surface-raised border border-[var(--border-color)]
                       text-text-primary placeholder-text-muted
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50
                       shadow-sm transition-all"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setShowAll(false); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Topic Pills */}
      <div className="mb-10">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4 text-center">
          Explore Course Topics
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {COURSE_TOPICS.map((topic) => (
            <button
              key={topic.label}
              onClick={() => {
                setSelectedTopic(selectedTopic === topic.label ? null : topic.label);
                setShowAll(true);
              }}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium
                         transition-all duration-200 border
                         ${
                           selectedTopic === topic.label
                             ? "bg-accent text-white border-accent shadow-sm"
                             : "bg-surface border-[var(--border-color)] text-text-secondary hover:border-accent/50 hover:text-accent"
                         }`}
            >
              <span>{topic.icon}</span>
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(search || selectedTopic) && (
        <div className="text-center mb-6">
          <span className="text-sm text-text-muted">
            {filtered.length} career{filtered.length !== 1 ? "s" : ""} found
            {selectedTopic && <> in <strong className="text-accent">{selectedTopic}</strong></>}
            {search && <> matching &quot;<strong className="text-accent">{search}</strong>&quot;</>}
          </span>
          {(search || selectedTopic) && (
            <button
              onClick={() => { setSearch(""); setSelectedTopic(null); setShowAll(false); }}
              className="ml-3 text-xs text-accent hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Career Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayed.map((career) => (
          <Link
            key={career.id}
            href={`/careers/${career.slug}`}
            prefetch={true}
            className="group relative bg-surface rounded-2xl overflow-hidden
                       border border-[var(--border-color)]
                       shadow-sm hover:shadow-card
                       transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image */}
            <div className="h-40 relative overflow-hidden bg-surface-raised">
              <Image
                src={getCareerImage(career.slug)}
                alt={career.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                {career.name}
              </h3>
              <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                {career.description}
              </p>

              {/* Stats strip */}
              <div className="flex items-center gap-3 text-xs text-text-muted font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {career.pathCount} path{career.pathCount !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                  {career.skillCount} skill{career.skillCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-surface-overlay/80 backdrop-blur-sm
                           group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                   className="text-text-muted group-hover:text-white transition-colors">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Show more / Show less */}
      {!search && !selectedTopic && filtered.length > INITIAL_SHOW && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                       font-semibold rounded-full px-8 py-3
                       transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
          >
            {showAll ? "Show Less" : `View All ${filtered.length} Careers`}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                 className={`transition-transform ${showAll ? "rotate-180" : ""}`}>
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* No results */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-text-secondary">No careers found matching your search.</p>
          <button
            onClick={() => { setSearch(""); setSelectedTopic(null); }}
            className="mt-3 text-accent hover:underline text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
