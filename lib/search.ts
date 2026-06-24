import Fuse, { type IFuseOptions } from "fuse.js";
import type { Doctor } from "./types";

const FUSE_OPTIONS: IFuseOptions<Doctor> = {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "speciality", weight: 0.3 },
    { name: "clinic.name", weight: 0.2 },
    { name: "tags", weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export function searchDoctors(doctors: Doctor[], query: string): Doctor[] {
  const q = query.trim();
  if (!q) return doctors;
  const fuse = new Fuse(doctors, FUSE_OPTIONS);
  return fuse.search(q).map((r) => r.item);
}

/** Haversine distance in km between two lat/lng points. */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
