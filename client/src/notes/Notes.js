import { FaPenToSquare, FaArrowLeftLong, FaTrashCan, FaEllipsis, FaMagnifyingGlass, FaRegBookmark, FaBookmark  } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { getText, getDate, includeDate, firstPinned, sortDatePinned } from "../utils/operations";
import { api } from '../App';

import NoteEditor from './NoteEditor';

const Note = () => ({  
    text: "",
    pinned: false,
    editedAt: new Date()
});

const Notes = ({ notes, setNotes, authError }) => {
    const navigate = useNavigate();
    const [noteId, setNoteId] = useState(null);
    const [pinned, setPinned] = useState(false);
    const [search, setSearch] = useState("");
    const [noteSettings, setNoteSettings] = useState(false);

    const searchFilter = e => {
        const str = search.trim();
        const textArr = getText(e.text);
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
            api.post('/update', { notes: newNotes }).then(({ data }) => {
                if (!data.status) {
                    authError();
                    navigate('/login');
                }
            });
        } catch(e) {
            console.log(e)
        }
    };

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
    

    return (
        <div className="bg-gray-300 text-black h-screen overflow-scroll pt-12">
            { noteId !== null ?
                <div className="bg-white text-black h-full flex flex-col">
                    <div className="flex justify-between items-center pt-3 px-6">
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
                    <div className="h-full w-full">
                        <NoteEditor handleSave={handleSave} note={getNotes(notes)[noteId]} />
                    </div>
                </div>
                :
                <>
                <div className="py-4 font-bold px-4 md:px-16">
                    <div className="flex flex-col text-3xl gap-2 font-bold text-black">
                        Notes
                        <div className="flex w-full items-center gap-1 text-lg">
                            <FaMagnifyingGlass/>
                            <input type="text" value={search} className="w-full shadow border bg-gray-200 border-gray-400 rounded-lg h-6 p-2 font-normal text-sm " onChange={handleSearchText}/>
                        </div>
                    </div>
                    <ul className="flex flex-col">  
                    {   
                        notes.sort(sortDatePinned).filter(searchFilter).map((e, i) => (
                            <li key={i}>
                                { firstPinned(notes, i) ?
                                    <div className="ml-1 mt-3 text-sm flex items-center font-semibold text-black">
                                        <FaBookmark/>Bookmarks
                                    </div>
                                :
                                includeDate(notes, i) ?
                                    <div className="ml-1 mt-3 text-sm font-semibold text-black">
                                        {getDate(e.editedAt)}
                                    </div>
                                    : null
                                }
                                <div onClick={() => handleLoad(i)} className={`py-2 px-3 ${handleBorder(notes, i)} border-gray-400 shadow bg-white hover:bg-gray-100 cursor-pointer`}>
                                    <div className="font-semibold text-black  overflow-clip whitespace-pre">
                                        {getText(e.text)[0]}
                                    </div>
                                    <div className="text-gray-500 font-normal text-sm overflow-clip whitespace-pre">
                                        {getText(e.text)[1]}
                                    </div>
                                </div>
                            </li>
                        ))
                    }   
                    </ul>
                </div>
                <button onClick={handleNew} className="fixed bottom-10 right-10 p-6 rounded-full text-3xl shadow-lg shadow-gray-400 text-white bg-gray-800 hover:bg-gray-700">
                    <FaPenToSquare/>
                </button>
                </>
            }
        </div>
    );
};
export default Notes;