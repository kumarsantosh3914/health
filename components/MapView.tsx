"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { Doctor } from "@/lib/types";
import {
  getSpecialityColor,
  getSpecialityIcon,
  getFeeTier,
} from "@/lib/constants";
import { distanceKm } from "@/lib/search";

interface Props {
  doctors: Doctor[];
  center: [number, number];
  zoom: number;
  onBook?: (doctor: Doctor) => void;
}

export default function MapView({ doctors, center, zoom, onBook }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterRef = useRef<any>(null);
  const onBookRef = useRef(onBook);
  onBookRef.current = onBook;

  // Init map once.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");
      if (cancelled || !mapRef.current || mapInstance.current) return;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: true,
        zoomControl: false, // re-added bottom-right to keep top-left free for overlays
      }).setView(center, zoom);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapInstance.current = map;

      // Expose a global handler the popup HTML can call.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__ihaBook = (slug: string) => {
        const d = doctors.find((doc) => doc.slug === slug);
        if (d && onBookRef.current) onBookRef.current(d);
      };
    })();

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-render markers when doctors change.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");
      const map = mapInstance.current;
      if (cancelled || !map) return;

      if (clusterRef.current) {
        map.removeLayer(clusterRef.current);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cluster = (L as any).markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
      });

      for (const d of doctors) {
        const color = getSpecialityColor(d.speciality);
        const sicon = getSpecialityIcon(d.speciality);
        // BudgetSF-style colored rounded-square marker with the speciality icon.
        const icon = L.divIcon({
          className: "iha-marker",
          html: `<div class="iha-pin" style="background:${color}">${sicon}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -16],
        });
        const dist = distanceKm(center[0], center[1], d.clinic.lat, d.clinic.lng);
        const tier = getFeeTier(d.consultation_fee).label;
        const marker = L.marker([d.clinic.lat, d.clinic.lng], { icon });
        marker.bindPopup(
          `<div style="min-width:200px">
            <div style="font-weight:700;font-size:14px;color:#111">${d.name}</div>
            <div style="font-size:12px;color:#666;margin:1px 0">${
              d.clinic.neighbourhood || d.clinic.city
            } · ${tier} ₹${d.consultation_fee}</div>
            <div style="font-size:12px;color:${color};font-weight:600">${d.speciality}</div>
            <div style="font-size:12px;color:#555;margin-top:2px">🏥 ${d.clinic.name}</div>
            <div style="font-size:12px;color:#555">⭐ ${d.rating.toFixed(1)} · 👥 ${
              d.patient_count
            } · ${dist.toFixed(1)} km</div>
            <button onclick="window.__ihaBook && window.__ihaBook('${d.slug}')"
              style="margin-top:8px;width:100%;background:#0EA5E9;color:#fff;border:none;border-radius:8px;padding:6px 0;font-weight:600;font-size:13px;cursor:pointer">
              Book Appointment
            </button>
          </div>`
        );
        cluster.addLayer(marker);
      }

      map.addLayer(cluster);
      clusterRef.current = cluster;
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, center]);

  return <div ref={mapRef} className="h-full w-full" />;
}
