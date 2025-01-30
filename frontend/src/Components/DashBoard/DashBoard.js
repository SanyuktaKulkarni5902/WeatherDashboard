   
import Slider from '../Slider/Slider.js'
import CityList from '../CityList/CityList.js'
import WikiPage from '../WikiPage/WikiPage.js'
import SearchBar from '../SearchBar/SearchBar.js'
import './DashBoard.css'

export default function DashBoard() {
  return (
    <div className='main-container' >      
      <div className='slider-component' id='slider'>
        <Slider />
      </div>
      <div className='citylist-component' id='citylist'>
        <CityList />
      </div>
      <div className='wikipage-component' id='wikipage'>
        <WikiPage />
      </div>
      <div className='searchbar-component' id='searchbar'>
        <SearchBar />
      </div>
    </div>

  )
}