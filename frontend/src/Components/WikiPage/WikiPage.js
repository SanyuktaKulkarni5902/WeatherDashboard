import React, { useEffect, useState } from 'react';
import './WikiPage.css';
import parse from 'html-react-parser';
import { cleanCityName } from '../../utils';


 
const WikiPage = ({ selectedCity , mode} ) => {
  // Normalize city name for Wikipedia API compatibility
  const normalizedCity = cleanCityName(selectedCity);
  
   
 
  const [wikiContent, setWikiContent] = useState('');
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchWikipediaContent = async () => {
      setLoading(true);
      if (!normalizedCity) return;
 
      const apiUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${normalizedCity}&prop=text&origin=*`;
 
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.parse && data.parse.text) {
          setWikiContent(data.parse.text['*']);
        } else {
          setWikiContent('Content not found.');
        }
      } catch (error) {
        console.error('Error fetching Wikipedia content:', error);
        setWikiContent('Failed to load content.');
      }finally{
        setLoading(false);
      }
    };
 
    fetchWikipediaContent();
  }, [normalizedCity]);
 
  if(loading){
    return <div>Loading Wikipedia content...</div>;
  }
 
  return (
    <div
     
      className={mode === "light" ? "wikipage-container-light" : "wikipage-container-dark"}>
      {wikiContent ? (
        <div className="wiki-content">
          <h2>{selectedCity}</h2>
          {parse(wikiContent)}
        </div>
      ) : (
        <p>Loading Wikipedia content...</p>
      )}
    </div>
  );
};
 
export default WikiPage;