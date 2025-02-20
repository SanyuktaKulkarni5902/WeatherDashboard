//importing necsessary modules and components
import React, { useState, useEffect, useRef } from "react";
import "./CityList.css";
import Spinner from "react-bootstrap/Spinner";
import { cleanCityName } from "../../utils";

//API key and URL
const API_KEY = process.env.REACT_APP_API_KEY;
const CITIES_API_URL = process.env.REACT_APP_API_URL;
const WEATHER_BASE_URL = process.env.REACT_APP_OPENWEATHER_API_URL;

//CityList component
const CityList = ({ setSelectedCity, mode }) => {
  //using states
  const [weatherData, setWeatherData] = useState([]); //for storing weather data
  const [searchTerm, setSearchTerm] = useState(""); //for storing search term
  const citiesPerPage = 10; //for storing number of cities per page

  const [loadedCities, setLoadedCities] = useState(citiesPerPage); //for storing number of loaded cities
  const [cities, setCities] = useState([]); //for storing city names
  const [filteredCities, setFilteredCities] = useState([]); //for storing filtered city names
  const [loading, setLoading] = useState(false); //for storing loading status
  const [noMatches, setNoMatches] = useState(false); //for storing no matches status

  // fetching city names from city names url and storing in cities state ----------------------------------------------------------------
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(CITIES_API_URL);
        const data = await response.json();

        // Check if the response contains the expected data structure(this is done to avoid any errors because the response was not proper)
        if (data && !data.error && Array.isArray(data.data)) {
          // Filter cities to include only those in India and remove any special characters for better search results
          const indianCities = data.data
            .filter((city) => city.country === "India") // Access the country property
            .map((city) => city.city)
            .map((city) => {
              let cleanedcity = cleanCityName(city);
              return cleanedcity;
            }); // Clean city names

          setCities(indianCities); // Store indian city names
        } else {
          console.error("Unexpected data structure in response:", data); //if the response is not proper , it will show this error
        }
      } catch (error) {
        console.error("Error fetching city names:", error);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (filteredCities.length > 0) {
        try {
          const results = [...weatherData]; // Keep previously fetched data

          for (let city of filteredCities.slice(0, loadedCities)) {
            //looping through the filtered cities

            const response = await fetch(
              `${WEATHER_BASE_URL}${city},IN&units=metric&appid=${API_KEY}`
            );

            if (response.ok) {
              const data = await response.json(); //fetching the data
              if (
                data.main &&
                typeof data.main.temp_min === "number" &&
                typeof data.main.temp_max === "number"
              ) {
                results.push(data);
              }
            } else {
              console.warn(`City not found: ${city}`);
            }
          }

          setWeatherData(results);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    };

    fetchWeatherData();
  }, [filteredCities, loadedCities]);

  //filtering the cities based on the search term -----------------------------------------------------------------
  useEffect(() => {
    if (searchTerm.length >= 2) {
      //if the search term length is greater than or equal to 2
      const newFilteredCities = cities.filter(
        (city) => city.toLowerCase().startsWith(searchTerm.toLowerCase()) // Filter cities based on search term
      );
      setFilteredCities(newFilteredCities); // Show filtered list when search term is entered
    } else {
      setFilteredCities(cities.slice(0, loadedCities)); // Show all cities when search term is empty but only loaded cities
    }
  }, [searchTerm, cities, loadedCities]); //refetch when search term or loaded cities changes

  //function to load more cities --------------------------------------------------------------------------------
  const loadMoreCities = () => {
    setLoading(true); // Show loading spinner
    setTimeout(() => {
      setLoadedCities((prev) => Math.min(prev + citiesPerPage, cities.length)); // Load more cities takes minimum of the two values
      setLoading(false);
    }, 1000);
  };

  //displaying the cities -----------------------------------------------------------------------------------------
  const displayedCities = filteredCities // Display only cities with valid weather data
    .map((city) => {
      const weather = weatherData.find(
        // Find weather data for the city
        (w) => w.name.toLowerCase() === city.toLowerCase() //find the weather data for the specific city using find to match the city name
      );

      if (
        weather &&
        weather.main &&
        typeof weather.main.temp_min === "number" && //extra check to make sure the data is valid
        typeof weather.main.temp_max === "number"
      ) {
        return weather; // Return weather data if it exists and has valid temperatures
      } else {
        return null; // Return null if weather data is missing or has invalid temperatures
      }
    })
    .filter((city) => city !== null); // Filter out cities which do not have null objects in the array

  //function to handle search input change ----------------------------------------------------------------------
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z]*$/.test(value)) {
      //only letters are allowed
      setSearchTerm(value); //set the search term
    }
  };

  //for displaying the list on top------------------------------------------------------------------------
  const tableRef = useRef(null); // Reference to the table element

  useEffect(() => {
    // Scroll to the bottom of the table when new cities are loaded
    if (tableRef.current) {
      // Check if the table element exists
      tableRef.current.scrollTop = tableRef.current.scrollHeight; // Scroll to the bottom of the table
    }
  }, [displayedCities]);

  //alert if no matches found------------------------------------------------------------------------------------
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm && filteredCities.length === 0) {
        // Check if search term is entered and no matches are found
        setNoMatches(true); // Show no matches alert
      } else {
        setNoMatches(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, filteredCities]);

  return (
    <div className="citylist-container">
      {
        //loading spinner
        loading && (
          <Spinner
            className={
              mode === "light" ? "loader-icon-light" : "loader-icon-dark"
            }
            animation="border"
            role="status"
          ></Spinner>
        )
      }

      <input
        //search bar
        type="text"
        className={mode === "light" ? "search-bar-light" : "search-bar-dark"}
        placeholder="Search city..."
        value={searchTerm}
        pattern="[A-Za-z]*"
        title="Only letters are allowed"
       
        onChange={handleSearchInputChange}
      />

      {/* //table to display the cities} */}
      <div className="table-container">
        <div style={{ maxHeight: "400px", overflowY: "auto" }} ref={tableRef}>
          {noMatches ? (
            <p>
              <b style={{ color: "#24609C" }}>Matches Not Found</b>
            </p>
          ) : (
            <table
              className={mode === "light" ? "table-ct-light" : "table-ct-dark"}
            >
              <thead>
                <tr>
                  <th
                    className={
                      mode === "light" ? "table-head-light" : "table-head-dark"
                    }
                  >
                    City
                  </th>
                  <th
                    className={
                      mode === "light" ? "table-head-light" : "table-head-dark"
                    }
                  >
                    Min Temp (&deg;C)
                  </th>
                  <th
                    className={
                      mode === "light" ? "table-head-light" : "table-head-dark"
                    }
                  >
                    Max Temp (&deg;C)
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* {noMatches && <p className="tbody-ptag">No matches found!</p>} */}

                {displayedCities.map((city, index) => (
                  <tr
                    className={
                      mode === "light" ? "table-data-light" : "table-data-dark"
                    }
                    key={index}
                  >
                    <td>
                      <button
                        className={
                          mode === "light"
                            ? "btn-cityname-light"
                            : "btn-cityname-dark"
                        }
                        onClick={() => setSelectedCity(city.name)}
                      >
                        {city.name}
                      </button>
                    </td>
                    <td>{city.main?.temp_min || "N/A"}</td>
                    <td>{city.main?.temp_max || "N/A"}</td>
                    {/* //no matches found alert */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {loadedCities <= filteredCities.length && (
        <div
          className={
            mode === "light"
              ? "load-more-container-light"
              : "load-more-container-dark"
          }
          disabled={loading}
        >
          <button className="btn" onClick={loadMoreCities}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default CityList;
