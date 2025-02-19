import React from 'react'
import './Theme.css'

import Switch from '@mui/material/Switch';

const Theme = ({setMode}) => {


    const handleToggle = (event) => {
        setMode(event.target.checked ? 'dark' : 'light');
      };
      
  return (
    <div>
      <Switch  onChange={handleToggle} />
     
    </div>
  )
}

export default Theme