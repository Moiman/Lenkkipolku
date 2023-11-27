import { useState } from "react";
import type { FeatureCollection, Point, LineString } from "geojson";
import MapComponent from "./map/MapComponent";
import Distance from "./Distance";
import Buttons from "./Buttons";
import PathListSideBar from "./paths/PathListSideBar";
import type { IPath } from "./paths/pathsTypes";
import "./App.css";


export const geojson: FeatureCollection<Point | LineString> = {
  type: "FeatureCollection",
  features: []
};

const App = () => {
  const [distance, setDistance] = useState(0);
  const [selectedPath, setSelectedPath] = useState<IPath | null>(null);
  const [isPathListOpen, setIsPathListOpen] = useState(false);

  return (
    <div id="container">
      {isPathListOpen &&
        <PathListSideBar close={() => setIsPathListOpen(false)} selectedPath={selectedPath} setSelectedPath={setSelectedPath} />
      }
      <div id="map-component">
        <MapComponent setDistance={setDistance} selectedPath={selectedPath} />
        <Distance distance={distance} />
        <Buttons selectedPath={selectedPath} setSelectedPath={setSelectedPath} isPathListOpen={isPathListOpen} setIsPathListOpen={setIsPathListOpen} />
      </div>
    </div>
  );
};

export default App;
