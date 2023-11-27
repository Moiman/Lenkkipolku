import type { FeatureCollection, Point, LineString } from "geojson";

const geojson: FeatureCollection<Point | LineString> = {
  type: "FeatureCollection",
  features: []
};

export { geojson };
