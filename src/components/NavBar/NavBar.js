import React, { useContext, useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import "./NavStyle.css";
import LoginIcon from "@mui/icons-material/Login";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import userContext from "../../context/UserContext";
import axios from "axios";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HelpIcon from '@mui/icons-material/Help';
import helperContext from "../../context/HelperContext";
import productContext from "../../context/ProductContext";
import { viewCart } from "../../slices/cart/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Badge } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function NavBar() {

  const token = localStorage.getItem("token");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const dispatch = useDispatch();
  const { cartItems } = useSelector(store => store.cart)
  // console.log('FORM NAVBAR', cartItems)
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const navigateVendor = (e) => {
    e.preventDefault();
    console.log("vendor navigated");
    if (!(e.target instanceof HTMLElement))
      return;
    const anchor = e.target.closest('a');
    if (anchor !== null) {
      anchor.target = '_blank';
      anchor.rel = 'noopener';
      window.navigation.navigate("http://13.127.42.202:8000");
    }
      // window.navigation.navigate("http://localhost:4200");

  };

  //CONTEXT DATA
  const {
    loginResponse,
    navigate,
    setLoginRes,
    setProfileData,
    userProfile,
  } = useContext(userContext);

  const {
    searchInput,
    setSearchInput
  } = useContext(helperContext)

  const { productData } = useContext(productContext)


  useEffect(() => {
    return async () => {
      if (token) {
        const user = await axios.get(
          `${process.env.REACT_APP_ENDPOINT}/get/single/user`,
          { headers: { token: token, "Content-Type": "application/json" } }
        );
        setProfileData(user.data.user);
        setLoginRes(user);
      } else {
        navigate("/login");
      }
    };
  }, []);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >

      <Link to="/profile/orders">
        <MenuItem
          onClick={() => {
            handleMenuClose();
          }}
        >
          <ShoppingBagIcon />
          Your Orders
        </MenuItem>
      </Link>

      <Link to="/profile/account">
        <MenuItem
          onClick={() => {
            handleMenuClose();

          }}
        >
          <AccountCircle />
          My Profile
        </MenuItem>
      </Link>
      <MenuItem
        onClick={() => {
          handleMenuClose();
        }}>
        <HelpIcon />
        <Link to='/help/center'>Help center</Link>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {loginResponse && loginResponse.status == 200 ? (
        <IconButton
          className="login_section"
          size="small"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <>
            {" "}
            {loginResponse.data.user.fullName.split(" ")[0]}
            <FingerprintIcon />
          </>
        </IconButton>
      ) : (
        <Link className="menu_icon" to="/login">
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-haspopup="true"
            color="inherit"
          >
            <LoginIcon />
          </IconButton>
        </Link>
      )}
      <a
      href="http://localhost:4200"
      target={"_blank"} 
      rel="noopener noreferrer"
      >
        <IconButton
          onClick={navigateVendor}
          size="small"
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
          color="inherit"
        >
          Become seller
        </IconButton>
      </a>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>

          <Link to="/">
            <img className='menu_icon' src='/images/e-zone.png' />
          </Link>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              name="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <div className="menu_bar">
              {/* LOGIN */}
              {loginResponse && loginResponse.status == 200 ? (
                <IconButton
                  className="login_section"
                  size="small"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <>
                    {" "}
                    {loginResponse.data.user.fullName.split(" ")[0]}
                    <FingerprintIcon />
                  </>
                </IconButton>
              ) : (
                <Link className="menu_icon" to="/login">
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    color="inherit"
                  >
                    <LoginIcon />
                  </IconButton>
                </Link>
              )}
              <Link to=" ">
                <IconButton
                  onClick={navigateVendor}
                  size="small"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                >
                  Become seller
                </IconButton>
              </Link>
              <Link className="menu_icon" to="">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                >
                  {/* <HoverMenu /> */}
                </IconButton>
              </Link>

              <Link className="vendor-nav" to="/Cart">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                >
                  {/* <ShoppingCartIcon onClick={()=> {dispatch(viewCart())}} />
                  <span>{cartItems.length}</span> */}

                  <Badge color="secondary" badgeContent={cartItems.length}>
                    <ShoppingCartIcon onClick={() => { dispatch(viewCart()) }} />
                  </Badge>
                </IconButton>
              </Link>
            </div>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
