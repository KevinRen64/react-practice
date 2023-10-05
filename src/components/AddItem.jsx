import React from 'react'
import { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { TextField } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual'


function AddItem({handleAddClose, handleAddFormChange, handleAddSubmit, handleAddImageChange}) {
  const [url, setUrl] = useState() 

  const onTextChange = (e) => {
    handleAddFormChange(e)
  }

  const addImg = (e) => {
    let imgFile = e.target.files[0]
    let url = window.URL.createObjectURL(imgFile)
    setUrl(url)
    handleAddImageChange(imgFile)
  }


  return (
    <TableRow>
        <TableCell align='center'>
          <TextField 
            placeholder='Enter a title'
            required={true}
            name="title" 
            onChange={onTextChange}
          />
        </TableCell>

        <TableCell align="center">
          <TextField 
            required={true}
            name="price" 
            placeholder='Enter a price'
            onChange={onTextChange}
          />
        </TableCell>

        <TableCell align="center">
          <TextField 
            placeholder='Enter a description'
            name="description" 
            onChange={onTextChange}
          />
        </TableCell>

        <TableCell align="center">
          <IconButton
            color='primary'
            aria-label='upload picture'
            component='label'
          >
          {url ? (
            <img
              src={url}
              width='80'
              height='60'
              alt=''
            />
          ) : (
            ''
          )}
          <input
            hidden
            accept='image/*'
            type='file'
            name='product_image'
            onChange={addImg}
          />

            <PhotoSizeSelectActualIcon
                fontSize='large'
                style={{ paddingBottom: '20px' }}
            />
          </IconButton>
        </TableCell>

        <TableCell align="center">
          <IconButton 
            type='submit'
            onClick={handleAddSubmit}
          >
            <CheckIcon />
          </IconButton>  

          <IconButton 
            onClick={handleAddClose}
          >
            <CloseIcon />
          </IconButton>          
        </TableCell>                          
    </TableRow>
  )
}

export default AddItem