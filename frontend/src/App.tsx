import { useEffect, useRef, useState } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import MapComponent from "./map/MapComponent";
import Distance from "./map/Distance";
import Buttons from "./Buttons";
import PathListSideBar from "./paths/PathListSideBar";
import pathsService from "./paths/pathsService";
import type { IPath } from "./paths/pathsTypes";
import "./App.css";


const App = () => {
  const [distance, setDistance] = useState(0);
  const [isPathListOpen, setIsPathListOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState<IPath | null>(null);
  const [paths, setPaths] = useState([] as IPath[]);

  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    pathsService.getAll().then(paths => setPaths(paths)).catch(() => console.log("Failed to fetch paths"));
  }, []);

  return (
    <div id="container">
      {isPathListOpen &&
        <PathListSideBar close={() => setIsPathListOpen(false)} selectedPath={selectedPath} setSelectedPath={setSelectedPath} paths={paths} setPaths={setPaths} />
      }
      <div id="map-component">
        <MapComponent mapRef={mapRef} setDistance={setDistance} selectedPath={selectedPath} />
        <Distance distance={distance} />
        <Buttons mapRef={mapRef} selectedPath={selectedPath} setSelectedPath={setSelectedPath} isPathListOpen={isPathListOpen} setIsPathListOpen={setIsPathListOpen} paths={paths} setPaths={setPaths} setDistance={setDistance} />
      </div>
    </div>
  );
};

export default App;
