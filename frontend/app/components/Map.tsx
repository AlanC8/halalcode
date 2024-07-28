"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import io from "socket.io-client";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3Zuc3RyIiwiYSI6ImNsejRhYWlybzNmYzAyanNnaDE3M2Y4dWwifQ.hf3t4OZroN0X-diHRZHzew";

const socket = io("http://localhost:6161");

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState<number>(76.889709);
  const [lat, setLat] = useState<number>(43.238949);
  const [zoom, setZoom] = useState<number>(12); // Уровень масштаба
  const [userLocation, setUserLocation] = useState<{ lng: number; lat: number } | null>(null);
  const [usersLocations, setUsersLocations] = useState<{ [key: string]: { lng: number; lat: number } }>({});

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lng: longitude, lat: latitude });
        socket.emit("locationUpdate", { lng: longitude, lat: latitude });
      });
    }
    socket.on("connect", () => {
        console.log("Connected to server");
        
    })
    socket.on("usersLocations", (locations) => {
      setUsersLocations(locations);
    });

    if (mapContainerRef.current) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: zoom,
      });

      mapRef.current = map;

      map.on("move", () => {
        setLng(Number(map.getCenter().lng.toFixed(4)));
        setLat(Number(map.getCenter().lat.toFixed(4)));
        setZoom(Number(map.getZoom().toFixed(2)));
      });

      return () => map.remove();
    }
  }, [lng, lat, zoom]);

  useEffect(() => {
    if (mapRef.current) {
      const userMarkers: { [key: string]: mapboxgl.Marker } = {};

      Object.keys(usersLocations).forEach((id) => {
        if (userMarkers[id]) {
          userMarkers[id].setLngLat([usersLocations[id].lng, usersLocations[id].lat]);
        } else {
          userMarkers[id] = new mapboxgl.Marker({ color: id === socket.id ? "blue" : "red" })
            .setLngLat([usersLocations[id].lng, usersLocations[id].lat])
            .addTo(mapRef.current!);
        }
      });

      return () => {
        Object.values(userMarkers).forEach((marker) => marker.remove());
      };
    }
  }, [usersLocations]);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 bg-black bg-opacity-80 p-2 rounded-lg shadow-md z-10">
        Долгота: {lng} | Широта: {lat} | Масштаб: {zoom}
      </div>
      <div ref={mapContainerRef} className="absolute top-0 bottom-0 w-full h-full" />
    </div>
  );
};

export default Map;
