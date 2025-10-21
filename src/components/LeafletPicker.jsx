import React, {useState} from "react";
import {MapContainer, TileLayer, Marker, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationMarker({onSelect}) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const coords = e.latlng;
      setPosition(coords);
      onSelect(coords);
    },
  });

  return position ? <Marker position={position} /> : null;
}

const LeafletPicker = ({onLocationSelect}) => {
  return (
    <div
      style={{
        height: "300px",
        marginTop: "1rem",
        borderRadius: "8px",
        overflow: "hidden",
      }}>
      <MapContainer
        center={[6.465, 3.406]}
        zoom={13}
        style={{height: "100%", width: "100%"}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={onLocationSelect} />
      </MapContainer>
    </div>
  );
};

export default LeafletPicker;
