import React, { useEffect, useState} from 'react';
import './WikiPage.css';
import parse from 'html-react-parser';

const WikiPage = ({ selectedCity , mode} ) => {
  // Normalize city name for Wikipedia API compatibility
  const normalizedCity = selectedCity
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s*\(.*?\)\s*/g, '');

  const [wikiContent, setWikiContent] = useState('');

  useEffect(() => {
    const fetchWikipediaContent = async () => {
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
      }
    };

    fetchWikipediaContent();
  }, [normalizedCity]);


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


// import React, {useEffect, useState} from 'react'
// import './WikiPage.css'
 
// const WikiPage = ({ selectedCity }) => {
//  selectedCity = selectedCity.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s*\(.*?\)\s*/g, '');
  
//   const [WikiPage, setWikiPage] = useState(null);
 
  
//  useEffect(() => {
//   const fetchWikipedia = async () => {
 
//     if (!selectedCity) return;
    
//     const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${selectedCity}`;
//     try{
//       const response = await fetch(wikiUrl);
//       const data = await response.json();
 
//       if(data.content_urls){
//         setWikiPage(data.content_urls.desktop.page);
//       }else{
//         setWikiPage("")
//       }
//     }catch(error){
//       console.error("Error Fetching the wikipedia page");
//       setWikiPage("");
//     }
//   };
//   fetchWikipedia();}, [selectedCity]);
//   return (
//     <div className='wikipage-container'>
//       {/* <h1>Wikipedia Page</h1> */}      
//       {WikiPage && (
//           <iframe
//             className='iframe'
//             id="wiki"
//             src={WikiPage}
//             width="100%"
//             height="320px"
//             title='Wikipedia Page'
//           ></iframe>
//       )}
//     </div>
//   );
// };

// export default WikiPage;
 
