import MuiTableWithAPI  from './components/Table';
import SearchAppBar from './components/NavBar';
import { useState, forwardRef } from 'react';
import SignIn from './components/LogIn';
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom'
import { Navigate } from 'react-router-dom';
import Add from './components/Add';
import { Snackbar, Alert } from '@mui/material'
import Import from './components/Import';
import Box from '@mui/material/Box';
import Export from './components/Export';

function App() {
  const [rows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState([])
  const auth = localStorage.getItem('react-project-token')
  const [showAddItem, setShowAddItem] = useState(false)
  const [opens, setOpens] = useState(false)
  const [snackContent, setSnackContent] = useState('')
  const [severity, setSeverity] = useState('success')
  const [importData, setImportData] = useState(null)
  const SnackbarAlert = forwardRef(
    function SnackbarAlert(props, ref) {
      return <Alert elevation={6} ref={ref} {...props} />
    }
  )
  const handleClosebar = (e, reason) => {
    if (reason === 'clickaway') {
      return 
    }
    setOpens(false)
  }

  const handleSuccess = (content) => {
    setSnackContent(content)
    setOpens(true)
    setSeverity('success')
  }

  const handleFail = (content) => {
    setSnackContent(content)
    setOpens(true)
    setSeverity('error')
  }
  
  const  OnImport = (importData) =>  {
    //console.log("import")
  }


  return (
    <Router>
      <SearchAppBar searchValue={searchValue} setSearchValue={setSearchValue} />
      
      <Routes>
        <Route 
          path ='/' 
          element = { auth ? <Navigate to="/table" /> : <SignIn handleSuccess={handleSuccess}/> }
        /> 

        <Route 
          path = '/table' 
          element = { auth ? (
          <>
            <Box sx={{display:'flex', alignItems:'center', width: '1400px' , margin: '0 auto', marginBottom: '20px'}}>
              <Add onAdd = {() => setShowAddItem(!showAddItem)}/>
              <Import OnImport={OnImport} setImportData={setImportData}/>
              <Export rows={rows}/>
            </Box>



            <MuiTableWithAPI searchValue={searchValue} showAddItem={showAddItem} setShowAddItem={setShowAddItem} opens={opens} snackContent={snackContent} SnackbarAlert={SnackbarAlert} handleClosebar={handleClosebar} handleFail={handleFail} handleSuccess={handleSuccess} severity={severity} importData={importData} rows={rows} setRows={setRows}/>
          </>
            ) : <Navigate to='/' />} 
        />

      </Routes>
    </Router>
  )
}

export default App;
