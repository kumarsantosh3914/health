import type { MetadataRoute } from "next";
import { CITIES, SITE_URL } from "@/lib/constants";
import { getAllDoctorSlugs } from "@/lib/data";
import { getAllGuideSlugs, getGuide } from "@/lib/guides";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/suggest`, lastModified: now, priority: 0.5 },
    { url: `${SITE_URL}/community`, lastModified: now, priority: 0.5 },
    { url: `${SITE_URL}/pending`, lastModified: now, priority: 0.4 },
  ];

  const cityRoutes: MetadataRoute.Sitemap = CITIES.flatMap((c) => [
    { url: `${SITE_URL}/${c.slug}`, lastModified: now, priority: 0.9 },
    { url: `${SITE_URL}/${c.slug}/list`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/${c.slug}/map`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/${c.slug}/events`, lastModified: now, priority: 0.7 },
    { url: `${SITE_URL}/${c.slug}/guides`, lastModified: now, priority: 0.7 },
  ]);

  const doctors = await getAllDoctorSlugs();
  const doctorRoutes: MetadataRoute.Sitemap = doctors.map((d) => ({
    url: `${SITE_URL}/${d.city}/doctor/${d.slug}`,
    lastModified: now,
    priority: 0.6,
  }));

  const guideRoutes: MetadataRoute.Sitemap = getAllGuideSlugs()
    .map((slug) => {
      const g = getGuide(slug);
      if (!g) return null;
      return {
        url: `${SITE_URL}/${g.frontmatter.city}/guides/${slug}`,
        lastModified: now,
        priority: 0.6,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  return [...staticRoutes, ...cityRoutes, ...doctorRoutes, ...guideRoutes];
}
