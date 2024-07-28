import React from "react";
import { MapProvider } from "./Map-Provider";
import { MapComponent } from "./GoogleMaps";


const Map = () => {
  return (
    <MapProvider>
      <MapComponent/>
    </MapProvider>
  );
};


export default Map;





