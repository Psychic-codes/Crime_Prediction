import React, { useState, useEffect } from 'react';
import { FaMapMarkedAlt, FaExchangeAlt } from 'react-icons/fa';
import axios from 'axios';

// We'll use react-simple-maps for choropleth visualization
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { Tooltip } from "react-tooltip";


// URL to LA GeoJSON with area boundaries
const geoUrl = "/la_areas.geojson";

// API URL configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CrimeMap = ({ searchParams, crimeData }) => {
  const [geoData, setGeoData] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [mapIndex, setMapIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [mapData, setMapData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch the map data from the backend
  useEffect(() => {
    if (!searchParams) return;
    
    const fetchMapData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await axios.post(`${API_URL}/geo_predict`, searchParams, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data && response.data.geo_data) {
          setMapData(response.data.geo_data);
        } else {
          setError("No map data received from server");
        }
      } catch (err) {
        console.error("Error fetching map data:", err);
        setError(`Failed to load map data: ${err.message || "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMapData();
  }, [searchParams]);

  // Color scale for areas based on prediction category
  const colorScale = scaleQuantize()
    .domain([0, 2]) // 0: Unsafe, 1: Safe, 2: Neutral 
    .range([
      "#ef4444", // red for unsafe
      "#22c55e", // green for safe
      "#f59e0b"  // amber for neutral
    ]);

  // Function to map prediction labels to numeric values for color scaling
  const getPredictionValue = (prediction) => {
    if (!prediction) return 1;
    if (prediction.includes("Safe")) return 1;
    if (prediction.includes("Unsafe")) return 0;
    return 2; // Neutral
  };

  // Function to flip between maps if we have multiple
  const flipMap = () => {
    setMapIndex((prevIndex) => (prevIndex + 1) % (mapData.length || 1));
  };

  // Prepare tooltip content
  const getTooltipContent = (geo) => {
    if (!mapData || mapData.length === 0 || !mapData[mapIndex]) return "";
    
    const areaData = mapData[mapIndex].areas.find(
      area => area.area_name === geo.properties.name
    );
    
    if (!areaData) return geo.properties.name || "Unknown Area";
    
    return `
      <div>
        <strong>${areaData.area_name}</strong><br />
        Status: ${areaData.prediction || "Unknown"}<br />
        ${areaData.crime_count !== undefined ? `Crime Count: ${areaData.crime_count}` : ""}
      </div>
    `;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FaMapMarkedAlt className="text-blue-600 text-2xl mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">
            Crime Risk Map {mapData.length > 0 && mapData[mapIndex].title ? `- ${mapData[mapIndex].title}` : ''}
          </h3>
        </div>
        
        {mapData.length > 1 && (
          <button 
            onClick={flipMap}
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            <FaExchangeAlt /> Switch Map View
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        {isLoading ? (
          <div className="w-full h-96 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="w-full h-96 flex justify-center items-center">
            <div className="text-red-500 text-center">
              <p className="text-lg font-semibold">Unable to load map data</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : mapData.length === 0 ? (
          <div className="w-full h-96 flex flex-col justify-center items-center">
            <FaMapMarkedAlt className="text-gray-400 text-5xl mb-4" />
            <p className="text-gray-500 text-lg">No map data available. Try adjusting your search parameters.</p>
          </div>
        ) : (
          <div className="relative" data-tip="">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 45000,
                center: [-118.243683, 34.052235] // LA coordinates
              }}
              style={{ width: "100%", height: "500px" }}
              data-tip=""
            >
              <ZoomableGroup zoom={1}>
                {mapData[mapIndex] && (
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map(geo => {
                        const areaData = mapData[mapIndex].areas.find(
                          area => area.area_name === geo.properties.name
                        );
                        
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => {
                              setTooltipContent(getTooltipContent(geo));
                              setShowTooltip(true);
                            }}
                            onMouseLeave={() => {
                              setTooltipContent("");
                              setShowTooltip(false);
                            }}
                            style={{
                              default: {
                                fill: areaData 
                                  ? colorScale(getPredictionValue(areaData.prediction))
                                  : "#D6D6DA",
                                outline: "none"
                              },
                              hover: {
                                fill: "#A9A9A9",
                                outline: "none"
                              },
                              pressed: {
                                fill: "#E42",
                                outline: "none"
                              }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                )}
              </ZoomableGroup>
            </ComposableMap>
            
            {showTooltip && tooltipContent && (
              <ReactTooltip>
                {tooltipContent}
              </ReactTooltip>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 bg-blue-50 p-4 rounded-lg text-sm">
        <p className="font-semibold">Map Legend:</p>
        <div className="flex items-center mt-2 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-sm mr-1"></div>
            <span>Unsafe / High Crime</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-sm mr-1"></div>
            <span>Safe / Low Crime</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-500 rounded-sm mr-1"></div>
            <span>Neutral / Medium Crime</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;