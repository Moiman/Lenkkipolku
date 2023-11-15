import { useState, useRef } from "react";
import Map, { Source, Layer, NavigationControl } from "react-map-gl/maplibre";
import * as turf from "@turf/turf";
import type { LineLayer, MapLayerMouseEvent, MapRef, CircleLayer, GeoJSONSource } from "react-map-gl/maplibre";
import type { FeatureCollection, Point, LineString, Feature, Position } from "geojson";
import Distance from "./Distance";
import User from "./auth/User";
import AuthProvider from "./auth/AuthProvider";
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


const App = () => {
  const [cursor, setCursor] = useState("auto");
  const [distance, setDistance] = useState(0);
  const [viewState, setViewState] = useState({
    longitude: 23.7685,
    latitude: 61.4661,
    zoom: 11,
  });

  const mapRef = useRef<MapRef>(null);

  const reDrawLine = () => {
    //Remove existing paths
    geojson.features = geojson.features.filter(feature => feature.geometry.type !== "LineString");

    // Color first point green and last red
    geojson.features.forEach((f, i) => {
      let color = "white";
      if (i === 0) {
        color = "green";
      } else if (i === geojson.features.length - 1) {
        color = "red";
      }
      if (f.properties) {
        f.properties.color = color;
      }
    });

    const newPath: Feature<LineString> = {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": []
      },
      "properties": {
        "id": String(new Date().getTime())
      }
    };

    if (geojson.features.length > 1) {
      newPath.geometry.coordinates = geojson.features.map((point) => point.geometry.coordinates as Position);
      geojson.features.push(newPath);
    }
    setDistance(turf.length(newPath));
  };


  const handleMouseMove = (e: MapLayerMouseEvent) => {
    const features = e.features;
    setCursor(
      features?.length
        ? "pointer"
        : "crosshair"
    );
  };

  const handleRightClick = (e: MapLayerMouseEvent) => {
    const features = e.features;

    if (features?.length) {
      const pointsToRemove = features.map(f => f.properties.id as Date);
      geojson.features = geojson.features.filter((point) => {
        return !pointsToRemove.includes(point.properties?.id as Date);
      });

      reDrawLine();
      (e.target.getSource("geojson") as GeoJSONSource).setData(geojson);
    }

  };

  const handleClick = (e: MapLayerMouseEvent) => {
    const newPoint: Feature<Point> = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [e.lngLat.lng, e.lngLat.lat],
      },
      "properties": {
        "id": String(new Date().getTime()),
        "color": "white"
      }
    };

    geojson.features.push(newPoint);

    reDrawLine();
    (e.target.getSource("geojson") as GeoJSONSource).setData(geojson);
  };


  const handleMouseDown = (e: MapLayerMouseEvent) => {
    //Ignore if right click
    if (e.originalEvent.button === 2) {
      return;
    }
    if (e.features?.length) {
      e.preventDefault();
      const pointToMove = e.features[0];
      const pointToMoveIndex = geojson.features.findIndex(p => p.properties?.id === pointToMove.properties.id);
      const onPointMove = (ev: MapLayerMouseEvent) => {
        setCursor("grabbing");
        geojson.features[pointToMoveIndex].geometry.coordinates = [ev.lngLat.lng, ev.lngLat.lat];
        reDrawLine();
        (e.target.getSource("geojson") as GeoJSONSource).setData(geojson);
      };

      setCursor("grab");
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      e.target
        .on("mousemove", onPointMove)
        .once("mouseup", (e) => e.target.off("mousemove", onPointMove));
    }
  };

  return (
    <AuthProvider>
      <Map
        {...viewState}
        ref={mapRef}
        onMove={e => { setViewState(e.viewState); }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        onMouseDown={handleMouseDown}
        interactiveLayerIds={["my-points"]}
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
      <User />
    </AuthProvider>
  );
};

export default App;
