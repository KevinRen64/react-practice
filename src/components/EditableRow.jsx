import React, { useState } from 'react'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { TextField } from '@mui/material';
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual'
import { BaseStorageUrl } from '../environment';


function EditableRow({row, handleEditSubmit, onClose, editedFormData, handleInputTextChange, handleImageChange}) {
  const [url, setUrl] = useState() 


  const onTextChange = (e) => {
    handleInputTextChange(e)
  }

  const onImgChange = () => {
    handleImageChange()
  }

  const showImg = (e) => {
    let imgFile = e.target.files[0]
    console.log(imgFile)
    let url = window.URL.createObjectURL(imgFile)
    setUrl(url)
    handleImageChange(imgFile)
  }

  return (
    <>
    <TableCell align='center'>
      <TextField 
        type='text'
        required={true}
        name="title" 
        defaultValue={editedFormData.title}
        onChange={onTextChange}
      />
    </TableCell>

    <TableCell align="center">
      <TextField 
        type='text'
        required={true}
        name="price" 
        defaultValue={editedFormData.price}
        onChange={onTextChange}
      />
    </TableCell>

    <TableCell align="center">
      <TextField 
        type='text'
        required={true}
        name="description" 
        defaultValue={editedFormData.description}
        onChange={onTextChange}
      />
    </TableCell>

    <TableCell align="center">
      {row.image && (
        <img
          src={`${BaseStorageUrl}${row.image}`}
          width='80'
          height='60'
          style={{ marginTop: '20px' }}
          alt='preview'
        />
      )}
      <IconButton
        color='primary'
        aria-label='upload picture'
        component='label'
        onClick={onImgChange}
      >
        <input
          hidden
          accept='image/*'
          type='file'
          name='image'
          onChange={showImg}
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
        // disabled={disabled}
        onClick={handleEditSubmit}
      >
        <CheckIcon />
      </IconButton>  

      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>          
    </TableCell>                          
  </>
  )
}

export default EditableRow