import { useEffect } from "react";
import { FaFileLines} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { api } from '../App';

const Navbar = ({ setLoggedIn, loggedIn, authError, setNotes, token }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authError();
        navigate('/login');
    };

    useEffect(() => {
        try {
            api.post("/", { token }).then(({ data }) => {
                if (data.status) {
                    setNotes(data.notes);
                    setLoggedIn(true);
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
        <nav className="bg-gray-800 fixed top-0 z-10 w-screen h-12 px-6 flex items-center">
            <div className="w-full flex justify-between items-center">
                <a href="https://github.com/danpaxton/notesite" target="_blank" rel="noreferrer" className="text-2xl text-white flex items-center gap-1 font-bold cursor-pointer">
                    <FaFileLines/>
                    Notesite
                </a>
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