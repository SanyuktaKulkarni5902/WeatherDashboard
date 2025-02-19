import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import "./Slider.css";
import { img1, img2, img3, img4, img5 } from "./images";
import cities from "./cityArray";

const apiKey = process.env.REACT_APP_API_KEY;
const WEATHERAPIBASEURL = process.env.REACT_OPEN_WEATHER_URL;

const Slider = ({ mode }) => {
  const [cityDetails, setCityDetails] = useState({});

  useEffect(() => {
    const fetchWeatherData = async () => {
      const fetchedData = {};

      for (const city of cities) {
        
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        fetchedData[city.name] = {
          temperature: data.main.temp,
          wind: data.wind,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          icon: data.weather.icon,
          details: data.weather[0].description,
        };
      }

      setCityDetails(fetchedData);
    };

    fetchWeatherData();
  }, []);

  const weatherImageMap = {
    clear: img1,
    cloud: img2,
    haze: img3,
    rain: img4,
    smoke: img5,
  };

  return (
    <div className="slider-container">
      <Carousel
        data-bs-theme="dark"
        controls={false}
        interval={1950}
        pause="hover"
      >
        {cities.map((city, index) => {
          const weatherCondition = cityDetails[city.name]?.details || "clear";

          const imgSrc = weatherImageMap[weatherCondition] || img1;

          return (
            <Carousel.Item key={index} className="carousel">
              <div
                className={mode === "light" ? "slider-light" : "slider-dark"}
              >
                <div className="top">
                  <i
                    id={
                      mode === "light"
                        ? "location-icon-light"
                        : "location-icon-dark"
                    }
                    className="fa-solid fa-location-dot"
                  ></i>
                  <h5>{city.name}</h5>
                </div>

                <div className="mid">
                  <div className="icon">
                    <img src={imgSrc} alt="weather-icon" />
                  </div>
                  <div className="details">
                    <h1>{cityDetails[city.name]?.temperature}°C</h1>
                    <h5>{weatherCondition}</h5>
                  </div>
                </div>

                <div className="last">
                  <p>
                    Wind<br></br> {cityDetails[city.name]?.wind?.speed} m/s
                  </p>
                  <p>
                    Humidity<br></br> {cityDetails[city.name]?.humidity}%
                  </p>
                  <p>
                    Pressure<br></br> {cityDetails[city.name]?.pressure} mb
                  </p>
                </div>
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Slider;
