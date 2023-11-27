import { Button, ButtonGroup } from "react-bootstrap";
import type { GeoJSONSource } from "react-map-gl/maplibre";
import type { RefObject } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import type { IPath } from "./pathsTypes";
import { geojson } from "../map/geojson";
import SwapSVG from "../assets/swap.svg";
import ClearSVG from "../assets/close.svg";

interface IProps {
  mapRef: RefObject<MapRef>,
  setSelectedPath: React.Dispatch<React.SetStateAction<IPath | null>>,
  setDistance: React.Dispatch<React.SetStateAction<number>>,
}

const EditButtons = ({ mapRef, setSelectedPath, setDistance }: IProps) => {
  const clearPath = () => {
    geojson.features = [];
    (mapRef.current?.getSource("geojson") as GeoJSONSource)?.setData(geojson);
    setSelectedPath(null);
    setDistance(0);
  };

  const reversePath = () => {
    const points = geojson.features.filter(f => f.geometry.type === "Point").reverse();
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    if (lastPoint?.properties) {
      lastPoint.properties.color = "red";
    }
    if (firstPoint?.properties) {
      firstPoint.properties.color = "green";
    }

    const path = geojson.features.filter(f => f.geometry.type === "LineString");
    path[0]?.geometry.coordinates.reverse();
    geojson.features = points.concat(path);
    (mapRef.current?.getSource("geojson") as GeoJSONSource)?.setData(geojson);
  };

  return (
    <ButtonGroup className="edit-buttons" style={{ height: "40px" }}>
      <Button variant="light" onClick={clearPath}>
        <img src={ClearSVG} />
      </Button>
      <Button variant="light" onClick={reversePath}>
        <img src={SwapSVG} />
      </Button>
    </ButtonGroup>
  );
};

export default EditButtons;
