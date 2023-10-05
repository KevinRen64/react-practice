import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import * as Xlsx from 'xlsx';

export default function Export({rows}) {
  const handleExportClick = () => {
    console.log(rows);
    const wb = Xlsx.utils.book_new();
    const ws = Xlsx.utils.json_to_sheet(rows);
    Xlsx.utils.book_append_sheet(wb, ws, "MySheet1");
    Xlsx.writeFile(wb, "ExportedFile.xlsx")
  }
    
  return (
    <IconButton color="primary" component="label" onClick={handleExportClick}>
      <DownloadIcon />
    </IconButton>
  )
}
