import type { LineLayer, CircleLayer } from "react-map-gl/maplibre";

const pointsLayerStyle: CircleLayer = {
  id: "my-points",
  type: "circle",
  source: "geojson",
  paint: {
    "circle-radius": 5,
    "circle-color": ["get", "color"],
    "circle-stroke-color": "#000000",
    "circle-stroke-width": 2
  },
  filter: ["in", "$type", "Point"],
};

const linesLayerStyle: LineLayer = {
  id: "my-lines",
  type: "line",
  source: "geojson",
  layout: {
    "line-cap": "round",
    "line-join": "round"
  },
  paint: {
    "line-color": "#000",
    "line-width": 2.5
  },
  filter: ["in", "$type", "LineString"]
};

export { pointsLayerStyle, linesLayerStyle };
