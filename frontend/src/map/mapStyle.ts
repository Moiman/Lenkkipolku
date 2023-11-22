import type { LineLayer, CircleLayer } from "react-map-gl/maplibre";

const pointsLayerStyle: CircleLayer = {
  id: "my-points",
  type: "circle",
  source: "geojson",
  paint: {
    "circle-radius": 6,
    "circle-color": ["get", "color"],
    "circle-stroke-color": "#000000",
    "circle-stroke-width": 1
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

const interactiveLinesLayerStyle: LineLayer = {
  id: "interactive-lines",
  type: "line",
  source: "geojson",
  layout: {
    "line-cap": "round",
    "line-join": "round"
  },
  paint: {
    "line-color": "#000",
    "line-width": 10,
    "line-opacity": 0,
  },
  filter: ["in", "$type", "LineString"]

};

const drawPointsLayerStyle: CircleLayer = {
  id: "draw-points",
  type: "circle",
  source: "geojson",
  paint: {
    "circle-radius": 6,
    "circle-color": "#ffffff",
    "circle-stroke-color": "#000000",
    "circle-stroke-width": 2,
    "circle-stroke-opacity": 0.5,
    "circle-opacity": 0.3
  },
  filter: ["in", "$type", "Point"],
};

export {
  pointsLayerStyle,
  linesLayerStyle,
  interactiveLinesLayerStyle,
  drawPointsLayerStyle,
};
