import type { LatLngTuple } from './types';

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function toDegrees(radians: number): number {
  return radians * 180 / Math.PI;
}

export function isPointInPolygon(point: LatLngTuple, polygon: LatLngTuple[]): boolean {
  const x = point[0];
  const y = point[1];
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export function getDistance(p1: LatLngTuple, p2: LatLngTuple): number {
  const R = 6371e3; // metres
  const φ1 = p1[0] * Math.PI / 180;
  const φ2 = p2[0] * Math.PI / 180;
  const Δφ = (p2[0] - p1[0]) * Math.PI / 180;
  const Δλ = (p2[1] - p1[1]) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function isPointInCircle(point: LatLngTuple, center: LatLngTuple, radius: number): boolean {
  return getDistance(point, center) < radius;
}

// Function to calculate bearing between two points
function getBearing(p1: LatLngTuple, p2: LatLngTuple): number {
  const [lat1, lon1] = p1.map(toRadians);
  const [lat2, lon2] = p2.map(toRadians);

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  return Math.atan2(y, x);
}

// Function to get destination point given a starting point, bearing, and distance
function getDestination(point: LatLngTuple, bearing: number, distance: number): LatLngTuple {
  const R = 6371e3; // metres
  const [lat1, lon1] = point.map(toRadians);
  const d = distance / R;

  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(bearing));
  const lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));

  return [toDegrees(lat2), toDegrees(lon2)];
}


export function findNearestPointOnRoute(point: LatLngTuple, route: LatLngTuple[]) {
  let minDistance = Infinity;
  let nearestPoint: LatLngTuple | null = null;
  let nearestSegmentIndex = -1;

  for (let i = 0; i < route.length - 1; i++) {
    const p1 = route[i];
    const p2 = route[i + 1];

    const distP1 = getDistance(point, p1);
    if (distP1 < minDistance) {
        minDistance = distP1;
        nearestPoint = p1;
        nearestSegmentIndex = i;
    }

    const distP2 = getDistance(point, p2);
     if (distP2 < minDistance) {
        minDistance = distP2;
        nearestPoint = p2;
        nearestSegmentIndex = i;
    }

    const segmentLength = getDistance(p1, p2);
    if (segmentLength === 0) continue;

    const bearingP1P = getBearing(p1, point);
    const bearingP1P2 = getBearing(p1, p2);

    const angle = bearingP1P - bearingP1P2;
    const distP1CrossTrack = Math.abs(Math.asin(Math.sin(distP1 / 6371e3) * Math.sin(angle)) * 6371e3);

    const distAlongSegment = Math.acos(Math.cos(distP1 / 6371e3) / Math.cos(distP1CrossTrack / 6371e3)) * 6371e3;

    if (distAlongSegment > segmentLength || distAlongSegment < 0) {
      continue;
    }

    if (distP1CrossTrack < minDistance) {
      minDistance = distP1CrossTrack;
      nearestPoint = getDestination(p1, bearingP1P2, distAlongSegment);
      nearestSegmentIndex = i;
    }
  }

  return { distance: minDistance, point: nearestPoint, segmentIndex: nearestSegmentIndex };
}
