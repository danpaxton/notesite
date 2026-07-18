import { FaPenToSquare, FaArrowLeftLong, FaTrashCan, FaEllipsis, FaMagnifyingGlass, FaRegBookmark, FaBookmark, FaFileLines  } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { getText, getDate, includeDate, firstPinned, sortDatePinned } from "../utils/operations";
import { api } from '../App';

import NoteEditor from './NoteEditor';

const Note = () => ({  
    text: "",
    pinned: false,
    editedAt: new Date()
});

const Notes = ({ notes, setNotes, authError, token, loggedIn, setLoggedIn }) => {
    const navigate = useNavigate();
    const [noteId, setNoteId] = useState(null);
    const [pinned, setPinned] = useState(false);
    const [search, setSearch] = useState("");
    const [noteSettings, setNoteSettings] = useState(false);

    const searchFilter = e => {
        const str = search.trim();
        const textArr = getText(e.text, true);
        for (const t of textArr) {
            if (t.includes(str)) {
                return true;
            }
        }
        return false;
    };

    const getNotes = notes => notes.filter(searchFilter);

    const updateNotes = async (newNotes) => {
        try {
            api.post('/update', { notes: newNotes, token }).then(({ data }) => {
                if (!data.status) {
                    authError();
                    navigate('/login');
                }
            });
        } catch(e) {
            console.log(e)
        }
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

    const handleSave = () => {
        if (noteId !== null) {
            getNotes(notes)[noteId].editedAt = new Date();
        }
        updateNotes(notes);
    };

    const handleLoad = (i) => {
        setNoteId(i);
        setPinned(getNotes(notes)[i].pinned);
    };

    const handleNew = () => {
        setSearch('');
        handleLoad(notes.push(Note()) - 1);
    };

    const handleReset = () => {
        if (noteId !== null) {
            setNoteId(null);
        }
        setNoteSettings(false);
    };

    const handleDelete = () => {
        if (noteId !== null) {
            const t = getNotes(notes)[noteId];
            const newNotes = notes.filter((e, i) => e !== t);
            updateNotes(newNotes);
            setNotes(newNotes);
        }
        handleReset();
    };

    const handleBack = () => {
        if (noteId !== null) {
            if (!getNotes(notes)[noteId].text) {
                handleDelete();
            } else {
                handleReset();
            }
        }
    }

    const handlePin = () => {
        if (noteId !== null) {
            const n = getNotes(notes);
            const pinValue = !n[noteId].pinned
            n[noteId].pinned = pinValue;
            setPinned(pinValue);
            updateNotes(notes);
        }
    };

    const handleBorder = (notes, i) => {
        let borderStyle = "border-x border-t"
        if (i === getNotes(notes).length - 1 || includeDate(notes, i + 1)) {
            borderStyle += " rounded-b-lg border-b";
        }
        if (includeDate(notes, i)) {
            borderStyle += " rounded-t-lg";
        }
        return borderStyle;
    };


    const handleSearchText = text => {
        setSearch(text.target.value);
    };
    
    const handleLogout = () => {
        authError();
        navigate('/login');
    };

    return noteId !== null ?
            <div className="h-screen w-screen">
                <div className=" bg-white fixed h-12 w-full flex justify-between items-center px-6">
                    <button className="text-gray-800 border-b-gray-300 text-2xl hover:text-gray-700" onClick={handleBack}>
                        <FaArrowLeftLong/>
                    </button>
                    <div className={"flex items-center gap-5"}>
                        { noteSettings ?
                            <div className="flex items-center gap-5">
                                <button onClick={handlePin} className={pinned ? "text-blue-600 hover:text-blue-500" : "text-gray-800 hover:text-gray-700" }>
                                    { pinned  ? <FaBookmark/> : <FaRegBookmark/> }
                                </button>
                                <button onClick={handleDelete} className=" text-red-600 hover:text-red-500">
                                    <FaTrashCan/>
                                </button>
                            </div>
                            : 
                            null
                        }
                        <button className="text-xl text-gray-800 hover:text-gray-700" onClick={() => setNoteSettings(!noteSettings)}>
                            <FaEllipsis/>   
                        </button>
                    </div>
                </div>
                <NoteEditor handleSave={handleSave} note={getNotes(notes)[noteId]} />
            </div>
            :
            <div className="flex flex-col">
                <nav className="bg-gray-800 z-10 fixed w-screen h-12 px-6 flex items-center">
                    <div className="w-full flex justify-between items-center">
                        <a href="https://github.com/danpaxton/notesite" target="_blank" rel="noreferrer" className="text-2xl text-white flex items-center gap-1 font-bold cursor-pointer">
                            <FaFileLines/>
                            Notesite
                        </a>
                        <button onClick={handleLogout} className="mx-2 font-bold text-white hover:text-gray-300">
                            LOGOUT
                        </button>
                    </div>
                </nav>
                <div className="pb-4 pt-16 px-4 md:px-16 h-full overflow-scroll flex flex-col gap-1">
                    <div className="flex w-full items-center gap-1 text-lg">
                        <FaMagnifyingGlass/>
                        <input type="text" value={search} className="w-full shadow border bg-gray-200 border-gray-400 rounded-lg h-6 p-2 font-normal text-sm " onChange={handleSearchText}/>
                    </div>
                    <ul className="flex flex-col">  
                    {   
                        notes.sort(sortDatePinned).filter(searchFilter).map((e, i) => (
                            <li key={i}>
                                { firstPinned(notes, i) ?
                                    <div className="ml-1 mt-3 text-sm flex items-center font-semibold text-black">
                                        <FaBookmark/>Bookmarks
                                    </div>
                                : includeDate(notes, i) ?
                                    <div className="ml-1 mt-3 text-sm font-semibold text-black">
                                        {getDate(e.editedAt)}
                                    </div>
                                : null
                                }
                                <div onClick={() => handleLoad(i)} className={`py-2 px-3 ${handleBorder(notes, i)} border-gray-400 shadow-lg bg-white hover:bg-gray-100 cursor-pointer`}>
                                    <div className="font-semibold text-black  overflow-clip whitespace-pre">
                                        {getText(e.text, false)[0]}
                                    </div>
                                    <div className="text-gray-500 font-normal text-sm overflow-clip whitespace-pre">
                                        {getText(e.text, false)[1]}
                                    </div>
                                </div>
                            </li>
                        ))
                    }   
                    </ul>
                </div>
                <button onClick={handleNew} className="fixed bottom-10 right-10 md:bottom-24 md:right-24 p-6 rounded-full text-3xl shadow-lg shadow-gray-400 text-white bg-gray-800 hover:bg-gray-700">
                    <FaPenToSquare/>
                </button>
            </div>
};
export default Notes;