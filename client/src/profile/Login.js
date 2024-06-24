import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { Box, TextField, Button } from '@mui/material'
import { api } from '../App';
import './Login.css'
 
const Login = ({ login, setLogin }) => {
    const [password, setPassword] = useState("");
    const [signUpError, setSignUpError] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            const { data } = await api.post('/signup', {username: login.username, password });
            if (data.success) {
                setLogin(data.user);
                navigate('/');
                setSignUpError(false);
            } else {
                setSignUpError(true)
            }
        } catch (e) {
            console.log(e)
        }
    };
    
    const handleLogin = async () => {
        try {
            const { data } = await api.post('/login', { username: login.username, password });
            if (data.success) {
                setLogin(data.user);
                navigate('/');
                setSignUpError(false);
            } else {
                setSignUpError(true)
            }
        } catch (e) {
            console.log(e)
        }
    };

    const handleName = name => {
        login.username = name.target.value;
    };
    
    const handlePassword = pass => {
        setPassword(pass.target.value);
    };

    return (
        <Box className="login-page">
            <Box className="login">    
                <Box className="login-label">
                    Username
                    <TextField error={signUpError} className='login-text' onChange={handleName} fullWidth size='small'></TextField>
                </Box>
                <Box className="login-label">
                    Password
                    <TextField error={signUpError} className='login-text' onChange={handlePassword} fullWidth size='small'></TextField> 
                </Box>
                <Box className="login-buttons">
                    <Button onClick={handleLogin} fullWidth variant='contained'>
                        Login
                    </Button>
                    <Button onClick={handleSignUp} fullWidth variant='contained'>
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};
 
export default Login;