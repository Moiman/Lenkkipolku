import type { FeatureCollection, Point, LineString } from "geojson";

export interface IPath {
  id: number,
  user_id: number,
  title: string,
  path: FeatureCollection<Point | LineString>,
  created_at: string,
  updated_at: string,
}
