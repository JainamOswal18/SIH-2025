import type { LatLngTuple } from './types';

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

export function findNearestPointOnRoute(point: LatLngTuple, route: LatLngTuple[]) {
  let minDistance = Infinity;
  let nearestPoint: LatLngTuple | null = null;
  let nearestSegmentIndex = -1;

  for (let i = 0; i < route.length - 1; i++) {
    const p1 = route[i];
    const p2 = route[i + 1];

    const l2 = Math.pow(getDistance(p1, p2), 2);
    if (l2 === 0) {
      const dist = getDistance(point, p1);
      if (dist < minDistance) {
        minDistance = dist;
        nearestPoint = p1;
        nearestSegmentIndex = i;
      }
      continue;
    }

    let t = ((point[0] - p1[0]) * (p2[0] - p1[0]) + (point[1] - p1[1]) * (p2[1] - p1[1])) / l2;
    t = Math.max(0, Math.min(1, t));
    
    // This projection is a simplification and not perfectly accurate on a sphere,
    // but good enough for this purpose. A true projection is much more complex.
    const projection: LatLngTuple = [
        p1[0] + t * (p2[0] - p1[0]), 
        p1[1] + t * (p2[1] - p1[1])
    ];

    const dist = getDistance(point, projection);
    if (dist < minDistance) {
      minDistance = dist;
      nearestPoint = projection;
      nearestSegmentIndex = i;
    }
  }

  return { distance: minDistance, point: nearestPoint, segmentIndex: nearestSegmentIndex };
}
