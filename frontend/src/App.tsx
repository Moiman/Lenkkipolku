import { useState } from "react";
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl/maplibre';
import type { LineLayer } from 'react-map-gl';
import type { FeatureCollection } from 'geojson';
import 'maplibre-gl/dist/maplibre-gl.css';


const geojson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: { type: 'LineString', coordinates: [[23.7685, 61.4661], [23.7785, 61.4661]] } }
  ]
};

const layerStyle: LineLayer = {
  id: 'point',
  type: 'line',
};

const App = () => {
  const [viewState, setViewState] = useState({
    longitude: 23.7685,
    latitude: 61.4661,
    zoom: 11,
  });

  return (
    <Map
      {...viewState}
      onMove={e => setViewState(e.viewState)}
      maxBounds={[[23.446809, 61.332591], [24.090196, 61.599578]]}
      minZoom={8}
      // maxZoom={14}
      style={{
        width: 800, height: 600
      }}
      mapStyle="http://localhost:8081/style.json"
    >
      <NavigationControl />
      <Marker longitude={23.7685} latitude={61.4661} color="red" />
      <Source id="my-data" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
      </Source>    </Map>
  );
};

export default App;
