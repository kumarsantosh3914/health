import "server-only";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

const GUIDES_DIR = join(process.cwd(), "content", "guides");

export interface GuideFrontmatter {
  title: string;
  description: string;
  city: string;
  cityLabel: string;
  topic: string;
  readTime: string;
}

export interface GuideMeta {
  slug: string;
  frontmatter: GuideFrontmatter;
}

export interface Guide extends GuideMeta {
  content: string;
}

function readAll(): Guide[] {
  if (!existsSync(GUIDES_DIR)) return [];
  return readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = readFileSync(join(GUIDES_DIR, file), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.mdx$/, ""),
        frontmatter: data as GuideFrontmatter,
        content,
      };
    });
}

export function getGuidesForCity(citySlug: string): GuideMeta[] {
  return readAll()
    .filter((g) => g.frontmatter.city === citySlug)
    .map(({ slug, frontmatter }) => ({ slug, frontmatter }));
}

export function getGuide(slug: string): Guide | null {
  const path = join(GUIDES_DIR, `${slug}.mdx`);
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as GuideFrontmatter, content };
}

export function getAllGuideSlugs(): string[] {
  return readAll().map((g) => g.slug);
}
