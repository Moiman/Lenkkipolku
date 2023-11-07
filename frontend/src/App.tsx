import { useState, useRef } from "react";
import Map, { Source, Layer, NavigationControl } from "react-map-gl/maplibre";
import * as turf from "@turf/turf";
import Distance from "./Distance";
import type { LineLayer, MapLayerMouseEvent, MapRef, CircleLayer, GeoJSONSource } from "react-map-gl/maplibre";
import type { FeatureCollection, Point, LineString, Feature, Position } from "geojson";
import "maplibre-gl/dist/maplibre-gl.css";
import "./App.css";


const geojson: FeatureCollection<Point | LineString> = {
  type: "FeatureCollection",
  features: []
};

const pointsLayerStyle: CircleLayer = {
  id: "my-points",
  type: "circle",
  source: "geojson",
  paint: {
    "circle-radius": 5,
    "circle-color": "#ffffff",
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


const App = () => {
  const [cursor, setCursor] = useState("auto");
  const [distance, setDistance] = useState(0);

  const mapRef = useRef<MapRef>(null);

  const [viewState, setViewState] = useState({
    longitude: 23.7685,
    latitude: 61.4661,
    zoom: 11,
  });

  const handleMouseMove = (e: MapLayerMouseEvent) => {
    const features = e.target.queryRenderedFeatures(e.point, {
      layers: ["my-points"]
    });
    setCursor(
      features.length
        ? "pointer"
        : "crosshair"
    );
  };

  const handleClick = (e: MapLayerMouseEvent) => {
    const features = e.target.queryRenderedFeatures(e.point, {
      layers: ["my-points"]
    });
    console.log(features);

    // Remove lineString
    if (geojson.features.length > 1) geojson.features.pop();

    if (features.length) {
      const id = features[0].properties.id as Date;
      geojson.features = geojson.features.filter((point) => {
        return point.properties?.id !== id;
      });
    } else {

      const point: Feature<Point> = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [e.lngLat.lng, e.lngLat.lat],
        },
        "properties": {
          "id": String(new Date().getTime())
        }
      };


      geojson.features.push(point);
    }

    const lineString: Feature<LineString> = {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": []
      },
      "properties": {
        "id": String(new Date().getTime())
      }
    };

    // const points = geojson.features.filter((feature) => feature.geometry.type === "Point");
    if (geojson.features.length > 1) {
      lineString.geometry.coordinates = geojson.features.map((point) => point.geometry.coordinates as Position);
      geojson.features.push(lineString);
    }
    setDistance(turf.length(lineString));
    (mapRef.current?.getSource("geojson") as GeoJSONSource).setData(geojson);
  };

  return (
    <>
      <Map
        {...viewState}
        ref={mapRef}
        onMove={e => { setViewState(e.viewState); }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        cursor={cursor}
        maxBounds={[[23.446809, 61.332591], [24.090196, 61.599578]]}
        mapStyle="http://localhost:8081/style.json"
      >
        <NavigationControl />
        <Source id="geojson" type="geojson" data={geojson}>
          <Layer {...linesLayerStyle} />
          <Layer {...pointsLayerStyle} />
        </Source>
      </Map>
      <Distance distance={distance} />
    </>
  );
};

export default App;
