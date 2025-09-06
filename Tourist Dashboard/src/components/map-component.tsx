'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngTuple, RiskZone } from '@/lib/types';

// Fix for default icon path issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const touristIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'tourist-marker'
});

interface MapProps {
  touristPosition: LatLngTuple;
  setTouristPosition: (position: LatLngTuple) => void;
  touristRoute: LatLngTuple[];
  riskZones: RiskZone[];
}

export default function MapComponent({ touristPosition, setTouristPosition, touristRoute, riskZones }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [26.0, 92.5],
        zoom: 8,
      });
      mapRef.current = map;

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add route polyline
      L.polyline(touristRoute, { color: '#1E3A8A', weight: 4, opacity: 0.7 }).addTo(map);

      // Add risk zones
      riskZones.forEach((zone) => {
        const pathOptions = { color: zone.color, fillColor: zone.color, fillOpacity: 0.2, weight: 2 };
        let layer: L.Layer;
        if (zone.shape === 'polygon') {
          layer = L.polygon(zone.coords as LatLngTuple[], pathOptions);
        } else {
          layer = L.circle(zone.coords as LatLngTuple, { ...pathOptions, radius: zone.radius! });
        }
        layer.addTo(map).bindPopup(`${zone.name} - ${zone.riskLevel} risk`);
      });

      // Add draggable tourist marker
      const marker = L.marker(touristPosition, { draggable: true, icon: touristIcon }).addTo(map);
      marker.on('dragend', () => {
        const latLng = marker.getLatLng();
        setTouristPosition([latLng.lat, latLng.lng]);
      });
      markerRef.current = marker;
    }

    return () => {
      // Cleanup map instance on component unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  useEffect(() => {
    // Update marker position when touristPosition prop changes
    if (markerRef.current && touristPosition) {
        const currentMarkerPos = markerRef.current.getLatLng();
        if(currentMarkerPos.lat !== touristPosition[0] || currentMarkerPos.lng !== touristPosition[1]) {
            markerRef.current.setLatLng(touristPosition);
        }
    }
  }, [touristPosition]);

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} className="z-0" />;
}
