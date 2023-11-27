import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Map, { Source, Layer, NavigationControl } from "react-map-gl/maplibre";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import turflength from "@turf/length";
import bbox from "@turf/bbox";
import type { MapLayerMouseEvent, MapRef, GeoJSONSource, MapGeoJSONFeature } from "react-map-gl/maplibre";
import type { Point, LineString, FeatureCollection, Feature, Position } from "geojson";
import { pointsLayerStyle, linesLayerStyle, drawPointsLayerStyle, interactiveLinesLayerStyle } from "./mapStyle";
import { IPath } from "../paths/pathsTypes";
import { geojson } from "./geojson";
import "maplibre-gl/dist/maplibre-gl.css";


interface IProps {
  setDistance: React.Dispatch<React.SetStateAction<number>>,
  selectedPath: IPath | null,
}

const drawGeojson: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: []
};

const MapComponent = ({ setDistance, selectedPath }: IProps) => {
  const [cursor, setCursor] = useState("auto");
  const [viewState, setViewState] = useState({
    longitude: 23.7685,
    latitude: 61.4661,
    zoom: 11,
  });

  useEffect(() => {
    if (selectedPath) {
      geojson.features = selectedPath.path.features;
      setDistance(turflength(selectedPath.path));
    } else {
      geojson.features = [];
    }
    (mapRef.current?.getSource("geojson") as GeoJSONSource)?.setData(geojson);
    if (geojson.features.length > 0) {
      const [x1, y1, x2, y2] = bbox(geojson);
      mapRef.current?.fitBounds([x1, y1, x2, y2], { padding: 100 });
    }
  }, [selectedPath, setDistance]);

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
        "id": uuidv4()
      }
    };

    if (geojson.features.length > 1) {
      newPath.geometry.coordinates = geojson.features.map((point) => point.geometry.coordinates as Position);
      geojson.features.push(newPath);
    }
    setDistance(turflength(newPath));
  };


  const handleMouseMove = (e: MapLayerMouseEvent) => {
    const features = e.features;
    setCursor(
      features?.length
        ? "pointer"
        : "crosshair"
    );
    if (features?.length) {
      const line = geojson.features.find(f => f.geometry.type === "LineString") as Feature<LineString>;
      const layerdIds = features.map(f => f.layer.id);
      if (layerdIds.includes("interactive-lines") && !layerdIds.includes("my-points")) {
        const newPoint: Feature<Point> = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": nearestPointOnLine(line, [e.lngLat.lng, e.lngLat.lat]).geometry.coordinates,
          },
          "properties": {
            "id": uuidv4()
          }
        };

        drawGeojson.features.pop();
        drawGeojson.features.push(newPoint);

        (e.target.getSource("drawGeojson") as GeoJSONSource)?.setData(drawGeojson);
        return;
      }
    }
    if (drawGeojson.features.length > 0) {
      drawGeojson.features = [];
      (e.target.getSource("drawGeojson") as GeoJSONSource)?.setData(drawGeojson);
    }
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
        "id": uuidv4(),
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
      let pointToMove = e.features[0];
      if (pointToMove.layer.id === "draw-points") {
        const newPoint = drawGeojson.features[0];
        const line = geojson.features.find(f => f.geometry.type === "LineString") as Feature<LineString>;
        const nearestPoint = nearestPointOnLine(line, newPoint);

        geojson.features.splice(nearestPoint.properties.index + 1, 0, newPoint);
        reDrawLine();
        (e.target.getSource("geojson") as GeoJSONSource).setData(geojson);

        pointToMove = newPoint as MapGeoJSONFeature;
      }
      const pointToMoveIndex = geojson.features.findIndex(p => p.properties?.id === pointToMove.properties.id);
      const onPointMove = (ev: MapLayerMouseEvent) => {
        setCursor("grabbing");
        geojson.features[pointToMoveIndex].geometry.coordinates = [ev.lngLat.lng, ev.lngLat.lat];
        reDrawLine();
        (e.target.getSource("geojson") as GeoJSONSource).setData(geojson);
      };

      setCursor("grab");
      void e.target
        .on("mousemove", onPointMove)
        .once("mouseup", (e) => e.target.off("mousemove", onPointMove));
    }
  };

  return (
    <>
      <Map
        {...viewState}
        ref={mapRef}
        onMove={e => setViewState(e.viewState)}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onContextMenu={handleRightClick}
        onMouseDown={handleMouseDown}
        interactiveLayerIds={["my-points", "interactive-lines", "draw-points"]}
        cursor={cursor}
        maxBounds={[[23.446809, 61.332591], [24.090196, 61.599578]]}
        mapStyle="http://localhost:8081/style.json"
      >
        <NavigationControl />
        <Source id="geojson" type="geojson" data={geojson}>
          <Layer {...linesLayerStyle} />
          <Layer {...interactiveLinesLayerStyle} />
          <Layer {...pointsLayerStyle} />
        </Source>
        <Source id="drawGeojson" type="geojson" data={drawGeojson}>
          <Layer {...drawPointsLayerStyle} />
        </Source>
      </Map>
    </>
  );
};

export default MapComponent;
