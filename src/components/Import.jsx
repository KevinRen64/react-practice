import React, { useState } from 'react'
import { IconButton } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import * as Xlsx from 'xlsx';


function Import({OnImport, setImportData}) {
  //const [importData, setImportData] = useState([])
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if(file) {
      readExcelFile(file)
        .then((importData) =>{
          //console.log(importData)
        })
        .catch((error) => {
          console.log('Error reading XLSX file: ', error)
        })

    }
  }

  function readExcelFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const data = e.target.result
        const workbook = Xlsx.read(data, {type: 'binary'})
        const sheetName = workbook.SheetNames[0]; 
        const sheet = workbook.Sheets[sheetName];
        const rawdata = Xlsx.utils.sheet_to_json(sheet, { header: 1 });
        const jsonData = rawdata.slice(1)
        //console.log(jsonData)
        setImportData(jsonData)
        resolve(jsonData);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsBinaryString(file);
    });
  }

  return (
    <IconButton color="primary" component="label">
      <input type="file" hidden accept=".xlsx"  onChange={handleFileChange}/>
      <FileUploadIcon />
    </IconButton>
  )
}

export default Import

