import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaClipboardList, FaMapMarkedAlt, FaSearch, FaChartBar, FaSpinner } from "react-icons/fa";
import axios from "axios";
import CrimeMap from "../components/CrimeMap"; 

// Backend API URL configuration
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PoliceDashboard = () => {
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
    if (role !== "POLICE") {
      navigate("/login"); // Redirect to login if not a police officer
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  // Function to get risk distribution counts
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
      
      // Send as JSON with explicit content-type header
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
      <nav className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-3xl font-bold tracking-wide">🚔 Police Dashboard</h1>
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-100 transition"
            onClick={() => navigate("/police/file-fir")}
          >
            <FaFileAlt /> File FIR
          </button>
          <button
            className="flex items-center gap-2 bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold shadow-md hover:bg-blue-100 transition"
            onClick={() => navigate("/police/filed-firs")}
          >
            <FaClipboardList /> Update FIRs
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="flex-1 p-6">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaChartBar className="text-blue-600 text-2xl mr-2" />
            <h2 className="text-2xl font-bold text-gray-800">Crime Analytics Search</h2>
          </div>
          
          {/* Advanced Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    name="month"
                    value={searchParams.month}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full rounded-md border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full rounded-md border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full rounded-md border border-gray-300 py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full md:w-auto bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-800 transition shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Generating Analytics...
                    </>
                  ) : (
                    <>
                      <FaSearch /> Generate Crime Analytics
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Select parameters to analyze crime patterns and safety predictions across different areas and crime types.</p>
            </div>
          </div>
        </div>
        
        {/* Results Section */}
        {searchPerformed && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Crime Analytics Results</h2>
              <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {months[searchParams.month]} {searchParams.area_name !== 'All' ? `| ${searchParams.area_name}` : ''} {searchParams.crime_category !== 'All' ? `| ${searchParams.crime_category}` : ''}
              </div>
            </div>
            
            {loading ? (
              <div className="w-full bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
                <FaSpinner className="text-blue-600 text-3xl animate-spin mr-4" />
                <div className="text-blue-600 text-xl">Generating crime analytics...</div>
              </div>
            ) : error ? (
              <div className="w-full bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
                <div className="text-red-600 text-xl">{error}</div>
              </div>
            ) : (
              <>
                {/* Risk Summary Cards */}
                {predictionData && predictionData.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Prediction Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-1">Total Predictions</p>
                        <p className="text-2xl font-bold text-blue-700">{predictionData.length}</p>
                      </div>
                      
                      {Object.entries(getRiskCounts()).map(([risk, count]) => (
                        <div 
                          key={risk} 
                          className={`rounded-lg p-4 ${
                            risk.includes('Safe') ? 'bg-green-50' :
                            risk.includes('Unsafe') ? 'bg-red-50' :
                            'bg-yellow-50'
                          }`}
                        >
                          <p className="text-sm text-gray-600 mb-1">{risk}</p>
                          <p className="text-2xl font-bold">
                            {count} 
                            <span className="text-sm font-normal ml-1">
                              ({Math.round(count / predictionData.length * 100)}%)
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Visualization graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <p className="text-gray-500 mt-2">Try adjusting your search parameters or contact technical support.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Map Section - Using the CrimeMap component */}
        <div className="mt-8">
          <CrimeMap searchParams={searchParams} crimeData={predictionData} />
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;