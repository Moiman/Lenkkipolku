import { useState } from "react";
import type { FeatureCollection, Point, LineString } from "geojson";
import MapComponent from "./map/MapComponent";
import Distance from "./Distance";
import Buttons from "./Buttons";
import "./App.css";


export const geojson: FeatureCollection<Point | LineString> = {
  type: "FeatureCollection",
  features: []
};

const App = () => {
  const [distance, setDistance] = useState(0);

  return (
    <>
      <MapComponent setDistance={setDistance} />
      <Distance distance={distance} />
      <Buttons />
    </>
  );
};

export default App;
