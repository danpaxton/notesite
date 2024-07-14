import { useEffect } from "react";
import { FaFileLines} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { api } from '../App';

const Navbar = ({ setLoggedIn, loggedIn, authError, setNotes }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authError();
        navigate('/login');
    };

    useEffect(() => {
        try {
            api.get("/").then(({ data }) => {
                if (data.status) {
                    setLoggedIn(true);
                    setNotes(data.notes);
                } else {
                    handleLogout();
                }
            });
        } catch (e) {
            console.log(e);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    return (
        <nav className="bg-gray-800 fixed top-0 z-10 w-full h-10 p-6 flex items-center">
            <div className="w-full flex justify-between items-center">
                <div className="text-2xl text-white flex items-center gap-1 font-bold cursor-pointer">
                    <FaFileLines/>
                    Notesite
                </div>
                <button className="mx-2 font-bold text-white">
                    { loggedIn ?
                        <div onClick={handleLogout} className="hover:text-gray-300">
                            LOGOUT
                        </div>
                        :
                        <div className="hover:text-gray-300">
                            LOGIN
                        </div>
                    }
                </button>
            </div>
        </nav>
    )
};

export default Navbar;