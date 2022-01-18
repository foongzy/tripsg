import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Icons import
import StarFilled from '@material-ui/icons/Star';
import Star from '@material-ui/icons/StarBorder';

function StarFunc({BusNum}) {
    const [isStar, setIsStar] = useState(false)
    const [activeBM, setActiveBM] = useState([
        {
            "CustomName": "",
            "BusStopCode": "",
            "RoadName": "",
            "Description": "",
            "Starred":[],
        }
    ])

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
        let ifExist
        if (globalTabToggle==1){
            ifExist = globalBookmarked.some( bookmark=> bookmark.BusStopCode.toLowerCase() == globalbusstopcode[0].busstopcode.toLowerCase());
        }else if(globalTabToggle==3){
            ifExist = globalBookmarked.some( bookmark=> bookmark.BusStopCode.toLowerCase() == globalbusstopcodeNearby[0].busstopcode.toLowerCase());
        }else if(globalTabToggle==2){   
            ifExist = globalBookmarked.some( bookmark=> bookmark.BusStopCode.toLowerCase() == globalbusstopcodeBM[0].busstopcode.toLowerCase());
        }else{
            console.log("error")
        }
        if(ifExist){
            //filter out active bookmark
            let activeBookmark
            if (globalTabToggle==1){
                activeBookmark=globalBookmarked.filter((value)=>{
                    return (value.BusStopCode.toLowerCase()==globalbusstopcode[0].busstopcode.toLowerCase());
                });
            }else if(globalTabToggle==2){
                activeBookmark=globalBookmarked.filter((value)=>{
                    return (value.BusStopCode.toLowerCase()==globalbusstopcodeBM[0].busstopcode.toLowerCase());
                });
            }else if(globalTabToggle==3){
                activeBookmark=globalBookmarked.filter((value)=>{
                    return (value.BusStopCode.toLowerCase()==globalbusstopcodeNearby[0].busstopcode.toLowerCase());
                });
            }else{
                console.log("error")
            }
            setActiveBM(activeBookmark)
            const ifStar = activeBookmark[0].Starred.includes(BusNum)
            setIsStar(ifStar)
        }
    }
    useEffect(checkifStar,[globalbusstopcode, globalbusstopcodeBM, globalbusstopcodeNearby, globalArrivalData])

    function removeStar(event){
        event.preventDefault();
        //remove star
        let snapshotBookmark=activeBM

        let bookmarkEdit
        if (globalTabToggle==1){
            bookmarkEdit=globalbusstopcode[0].busstopcode
        }else if(globalTabToggle==2){
            bookmarkEdit=globalbusstopcodeBM[0].busstopcode
        }else if(globalTabToggle==3){
            bookmarkEdit=globalbusstopcodeNearby[0].busstopcode
        }else{
            console.log("error")
        }
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
        let bookmarkEdit
        if (globalTabToggle==1){
            bookmarkEdit=globalbusstopcode[0].busstopcode
        }else if(globalTabToggle==2){
            bookmarkEdit=globalbusstopcodeBM[0].busstopcode
        }else if(globalTabToggle==3){
            bookmarkEdit=globalbusstopcodeNearby[0].busstopcode
        }else{
            console.log("error")
        }
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
