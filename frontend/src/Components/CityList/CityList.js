import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './CityList.css'
import Spinner from 'react-bootstrap/Spinner';



const API_KEY = process.env.REACT_APP_API_KEY;
const CITIES_API_URL = process.env.REACT_APP_API_URL; 

const CityList = ({ setSelectedCity,mode}) => {
  const [weatherData, setWeatherData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [citiesPerPage] = useState(10);
  const [loadedCities, setLoadedCities] = useState(citiesPerPage);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(false);
  
  

  useEffect(() => {
    const fetchCities = async () => {
      try {
          const response = await fetch(CITIES_API_URL);
          const data = await response.json();
 
          // Check if the response contains the expected data structure
          if (data && !data.error && Array.isArray(data.data)) {
              // Filter cities to include only those in India
              const indianCities = data.data
              .filter(city => city.country === "India") // Access the country property
              .map(city => city.city)
              .map(city=>city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s*\(.*?\)\s*/g, '') ); // Access the city name property
              setCities(indianCities); // Store the filtered city names
          } else {
            console.error("Unexpected data structure:", data);
          }
         
       
 
        } catch (error) {
        console.error("Error fetching city names:", error);
        }
    };
 
    fetchCities();
}, []);
//console.log("cities",cities);
 

 
  console.log("weather data",weatherData);
 
 
useEffect(() => {
  const fetchWeatherData = async () => {
    if (filteredCities.length > 0) {
      try {
        const results = [...weatherData]; // Keep previously fetched data
        let fetchedCities = results.map(w => w.name.toLowerCase());
       
        for (let city of filteredCities.slice(0, loadedCities)) {
          if (!fetchedCities.includes(city.toLowerCase())) {
            const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${API_KEY}`
            );
            if (response.ok) {
              const data = await response.json();
              if(data.main && typeof data.main.temp_min === 'number' && typeof data.main.temp_max === 'number'){
              results.push(data);
            }
            } else {
              console.warn(`City not found: ${city}`);
            }
          }
        }
 
        setWeatherData(results);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    }
  };
 
  fetchWeatherData();
}, [filteredCities, loadedCities]); // Re-fetch on search or load more
 
 
useEffect(() => {
  const fetchWeatherData = async () => {
      if (filteredCities.length > 0) {
          try {
              let results = [...weatherData]; // Keep previous weather data
let fetchedCities = results.map(w => w.name.toLowerCase());
              let newWeatherData = []; // Store only valid weather data
              let index = 0; // Start from the first filtered city
 
              while (newWeatherData.length < citiesPerPage && index < filteredCities.length) {
                  let city = filteredCities[index];
 
                  if (!fetchedCities.includes(city.toLowerCase())) {
                      const response = await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${API_KEY}`
                      );
 
                      if (response.ok) {
                          const data = await response.json();
                          newWeatherData.push(data); // Store only valid data
                      } else {
                          console.warn(`City not found: ${city}`);
                      }
                  }
 
                  index++; // Move to the next city
              }
 
              // Update state with only valid cities
              setWeatherData(prev => [...prev, ...newWeatherData]);
          } catch (error) {
              console.error("Error fetching weather data:", error);
          }
      }
  };
 
  fetchWeatherData();
}, [filteredCities, loadedCities]); // Refetch when search/filter changes
 
 

useEffect(() => {
  if (searchTerm.length >= 2) {
    const newFilteredCities = cities.filter(city =>
      city.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredCities(newFilteredCities);
  } else {
    setFilteredCities(cities.slice(0, loadedCities)); // Show initial list when no search
  }
}, [searchTerm, cities, loadedCities]);
 
 
const loadMoreCities = () => {
  setLoading(true);
  setTimeout(() => {
  
    setLoadedCities(prev => Math.min(prev + citiesPerPage, cities.length));
    setLoading(false);
  }, 1000);

    
  
  
  // Load more cities
};
 

 
const displayedCities = filteredCities.map(city => {
  const weather = weatherData.find(w => w.name.toLowerCase() === city.toLowerCase());
 
  if (weather && weather.main && typeof weather.main.temp_min === 'number' && typeof weather.main.temp_max === 'number') {
    return weather; // Return weather data if it exists and has valid temperatures
  } else {
    return null; // Return null if weather data is missing or has invalid temperatures
  }
}).filter(city => city !== null); // Filter out null values
 
const handleSearchInputChange=(e)=>{
  const value = e.target.value;
    if (/^[a-zA-Z]*$/.test(value)) {
      setSearchTerm(value);
    }

}

const tableRef = useRef(null);
useEffect(() => {
  if (tableRef.current) {
    tableRef.current.scrollTop = tableRef.current.scrollHeight;
  }
}, [displayedCities]);

useEffect(() => {
  if (searchTerm && filteredCities.length === 0) {
    alert("No matches found!");
  }
}, [searchTerm, filteredCities]);
 
return (

  
  <div className="citylist-container">
    {/* <div>
      <p>hey</p>
    </div> */}

    {loading && (
        <Spinner className={mode === "light" ? "loader-icon-light" : "loader-icon-dark"} animation="border" role="status"></Spinner>
    )}



    <input
      type="text"
      className={mode==="light"?"search-bar-light":"search-bar-dark"}
      
      placeholder="Search city..."
      value={searchTerm}
      pattern="[A-Za-z]*"
      title="Only letters are allowed"
      // onChange={(e) => setSearchTerm(e.target.value)}
      onChange={handleSearchInputChange}
    />
      <div className="table-container">
        <div style={{ maxHeight: '400px', overflowY: 'auto' }} ref={tableRef}>
        <table className={mode === "light" ? "table-ct-light" : "table-ct-dark"} > 
          <thead>
            <tr>
              <th className={mode === "light" ? "table-head-light" : "table-head-dark"}>City</th>
              <th className={mode === "light" ? "table-head-light" : "table-head-dark"}>Min Temp (&deg;C)</th>
              <th className={mode === "light" ? "table-head-light" : "table-head-dark"}>Max Temp (&deg;C)</th>
            </tr>
          </thead>
          <tbody>
                {displayedCities.map((city, index) => (
 
            
                  <tr className={mode == "light" ? "table-data-light" : "table-data-dark"} key={index}>
                   
                    <td><button className={mode === "light" ? "btn-cityname-light" : "btn-cityname-dark"} onClick={() => setSelectedCity(city.name)}>{city.name}</button></td>
                    <td>{city.main?.temp_min || "N/A"}</td>
                    <td>{city.main?.temp_max || "N/A"}</td>
                  </tr>)
                 
              )}
          </tbody>
         
        </table>
        </div> 
      </div>
 
    {loadedCities <= filteredCities.length && (
      <div className={mode === "light" ? "load-more-container-light" : "load-more-container-dark"}  disabled={loading}>
          <button className="btn" onClick={loadMoreCities}>
              Load More
          </button>
      </div>
   
    )}
 
  </div>
);
};
 
export default CityList;






