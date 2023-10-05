import React from 'react'
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';


function Add({onAdd}) {
  return (
    <IconButton 
      sx={{marginLeft: '90px'}}
      color='primary'
      onClick={onAdd}
    >
      <AddCircleIcon fontSize='large'/>
    </IconButton>   
  )
}

export default Add