import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getCity } from "@/lib/constants";
import { getGuide } from "@/lib/guides";
import CityTabs from "@/components/CityTabs";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { city: string; slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = getGuide(params.slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: guide.frontmatter.title,
    description: guide.frontmatter.description,
    openGraph: {
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
      type: "article",
    },
  };
}

// Tailwind-styled renderers for MDX elements (no @tailwindcss/typography dependency).
const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-8 text-xl font-bold text-gray-900 dark:text-white" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-4 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-4 list-decimal space-y-1 pl-6 text-gray-700 dark:text-gray-300" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-gray-900 dark:text-white" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-6 border-l-4 border-primary/40 bg-primary/5 px-4 py-3 text-sm italic text-gray-600 dark:text-gray-300"
      {...props}
    />
  ),
};

export default function GuideDetailPage({ params }: PageProps) {
  const city = getCity(params.city);
  const guide = getGuide(params.slug);
  if (!city || !guide || guide.frontmatter.city !== city.slug) notFound();

  return (
    <>
      <CityTabs city={city.slug} cityLabel={city.label} />
      <article className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <Link
          href={`/${city.slug}/guides`}
          className="mb-6 inline-block text-sm text-gray-500 hover:text-primary dark:text-gray-400"
        >
          ← All {city.label} guides
        </Link>
        <div className="text-xs font-semibold uppercase tracking-wide text-primary">
          {guide.frontmatter.readTime}
        </div>
        <h1 className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">
          {guide.frontmatter.title}
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {guide.frontmatter.description}
        </p>
        <div className="mt-6 border-t border-gray-100 pt-2 dark:border-gray-800">
          <MDXRemote source={guide.content} components={mdxComponents} />
        </div>
      </article>
    </>
  );
}
