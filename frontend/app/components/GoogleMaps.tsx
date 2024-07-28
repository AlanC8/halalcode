"use client";


import { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { io, Socket } from "socket.io-client";


// Map's styling
const defaultMapContainerStyle = {
  width: "100%",
  height: "100vh",
  borderRadius: "15px 0px 0px 15px",
};


// Default center coordinates
const defaultMapCenter = {
  lat: 24.470901,
  lng: 39.612236,
};


// Default zoom level, can be adjusted
const defaultMapZoom = 18;


interface User {
  id: string;
  username: string;
  location?: {
    lat: number;
    lng: number;
  };
}


const MapComponent = () => {
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapTypeId, setMapTypeId] = useState<google.maps.MapTypeId>(
    google.maps.MapTypeId.SATELLITE
  );
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userLocations, setUserLocations] = useState<User[]>([]);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [myLocation, setMyLocation] =
    useState<google.maps.LatLngLiteral | null>(null);


  useEffect(() => {
    const newSocket = io("http://localhost:6161");
    setSocket(newSocket);


    newSocket.on("update_users", (users: User[]) => {
      setUserLocations(users);
    });


    return () => {
      newSocket.close();
    };
  }, []);


  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    const uname = prompt("Enter your username");
    if (uname) {
      setUsername(uname);
    }
  }, []);


  useEffect(() => {
    if (socket && navigator.geolocation && username) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMyLocation(location);
        socket.emit("user_location", { location, username });
      });
    }
  }, [socket]);


  const fetchPlaces = useCallback((map: google.maps.Map) => {
    const service = new google.maps.places.PlacesService(map);


    const request: google.maps.places.PlaceSearchRequest = {
      location: defaultMapCenter,
      radius: 500,
      type: "pharmacy", // Start with one type
    };


    const types = ["pharmacy", "store", "cafe"];
    const newMarkers: any[] = [];


    types.forEach((type) => {
      request.type = type as any;
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          results.forEach((place) => {
            let icon;


            if (type === "pharmacy") {
              icon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
            } else if (type === "store") {
              icon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
            } else if (type === "cafe") {
              icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
            }


            newMarkers.push({
              position: place.geometry?.location,
              icon,
              place,
            });
          });
        } else {
          console.error(`Places Service Status for ${type}:`, status);
        }


        // Set markers after all types are processed
        if (type === types[types.length - 1]) {
          setMarkers(newMarkers);
        }
      });
    });
  }, []);


  const handleMarkerClick = (place: any) => {
    setSelectedPlace(place);
    setDirections(null); // Clear previous directions


    if (myLocation) {
      const directionsService = new google.maps.DirectionsService();
      const request: google.maps.DirectionsRequest = {
        origin: myLocation,
        destination: place.geometry.location,
        travelMode: google.maps.TravelMode.WALKING,
      };


      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`Directions request failed due to ${status}`);
        }
      });
    }
  };


  const handleMapLoad = (map: google.maps.Map) => {
    fetchPlaces(map);
  };


  const handleMapTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMapTypeId(event.target.value as google.maps.MapTypeId);
  };


  const handleLegendClick = (type: string) => {
    setDirections(null); // Clear previous directions


    if (type === "userLocation") {
      if (myLocation) {
        setSelectedPlace({
          name: "You are here",
          vicinity: `Lat: ${myLocation.lat}, Lng: ${myLocation.lng}`,
          geometry: { location: myLocation },
        });
      }
      return;
    }


    if (!myLocation) return;


    const placesOfType = markers.filter((marker) =>
      marker.place.types.includes(type)
    );
    if (placesOfType.length === 0) return;


    let nearestPlace = placesOfType[0];
    let minDistance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(myLocation.lat, myLocation.lng),
      nearestPlace.position
    );


    placesOfType.forEach((place) => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(myLocation.lat, myLocation.lng),
        place.position
      );


      if (distance < minDistance) {
        nearestPlace = place;
        minDistance = distance;
      }
    });


    handleMarkerClick(nearestPlace.place);
  };


  return (
    <div className="w-full relative">
      
      <div className="absolute top-0 right-0 p-4 bg-white z-10 rounded-md shadow-md">
        <h4 className="font-bold">Legend</h4>
        <ul>
          <li
            onClick={() => handleLegendClick("pharmacy")}
            className="cursor-pointer"
          >
            <img
              src="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
              width={24}
              alt="Pharmacy"
              className="inline-block mr-2"
            />{" "}
            Pharmacy
          </li>
          <li
            onClick={() => handleLegendClick("store")}
            className="cursor-pointer"
          >
            <img
              src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
              width={24}
              alt="Store"
              className="inline-block mr-2"
            />{" "}
            Store
          </li>
          <li
            onClick={() => handleLegendClick("cafe")}
            className="cursor-pointer"
          >
            <img
              src="http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
              width={24}
              alt="Cafe"
              className="inline-block mr-2"
            />{" "}
            Cafe
          </li>
          <li
            onClick={() => handleLegendClick("userLocation")}
            className="cursor-pointer"
          >
            <img
              src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              width={24}
              alt="User Location"
              className="inline-block mr-2"
            />{" "}
            Your Location
          </li>
        </ul>
      </div>
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={myLocation || defaultMapCenter}
        zoom={defaultMapZoom}
        options={{
          mapTypeId,
          zoomControl: true,
          tilt: 0,
          gestureHandling: "auto",
        }}
        onLoad={handleMapLoad}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={marker.icon}
            onClick={() => handleMarkerClick(marker.place)}
          />
        ))}
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.geometry?.location}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div>
              <h2>{selectedPlace.name}</h2>
              <p>{selectedPlace.vicinity}</p>
            </div>
          </InfoWindow>
        )}
        {myLocation && (
          <Marker
            position={myLocation}
            icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
            onClick={() => {
              setSelectedPlace({
                name: "You are here",
                vicinity: `Lat: ${myLocation.lat}, Lng: ${myLocation.lng}`,
                geometry: { location: myLocation },
              });
              setDirections(null); // Clear previous directions
            }}
          />
        )}
        {userLocations.map((user) => (
          <Marker
            key={user.id}
            position={user.location!}
            icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
            onClick={() => {
              setSelectedPlace({
                name: user.username,
                vicinity: `Lat: ${user.location!.lat}, Lng: ${
                  user.location!.lng
                }`,
                geometry: { location: user.location },
              });
              setDirections(null); // Clear previous directions
            }}
          />
        ))}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};


export { MapComponent };





