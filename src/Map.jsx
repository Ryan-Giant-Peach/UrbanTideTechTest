import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Slider from "@mui/material/Slider";
import axios from "axios";
import Map, {
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Source,
  Layer,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { heatmapLayer } from "./map-style";
const MAPBOX_TOKEN = `pk.eyJ1IjoibWFya2F0Z2luZ2VybGFuZCIsImEiOiJjbDF5enNzZWUwaHF3M2pscGR5bjdvMHl0In0.I-sbaJJwi_qdVX0hBFNuyg`;

const geoJsonTemplate = {
  type: "FeatureCollection",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
  features: [
    {
      type: "Feature",
      properties: {
        id: "ak16994521",
        mag: 2.3,
        time: 1507425650893,
        felt: null,
        tsunami: 0,
      },
      geometry: { type: "Point", coordinates: [-151.5129, 63.1016, 0.0] },
    },
    {
      type: "Feature",
      properties: {
        id: "ak16994519",
        mag: 1.7,
        time: 1507425289659,
        felt: null,
        tsunami: 0,
      },
      geometry: { type: "Point", coordinates: [-150.4048, 63.1224, 105.5] },
    },
  ],
};

const MapComponent = () => {
  const [selectedTime, setSelectedTime] = useState(0);
  const [geoJson, setGeoJson] = useState(geoJsonTemplate);

  useEffect(() => {
    const timeRange = `2018-12-${selectedTime}T00:00:00`;
    const dt = encodeURIComponent(timeRange);
    const API_URL = `https://api.usmart.io/org/d1b773fa-d2bd-4830-b399-ecfd18e832f3/02444e7a-5bd4-4ef3-9c66-e26671bb4c8a/latest/urql?limit(50,0)&sort(-ISODateTime)&match(ISODateTime,${dt})`;

    // Get pedestrian and cyclist data from API and set it
    axios.get(API_URL).then((results) => {
      const features = results.data.map((result) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [result.Longitude, result.Latitude, 0.0],
          },
        };
      });
      setGeoJson({ ...geoJsonTemplate, features });
    });
  }, [selectedTime]);

  const [viewport] = useState({
    latitude: 55.8642,
    longitude: -4.2518,
    zoom: 8,
    bearing: 0,
    pitch: 0,
    width: "100%",
    height: "100%",
  });

  const handleChange = (e) => {
    setSelectedTime(e.target.value);
  };
  if (!geoJson) return <div>Loading...</div>;

  return (
    <Box sx={{ width: "100%", height: "100%", display: 'flex', flexDirection: 'column' }}>

      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />
        <Source type="geojson" data={geoJson}>
          <Layer {...heatmapLayer} />
        </Source>
      </Map>
      <Slider
        aria-label="Choose the day of month"
        defaultValue={12}
        step={1}
        marks
        min={0}
        max={31}
        valueLabelDisplay="auto"
        onChange={handleChange}
      />
    </Box>
  );
};

export default MapComponent;
