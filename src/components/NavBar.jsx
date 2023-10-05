import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import { Popover } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import ClearIcon from '@mui/icons-material/Clear'; 
import { useLocation, useNavigate } from 'react-router-dom';



const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));



export default function SearchAppBar({searchValue, setSearchValue}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate()
  const location = useLocation()

  const handleUserIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null)

  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
  }

  const handleClearSearch = () => {
    setSearchValue('')
  }

  const handleLogout = () => {
    localStorage.removeItem('react-project-token')
    navigate('/')
    window.location.reload()
  }




  return (
    <Box sx={{ maxWidth: '1400px' , margin: '0 auto', marginBottom: '20px'}}>
      <AppBar position="static">
        <Toolbar>
          {location.pathname !== '/' && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick ={handleUserIconClick}
            >
              <AccountCircleIcon />
            </IconButton>  
          )}
 
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Product Management
          </Typography>

          {location.pathname !== '/' && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearchChange}
                value={searchValue}
                onKeyDown={(event) => {
                  if(event.key === 'Escape'){
                    //console.log('hello')
                    handleClearSearch()
                  }
                }}
              />
              {Object.keys(searchValue).length > 0  && (
                <IconButton onClick={handleClearSearch} edge="end">
                  <ClearIcon sx={{color: 'white'}}/>
                </IconButton>
              )}

            </Search>
          )}
        </Toolbar>
      </AppBar>
      {location.pathname !== '/' && (
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 10,
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 10,
        }}
      >
        <MenuList autoFocusItem={Boolean(anchorEl)} id="user-menu">
          <MenuItem onClick={handleLogout}>
            <AccountCircleIcon sx={{marginRight: '5px'}}/>
            test@gradspace.org
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon  
              sx={{marginRight: '5px'}}
            />
            Logout
          </MenuItem>
        </MenuList>
      </Popover>
      )}
    </Box>
  );
}