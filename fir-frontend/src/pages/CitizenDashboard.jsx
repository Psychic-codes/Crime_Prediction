import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch, FaMapMarkedAlt, FaSpinner } from "react-icons/fa";
import CrimeMap from "../components/CrimeMap"; 

// Backend API URL configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [graphImages, setGraphImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [summary, setSummary] = useState(null);

  // Search parameters state
  const [searchParams, setSearchParams] = useState({
    month: new Date().getMonth() + 1, // Current month
    crime_category: 'All',
    area_name: 'All',
    vict_sex: 'All'
  });

  // Month mapping
  const months = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
    7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
  };
  
  // Areas and crime categories
  const areas = ['All', 'Wilshire', 'Central', 'Southwest', 'Van Nuys', 'Hollenbeck',
    'Rampart', 'Newton', 'Northeast', '77th Street', 'Hollywood',
    'Harbor', 'West Valley', 'West LA', 'N Hollywood', 'Pacific',
    'Devonshire', 'Mission', 'Southeast', 'Olympic', 'Foothill', 'Topanga'];
    
  const crimeCategories = ['All', 'Property Crime', 'Violent Crime', 'Sex Crime', 'Other',
    'Fraud/Financial Crime', 'Legal/Administrative', 'Cyber Crime',
    'Child Crime', 'Traffic Offense'];
    
  const victimSexes = ['All', 'M', 'F', 'Other'];

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "CITIZEN" && process.env.NODE_ENV !== "development") {
      navigate("/login"); // Redirect to login if not a citizen (except in dev mode)
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };
  
  // Add the missing getRiskCounts function
  const getRiskCounts = () => {
    if (!predictionData || predictionData.length === 0) return {};
    
    const counts = {};
    predictionData.forEach(item => {
      if (item.prediction) {
        counts[item.prediction] = (counts[item.prediction] || 0) + 1;
      }
    });
    
    return counts;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("Sending request with params:", searchParams);
      
      // Send as JSON (preferred method)
      const response = await axios.post(`${API_URL}/predict`, searchParams, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Received response:", response.data);
      
      // Extract data from the response
      if (response.data) {
        if (response.data.plot_images && response.data.plot_images.length > 0) {
          setGraphImages(response.data.plot_images);
          setSearchPerformed(true);
        } else {
          setGraphImages([]);
          console.warn("No plot images in response");
        }
        
        if (response.data.prediction_data) {
          setPredictionData(response.data.prediction_data);
        } else {
          setPredictionData(null);
          console.warn("No prediction data in response");
        }
        
        if (response.data.summary) {
          setSummary(response.data.summary);
        } else {
          setSummary(null);
        }
        
        if (!response.data.plot_images && !response.data.prediction_data) {
          setError("No data available for the selected criteria");
        }
      } else {
        setGraphImages([]);
        setPredictionData(null);
        setSummary(null);
        setError("No data available from server");
      }
    } catch (err) {
      console.error("Error fetching prediction data:", err);
      setError(`Failed to load crime prediction data: ${err.message || "Unknown error"}`);
      setGraphImages([]);
      setPredictionData(null);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">🚔 Citizen Dashboard</h1>
        <div>
          <button
            className="bg-white text-blue-600 px-5 py-2 rounded-lg mx-2 font-semibold transition-transform transform hover:scale-105 hover:bg-gray-100"
            onClick={() => navigate("/citizen/file-fir")}
          >
            📄 File an FIR
          </button>
          <button
            className="bg-white text-blue-600 px-5 py-2 rounded-lg mx-2 font-semibold transition-transform transform hover:scale-105 hover:bg-gray-100"
            onClick={() => navigate("/citizen/filed-firs")}
          >
            📊 Check Your FIRs
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Crime Safety Search</h2>
          
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    name="month"
                    value={searchParams.month}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {Object.entries(months).map(([value, name]) => (
                      <option key={value} value={value}>{name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crime Category</label>
                  <select
                    name="crime_category"
                    value={searchParams.crime_category}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {crimeCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                  <select
                    name="area_name"
                    value={searchParams.area_name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {areas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Victim Gender</label>
                  <select
                    name="vict_sex"
                    value={searchParams.vict_sex}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {victimSexes.map(sex => (
                      <option key={sex} value={sex}>{sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Searching...
                    </>
                  ) : (
                    <>
                      <FaSearch /> Search Crime Safety Data
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Results Section */}
        {searchPerformed && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Crime Safety Results for {months[searchParams.month]}
              {searchParams.area_name !== 'All' ? ` in ${searchParams.area_name}` : ''}
            </h2>
            
            {loading ? (
              <div className="w-full bg-white rounded-lg shadow-md p-6 flex flex-col justify-center items-center h-64">
                <FaSpinner className="text-blue-600 text-3xl animate-spin mb-4" />
                <div className="text-blue-600 text-xl">Loading crime analytics...</div>
              </div>
            ) : error ? (
              <div className="w-full bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
                <div className="text-red-600 text-xl">{error}</div>
              </div>
            ) : (
              <>
                {/* Risk Summary Cards */}
                {predictionData && predictionData.length > 0 && (
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(getRiskCounts()).map(([risk, count]) => (
                      <div 
                        key={risk} 
                        className={`p-4 rounded-lg shadow-md text-center ${
                          risk.includes('Safe') ? 'bg-green-50 border border-green-200' :
                          risk.includes('Unsafe') ? 'bg-red-50 border border-red-200' :
                          'bg-yellow-50 border border-yellow-200'
                        }`}
                      >
                        <h3 className="text-lg font-semibold mb-2">{risk}</h3>
                        <p className="text-3xl font-bold">
                          {count} 
                          <span className="text-sm font-normal ml-1">
                            ({Math.round(count / predictionData.length * 100)}%)
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Visualization graphs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {graphImages && graphImages.length > 0 ? (
                    graphImages.map((image, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        <img 
                          src={`data:image/png;base64,${image}`} 
                          alt={`Crime analytics chart ${index + 1}`} 
                          className="w-full h-auto" 
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 bg-white rounded-lg shadow-md p-6 text-center">
                      <p className="text-gray-700 text-xl">No crime analytics data available for the selected criteria.</p>
                      <p className="text-gray-500 mt-2">Try adjusting your search parameters.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Map Section - Replace the placeholder with the CrimeMap component */}
        <div className="mt-8">
          <CrimeMap searchParams={searchParams} crimeData={predictionData} />
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;