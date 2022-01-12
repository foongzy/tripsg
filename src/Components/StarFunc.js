import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import StarFilled from '@material-ui/icons/Star';
import Star from '@material-ui/icons/StarBorder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWindowDimensions from "./useWindowDimensions"

function StarFunc({BusNum}) {
    const [isStar, setIsStar] = useState(false)
    const [activeBM, setActiveBM] = useState("")
    const {height, width}=useWindowDimensions();

    const{globalBookmarkKey}=useContext(GlobalContext)
    const[globalBookmarked,setGlobalBookmarked]=globalBookmarkKey
    const{globalbusstopcodeKey}=useContext(GlobalContext)
    const[globalbusstopcode,setGlobalbusstopcode]=globalbusstopcodeKey
    const{globalbusstopcodeNearbyKey}=useContext(GlobalContext)
    const[globalbusstopcodeNearby,setGlobalbusstopcodeNearby]=globalbusstopcodeNearbyKey
    const{globalbusstopcodeBMKey}=useContext(GlobalContext)
    const[globalbusstopcodeBM,setGlobalbusstopcodeBM]=globalbusstopcodeBMKey
    const{globalTabToggleKey}=useContext(GlobalContext)
    const[globalTabToggle,setGlobalTabToggle]=globalTabToggleKey
    const{globalFullBusstopListKey}=useContext(GlobalContext)
    const[globalFullBusstopList,setGlobalFullBusstopList]=globalFullBusstopListKey
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    const{globalArrivalDataKey}=useContext(GlobalContext)
    const[globalArrivalData,setGlobalArrivalData]=globalArrivalDataKey

    const checkifStar=()=>{
        //filter out active bookmark
        const activeBookmark=globalBookmarked.filter((value)=>{
            return (value.BusStopCode.toLowerCase()==globalbusstopcodeBM[0].busstopcode);
        });
        setActiveBM(activeBookmark)
        // const ifExist = globalBookmarked.some( bookmark=> bookmark.BusStopCode == globalbusstopcode[0].busstopcode);
        // const ifExistNearby = globalBookmarked.some( bookmark=> bookmark.BusStopCode == globalbusstopcodeNearby[0].busstopcode);
        const ifStar = activeBookmark[0].Starred.includes(BusNum)
        setIsStar(ifStar)
    }
    useEffect(checkifStar,[globalbusstopcodeBM, globalArrivalData])

    function removeStar(event){
        event.preventDefault();
        //remove star
        let snapshotBookmark=activeBM
        const bookmarkEdit=globalbusstopcodeBM[0].busstopcode
        let snapshotStar=snapshotBookmark[0].Starred
        const index = snapshotStar.indexOf(BusNum);
        if (index !== -1) {
            snapshotStar.splice(index, 1);
        }
        snapshotBookmark[0].Starred=snapshotStar
        //Find all other bookmarks and add in updated bookmark with removed star
        const bookmarkFinal=globalBookmarked.filter((value)=>{
            return (value.BusStopCode.toLowerCase()!=bookmarkEdit.toLowerCase());
        });
        bookmarkFinal.push(snapshotBookmark[0])
        setGlobalBookmarked(bookmarkFinal)
        setActiveBM(snapshotBookmark)
        setIsStar(false)
        
        localStorage.removeItem("bookmarkedBusstops")
        localStorage.setItem("bookmarkedBusstops",JSON.stringify(bookmarkFinal))
        if(globalDarkMode){
            toast.success('Removed '+BusNum+' from starred', {
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
            toast.success('Removed '+BusNum+' from starred', {
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

    function addStar(event){
        event.preventDefault();
        //add to star
        let snapshotBookmark=activeBM
        const bookmarkEdit=globalbusstopcodeBM[0].busstopcode
        let snapshotStar=snapshotBookmark[0].Starred
        snapshotStar.push(BusNum)
        snapshotBookmark[0].Starred=snapshotStar
        //Find all other bookmarks and add in updated bookmark with star
        const bookmarkFinal=globalBookmarked.filter((value)=>{
            return (value.BusStopCode.toLowerCase()!=bookmarkEdit.toLowerCase());
        });
        bookmarkFinal.push(snapshotBookmark[0])
        setGlobalBookmarked(bookmarkFinal)
        setActiveBM(snapshotBookmark)
        setIsStar(true)
        
        localStorage.removeItem("bookmarkedBusstops")
        localStorage.setItem("bookmarkedBusstops",JSON.stringify(bookmarkFinal))
        if(globalDarkMode){
            toast.success('Successfully starred '+BusNum, {
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
            toast.success('Successfully starred '+BusNum, {
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

    return (
        <>
        {
            isStar==true?(
                <a href="#"><StarFilled id={globalDarkMode ? "starIconD":"starIcon"} onClick={removeStar}></StarFilled></a>
            ):(
                <a href="#"><Star id={globalDarkMode ? "starIconD":"starIcon"} onClick={addStar}></Star></a>
            )
        }
        </>
    )
}

export default StarFunc
