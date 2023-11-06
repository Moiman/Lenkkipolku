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
  features: [
    // { type: "Feature", geometry: { type: "LineString", coordinates: [[23.7685, 61.4961], [23.7785, 61.4661]] } }
  ]
};

const App = () => {
  const [distance, setDistance] = useState(0);

  const pointsLayerStyle: CircleLayer = {
    id: "my-points",
    type: "circle",
    source: "geojson",
    paint: {
      "circle-radius": 5,
      "circle-color": "#000"
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

  const mapRef = useRef<MapRef>(null);

  const [viewState, setViewState] = useState({
    longitude: 23.7685,
    latitude: 61.4661,
    zoom: 11,
  });

  const handleClick = (e: MapLayerMouseEvent) => {
    // Remove lineString
    if (geojson.features.length > 1) geojson.features.pop();

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
    // console.log(geojson);
  };

  return (
    <>
      <Map
        {...viewState}
        ref={mapRef}
        onMove={e => { setViewState(e.viewState); }}
        onClick={handleClick}
        maxBounds={[[23.446809, 61.332591], [24.090196, 61.599578]]}
        minZoom={8}
        // maxZoom={14}
        style={{
          // width: "100%", height: "100%"
        }}
        mapStyle="http://localhost:8081/style.json"
      >
        <NavigationControl />
        {/* <Marker longitude={23.7685} latitude={61.4661} color="red" /> */}
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
