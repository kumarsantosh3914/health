import HeroSection from "@/components/HeroSection";
import CityCard from "@/components/CityCard";
import { getCityStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cities = await getCityStats();
  const totalDoctors = cities.reduce((s, c) => s + c.doctorCount, 0);

  return (
    <>
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Now live in 7 cities
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {totalDoctors > 0
              ? `${totalDoctors} verified doctors and growing.`
              : "Pick your city to explore doctors near you."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c) => (
            <CityCard key={c.slug} city={c} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 px-6 py-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Know a great doctor we&apos;re missing?
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Help your city find better care. It takes 30 seconds.
          </p>
          <a
            href="/suggest"
            className="mt-5 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-600"
          >
            Suggest a Doctor
          </a>
        </div>
      </section>
    </>
  );
}
