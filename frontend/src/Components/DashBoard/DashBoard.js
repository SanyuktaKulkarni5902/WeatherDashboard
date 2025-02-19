import React, { useState } from 'react';
import Slider from '../Slider/Slider.js';
import CityList from '../CityList/CityList.js';
import WikiPage from '../WikiPage/WikiPage.js';
import './DashBoard.css';
import Theme from '../Theme/Theme.js';

 
export default function DashBoard() {
 
  const [mode , setMode] = useState("light");
  const [selectedCity, setSelectedCity] = useState("Pune");
 
  return (
    
      
      <div className={mode === "light"?'main-container-light' : 'main-container-dark'}>
      <div className='toggle'>
        <Theme  setMode={setMode} mode={mode}/>
      </div>
   
      <div className={mode === "light" ? "left-half-light" : "left-half-dark"}>
        <div className='citylist-box'>
          <CityList setSelectedCity={setSelectedCity} mode= {mode} />
        </div>
      </div>
 
      <div className='right-half'>
        <div className={mode === "light" ?'slider-box-light' : 'slider-box-dark'}>
          <Slider mode={mode}/>
        </div>
        <div className={mode === "light"? 'wikipage-box-light': 'wikipage-box-dark'}>
          <WikiPage mode={mode} selectedCity={selectedCity} />
        </div>
      </div>
      
    </div>
  );
}