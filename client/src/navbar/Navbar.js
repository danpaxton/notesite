import './Navbar.css'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Box, Button } from '@mui/material'
import { api } from '../App';

const Navbar = ({ cookies, removeCookie, login, setLogin, tabValue }) => {
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        setLogin({ logged: false, username: "" });
        removeCookie("token");
        handleSignUpClick();
    };
    
    useEffect(() => {
        if (!cookies.token) {
            handleSignUpClick();
        }
        api.get("/").then(({ data }) => {
            if (data.status) {
                setLogin(data.user);
            } else {
                removeCookie("token");
                navigate("/login");
            }
        });
    }, [cookies, navigate, removeCookie])

    return (
        <Box color="secondary" className="nav-bar">
            <Box className="logo">Notesite</Box>
            <Box className="nav-buttons">
                <Box className="tab" sx={{ color: !login.logged ? 'gray' : 'white' }}>NOTES</Box>
                <Box className="login-tab tab">
                    {login.logged ?
                        <Box onClick={handleLogout}>
                            Logout
                        </Box> : 
                        <Box onClick={handleSignUpClick}>
                            SIGN UP
                        </Box>
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default Navbar;