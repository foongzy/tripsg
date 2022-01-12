import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import BookmarkFilled from '@material-ui/icons/Bookmark';
import Bookmark from '@material-ui/icons/BookmarkBorder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWindowDimensions from "../Components/useWindowDimensions"

function BookmarkFunc() {
    const [bookmarkNameInput, setBookmarkNameInput] = useState("")
    const {height, width}=useWindowDimensions();

    const{globalBookmarkKey}=useContext(GlobalContext)
    const[globalBookmarked,setGlobalBookmarked]=globalBookmarkKey
    const{globalbusstopcodeKey}=useContext(GlobalContext)
    const[globalbusstopcode,setGlobalbusstopcode]=globalbusstopcodeKey
    const{globalbusstopcodeNearbyKey}=useContext(GlobalContext)
    const[globalbusstopcodeNearby,setGlobalbusstopcodeNearby]=globalbusstopcodeNearbyKey
    const{globalbusstopcodeBMKey}=useContext(GlobalContext)
    const[globalbusstopcodeBM,setGlobalbusstopcodeBM]=globalbusstopcodeBMKey
    const{globalisBookmarkKey}=useContext(GlobalContext)
    const[globalisBookmarked,setGlobalisBookmarked]=globalisBookmarkKey
    const{globalTabToggleKey}=useContext(GlobalContext)
    const[globalTabToggle,setGlobalTabToggle]=globalTabToggleKey
    const{globalFullBusstopListKey}=useContext(GlobalContext)
    const[globalFullBusstopList,setGlobalFullBusstopList]=globalFullBusstopListKey
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey

    function updateBookmarkNameInput(event){
        setBookmarkNameInput(event.target.value);
    }

    const checkifBookemarked=()=>{
        let ifExist
        if (globalTabToggle==1){
            ifExist = globalBookmarked.some( bookmark=> bookmark.BusStopCode == globalbusstopcode[0].busstopcode);
        }else if(globalTabToggle==3){
            ifExist = globalBookmarked.some( bookmark=> bookmark.BusStopCode == globalbusstopcodeNearby[0].busstopcode);
        }else if(globalTabToggle==2){
            ifExist = globalBookmarked.some( bookmark=> bookmark.BusStopCode == globalbusstopcodeBM[0].busstopcode);
        }else{
            console.log("error")
        }
        if (ifExist==true){
            setGlobalisBookmarked(true)
        }else{
            setGlobalisBookmarked(false)
        }
    }
    useEffect(checkifBookemarked,[globalbusstopcode, globalbusstopcodeNearby, globalbusstopcodeBM])

    function bookmarkClickremove(event){
        event.preventDefault();
        
        //remove from bookmarks
        const output=globalBookmarked.filter((value)=>{
            if (globalTabToggle==1){
                return (value.BusStopCode.toLowerCase()!=globalbusstopcode[0].busstopcode);
            }else if(globalTabToggle==2){
                return (value.BusStopCode.toLowerCase()!=globalbusstopcodeBM[0].busstopcode);
            }else{
                return (value.BusStopCode.toLowerCase()!=globalbusstopcodeNearby[0].busstopcode);
            }
        });
        setGlobalBookmarked(output)
        localStorage.removeItem("bookmarkedBusstops")
        localStorage.setItem("bookmarkedBusstops",JSON.stringify(output))
        setGlobalisBookmarked(false)
        setGlobalbusstopcodeBM([{
            "busstopcode":"",
            "description": "",
            "lat": "",
            "lng": "",
        }])
        if(globalDarkMode){
            toast.success('Bookmark removed', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }else{
            toast.success('Bookmark removed', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    function bookmarkClickCancel(event){
        setBookmarkNameInput("")
    }

    function bookmarkClickadd(event){
        event.preventDefault();
        //add to bookmarks
        let snapshotBookmark=globalBookmarked
        let busStopCodeAdd=""
        if (globalTabToggle==1){
            busStopCodeAdd=globalbusstopcode[0].busstopcode
        }else if(globalTabToggle==2){
            busStopCodeAdd=globalbusstopcodeBM[0].busstopcode
        }else if(globalTabToggle==3){
            busStopCodeAdd=globalbusstopcodeNearby[0].busstopcode
        }else{
            if(globalDarkMode){
                toast.error('Bookmark cannot be added. Please try again', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }else{
                toast.error('Bookmark cannot be added. Please try again', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
        if(busStopCodeAdd!=""){
            const busExtracted=globalFullBusstopList.filter((value)=>{
                return (value.BusStopCode.toLowerCase()==busStopCodeAdd.toLowerCase());
            });
            const toAdd={
                "CustomName": bookmarkNameInput,
                "BusStopCode": busStopCodeAdd,
                "RoadName": busExtracted[0].RoadName,
                "Description": busExtracted[0].Description,
                "Starred":[],
            }
            snapshotBookmark.push(toAdd)
            setGlobalBookmarked(snapshotBookmark)
            localStorage.removeItem("bookmarkedBusstops")
            localStorage.setItem("bookmarkedBusstops",JSON.stringify(snapshotBookmark))
            setGlobalisBookmarked(true)
            setBookmarkNameInput("")
            if(globalDarkMode){
                toast.success('Bookmark added', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }else{
                toast.success('Bookmark added', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    }

    return (
        <>
            {
                globalisBookmarked==true?(
                    <BookmarkFilled id={globalDarkMode ? "bookmarkIconD":"bookmarkIcon"} onClick={bookmarkClickremove}></BookmarkFilled>
                ):(
                    <Bookmark data-bs-toggle="modal" data-bs-target="#exampleModal" id={globalDarkMode ? "bookmarkIconD":"bookmarkIcon"}></Bookmark>
                )
            }
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class={globalDarkMode ? "modal-content colorModalD":"modal-content colorModal"}>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Add bookmark</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={bookmarkClickCancel}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                {
                                    width<=550?(
                                        <>
                                        <ul className="ulpadmag">
                                            <li className="BusTime2 infoNote">Add a bookmark name to easily identify bus stop.</li>
                                        </ul>
                                        </>
                                    ):(
                                        <label className="BusTime2">Add a bookmark name to easily identify bus stop.</label>
                                    )
                                }
                                <br></br>
                                <label className="BusTime2">Bookmark name:</label>
                                <input type="text" maxLength="25" class="form-control" id={globalDarkMode ?"exampleInputEmail1D":"exampleInputEmail1"} placeholder="Input bookmark name" value={bookmarkNameInput} onChange={updateBookmarkNameInput} />
                            </div>
                        </div>                                              
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" onClick={bookmarkClickCancel}>Cancel</button>
                            <button type="button" class="btn btn-success" data-bs-dismiss="modal" onClick={bookmarkClickadd}>Add</button>
                         </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookmarkFunc
