import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { api } from '../App';

const Login = ({ setNotes, setLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validForm = () => {
        if (!username.trim() || !password.trim()) {
            setError('Enter all fields')
            return false;
        } else {
            setError('');
            return true;
        }
    }

    const handleSignup = async () => {
        if (!validForm()) {
            return;
        }
        try {
            const { data } = await api.post('/signup', { username, password });
            if (data.success) {
                setLoggedIn(true);
                navigate('/');
                setError('');
            } else {
                setError(data.message);
            }
        } catch (e) {
            console.log(e)
        }
    };
    
    const handleLogin = async () => {
        if (!validForm()) {
            return;
        }
        try {
            const { data } = await api.post('/login', { username, password });
            if (data.success) {
                setNotes(data.notes);
                setLoggedIn(true);
                navigate('/');
                setError('');
            } else {
                setError(data.message);
            }
        } catch (e) {
            console.log(e)
        }
    };

    const handleUsername = name => {
        setUsername(name.target.value);
    };
    
    const handlePassword = pass => {
        setPassword(pass.target.value);
    };

    return (
        <div className="bg-gray-300 flex flex-col gap-3 items-center h-screen">
            <div className="mt-20 md:mt-48 bg-white rounded-lg border border-gray-400 shadow text-black w-auto md:w-[450px] h-auto p-6">
                <div className="flex flex-col items-center">
                    <div className="font-bold mb-2 w-full">Username</div>
                    <input onChange={handleUsername} type="text" className={`w-full p-3 border rounded ${error ? ' border-red-500' : 'border-gray-300'}`}/>
                    <div className="font-bold mb-2 w-full">Password</div>
                    <input onChange={handlePassword} type="password" className={`w-full p-3 border rounded ${error ? ' border-red-500' : 'border-gray-300'}`}/>
                    <div className="flex items-baseline gap-5">
                        <button type="button" onClick={handleLogin} className="px-5 py-2 mt-4 rounded text-white bg-gray-800 hover:bg-gray-700">
                            Login
                        </button>
                        <button type="button" onClick={handleSignup} className="px-5 py-2 mt-4 rounded text-white bg-gray-800 hover:bg-gray-700 whitespace-nowrap">
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
            { error ?
                <div className="bg-white rounded-lg shadow-lg w-auto py-1 px-2 text-red-500">
                    {error}
                </div>
                : null
            }
        </div>
    );
};
 
export default Login;