import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { useState, useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import { Avatar } from '@mui/material';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import EditableRow from './EditableRow';
import AddItem from './AddItem';
import { Snackbar} from '@mui/material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { apiGet, apiDelete, apiPost, apiPut } from '../services';
import { BaseStorageUrl } from '../environment';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: 'title',
    numeric: false,
    disablePadding: false,
    label: 'Title',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: 'Description',
  },
  {
    id: 'image',
    numeric: false,
    disablePadding: false,
    label: 'Image',
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Actions',
  },
];

function EnhancedTableHead(props) {
  const {order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='center'
            padding='normal'
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function MuiTableWithAPI({searchValue, showAddItem, setShowAddItem, opens, handleClosebar, SnackbarAlert, severity, snackContent, handleSuccess, handleFail, importData, rows, setRows}) {
  //console.log(importData)
  
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('title');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editProductId, setEditProductId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedFormData, setEditedFormData] = useState({
    category_id:'99',
    id: '',
    title: '',
    description: '',
    price: '',
  })
  const [image, setImage] = useState('')
  const [addFormData, setAddFormData] = useState({
    category_id:'99',
    title: '',
    description: '',
    price: '',
  })
  const [addImage, setAddImage] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(()=>{
    
    if(importData === null){
      apiGet('products')
        // .get('https://app.spiritx.co.nz/api/products')
        .then(response => {setRows(response.data)})
        .catch(error => {console.error('Error')})
    } else{
      //console.log('importData in Table', importData)
      const transformedData = importData.map((item) => ({
        id: item[0],
        category_id: '99',
        title: item[2],
        description: item[3],
        price: item[4], 
      }))
      //console.log(transformedData)
      setRows(transformedData)
    }
  }, [importData])



  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };



  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
  }

const handleClickClearButton = (row) => {
  handleDeleteDialogOpen()
  setItemToDelete(row)
}

const performDelete = () => {
  apiDelete(`products/${itemToDelete.id}`)
  .then(()=> {
    const updatedRows = rows.filter((r) => r.id !== itemToDelete.id)
    setRows(updatedRows)
    handleSuccess('Delete form successfully!')
  })
  .catch((error) => handleFail(error.message))
  }

  const handleClickEditButton = (event, row) => {
    setIsEditing(true)
    event.preventDefault()
    setEditProductId(row.id)
    const formValues = {
      category_id: '99',
      id: row.id,
      title: row.title,
      description: row.description,
      price: row.price,
    }
    setEditedFormData(formValues)

  }

  const handleClose = () => {
    setIsEditing(false)
  }

  const handleAddClose = () => {
    setShowAddItem(false)
  }

  const handleInputTextChange = (e) => {
    e.preventDefault()
    setEditedFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  }

  const handleAddFormChange = (e) => {
    e.preventDefault()
    const fieldName = e.target.name
    const fieldValue = e.target.value
    const newFormData = { ...addFormData }
    newFormData[fieldName] = fieldValue
    setAddFormData(newFormData)
  }

  const handleImageChange = (imgFile) => {
    setImage(imgFile)
    console.log(image)
  };

  const handleAddImageChange = (imgFile) => {
    setAddImage(imgFile)
  };

  const handleEditSubmit = () => {
    let formData = new FormData();
    editedFormData.title && formData.append('title', editedFormData.title)

    editedFormData.description && formData.append('description', editedFormData.description)

    editedFormData.price && formData.append('price', editedFormData.price)

    editedFormData.category_id && formData.append('category_id', editedFormData.category_id)

    image && formData.append('image', image)

    formData.append('_method', 'PUT')

    apiPut(`products/${editedFormData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res) => {
        const newProducts = [...rows]
        console.log('newProduct', res.data)

        const index = rows.findIndex(
          (row) => row.id === editedFormData.id
        )

        newProducts[index] = res.data
        setRows(newProducts)
        setEditProductId(null)
        handleSuccess('Edit form successfully!')
      })
      .catch((err) => {
        'error'
      })
  }

  const handleAddSubmit =(e) => {
    let formData = new FormData()
    e.preventDefault()
    formData.append('title', addFormData.title)

    addFormData.description && formData.append('description', addFormData.description)

    formData.append('price', addFormData.price)

    formData.append('category_id', addFormData.category_id)

    addImage && formData.append('image', addImage)

    const config = {
      headers: {
        token: localStorage.getItem('react-project-token')
      }
    }


    apiPost(`products`, formData, config,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      const newProducts = [res.data, ...rows]
      console.log('newProduct', res.data)
      setRows(newProducts)
      setShowAddItem(false)
      handleSuccess('Add form successfully!')
    })
    .catch((err) => {
      'error'
    })
  }
  
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const searchQuery = typeof searchValue === 'string' ? searchValue : ''

  const filteredRows = rows? rows.filter((row) =>
    (row.title ||  '' ).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (row.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  ) : []
  //console.log(filteredRows)

  const visibleRows = React.useMemo(
    () =>
      filteredRows
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
      [filteredRows, order, orderBy, page, rowsPerPage]
  );



  return (
    <Box sx={{ maxWidth: '1200px' , margin: '0 auto'}}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750}}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              
            {showAddItem && 
                <AddItem handleAddClose={handleAddClose} handleAddFormChange={handleAddFormChange} handleAddSubmit={handleAddSubmit}handleImageChange={handleChangePage} image={image} handleAddImageChange={handleAddImageChange}/>
            }

              {visibleRows.map((row) => {
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: 'pointer' }}
                  >
                    {isEditing && editProductId === row.id 
                      ? <EditableRow row={row} handleEditSubmit={handleEditSubmit} onClose={handleClose} editedFormData={editedFormData} handleInputTextChange={handleInputTextChange} handleImageChange={handleImageChange}/>
                      : (
                        <>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="normal"
                            align='center'
                          >
                            {row.title}
                          </TableCell>
                          <TableCell align="center">{row.price}</TableCell>
                          <TableCell align="center">{row.description}</TableCell>
                          <TableCell align="center">{console.log(`${BaseStorageUrl}${row.image}`)}{
                            row.image ? (
                              <img
                                src={`${BaseStorageUrl}${row.image}`} 
                                alt={row.title}
                                width='130px'
                              />
                            ) : (
                              'No image'
                            )
                          }</TableCell>
                          <TableCell align="center">
                            <IconButton onClick={(event) => handleClickClearButton(row)}>
                              <Avatar style={{background:'blue'}}><ClearRoundedIcon /></Avatar>
                            </IconButton>  
                            <IconButton onClick={(event) => handleClickEditButton(event, row)}>
                            <Avatar style={{background:'blue'}}><ModeEditOutlineRoundedIcon /></Avatar>
                            </IconButton>  
                                                  
                          </TableCell>                          
                        </>
                      )
                  }
                  </TableRow>
                );
              })}

              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Snackbar
          open={opens}
          autoHideDuration={3000}
          onClose={handleClosebar}
        >
          <SnackbarAlert
            onClose={handleClosebar}
            severity={severity}
          >
            {snackContent}
          </SnackbarAlert>
        </Snackbar>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle delete action here
              performDelete(itemToDelete)
              handleDeleteDialogClose();
            }}
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>        
    </Box>
  );
}