import React, {useContext, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../Resources/GlobalContext.js";
import useWindowDimensions from "../Components/useWindowDimensions"
import '../assets/css/home.css'
import LoadingScreen from "../Components/loadingScreen";

import axios from 'axios'
import Navbar from '../Components/Sidebar'
import Refresh from '@material-ui/icons/Refresh';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BusIconBlack from '../assets/img/busIconBlack.png'

import geolocation from "../hooks/useGeoLocation.js";
import { getDistance, orderByDistance, isPointWithinRadius } from 'geolib';
import Searchtab from "../Components/Searchtab"
import Bookmarktab from "../Components/Bookmarktab"
import Nearbytab from "../Components/Nearbytab"

function Home(props){
    const location=geolocation();
    const [isLoading, setLoading] = useState(false)

    const{globalSearchWordKey}=useContext(GlobalContext)
    const[globalSearchWord,setGlobalSearchWord]=globalSearchWordKey
    const{globalFilteredDataKey}=useContext(GlobalContext)
    const[globalFilteredData,setGlobalFilteredData]=globalFilteredDataKey
    const{globalArrivalDataKey}=useContext(GlobalContext)
    const[globalArrivalData,setGlobalArrivalData]=globalArrivalDataKey
    const{globalbusstopcodeKey}=useContext(GlobalContext)
    const[globalbusstopcode,setGlobalbusstopcode]=globalbusstopcodeKey
    const{globalNearbyBusStopsKey}=useContext(GlobalContext)
    const[globalnearbyBusStops,setGlobalNearbyBusStops]=globalNearbyBusStopsKey
    const{globalTabToggleKey}=useContext(GlobalContext)
    const[globalTabToggle,setGlobalTabToggle]=globalTabToggleKey
    const{globalBookmarkKey}=useContext(GlobalContext)
    const[globalBookmarked,setGlobalBookmarked]=globalBookmarkKey
    const{globalFullBusstopListKey}=useContext(GlobalContext)
    const[globalFullBusstopList,setGlobalFullBusstopList]=globalFullBusstopListKey
    const{globalbusstopcodeBMKey}=useContext(GlobalContext)
    const[globalbusstopcodeBM,setGlobalbusstopcodeBM]=globalbusstopcodeBMKey
    const{globalbusstopcodeNearbyKey}=useContext(GlobalContext)
    const[globalbusstopcodeNearby,setGlobalbusstopcodeNearby]=globalbusstopcodeNearbyKey
    const{globalPgToggleKey}=useContext(GlobalContext)
    const[globalPgToggle,setGlobalPgToggle]=globalPgToggleKey
    const{globalTitleKey}=useContext(GlobalContext)
    const[globalTitle,setGlobalTitle]=globalTitleKey

    const {height, width}=useWindowDimensions();

    const updateGlobalNearbyBusStops=(data)=>{
        setGlobalNearbyBusStops(data)
    }

    const updateGlobalTabToggle=(val)=>{
        setGlobalTabToggle(val)
    }
    
    const updateGlobalBookmark=(val)=>{
        setGlobalBookmarked(val)
    }

    const findNearestBusStops=()=>{
        const radius=300 //in metres
        let nearbyBusStops=[]
        for (let i = 0; i < globalFullBusstopList.length; i++) {
            const coordinatesTest={
                latitude:globalFullBusstopList[i].Latitude,
                longitude:globalFullBusstopList[i].Longitude,
            };
            if(isPointWithinRadius(location.coordinates,coordinatesTest,radius)==true){
                nearbyBusStops.push(globalFullBusstopList[i])
            }
        }
        for (let j = 0; j < nearbyBusStops.length; j++) {
            const dist=getDistance(location.coordinates,{latitude:nearbyBusStops[j].Latitude,longitude:nearbyBusStops[j].Longitude})
            nearbyBusStops[j].distFromUser = dist;
        }
        //sort by dist
        nearbyBusStops.sort(function(a, b) {
            return parseFloat(a.distFromUser) - parseFloat(b.distFromUser);
        });
        updateGlobalNearbyBusStops(nearbyBusStops)
        console.log(nearbyBusStops)
        console.log(location)
    }
    useEffect(findNearestBusStops,[location])

    const URL='https://tripsg-db.herokuapp.com/api/busstops/'
    const loadBusstopsData=()=>{
        if(globalFullBusstopList==""){
            setLoading(true)
            axios.get(URL).then(res=>{
                setGlobalFullBusstopList(res.data.data)
                findNearestBusStops()
                setLoading(false)
            }).catch(error=>{
                console.log("error")
                setLoading(false)
            })
        }
    }
    useEffect(loadBusstopsData,[])

    function nearbyClick(event){
        updateGlobalTabToggle(3)
        setGlobalbusstopcodeNearby([{
            "busstopcode":"",
            "description": "",
        }])
    }

    function bookmarkClick(event){
        updateGlobalTabToggle(2)
        setGlobalbusstopcodeBM([{
            "busstopcode":"",
            "description": "",
        }])
    }

    function searchClick(event){
        updateGlobalTabToggle(1)
        setGlobalbusstopcode([{
            "busstopcode":"",
            "description": "",
        }])
    }

    //Initialise Bookmark
    const initialiseBookmark=()=>{
        const retrieveBookmarkTmp=localStorage.getItem('bookmarkedBusstops');
        const retrieveBookmark=JSON.parse(retrieveBookmarkTmp);
        if(retrieveBookmark!=null){
            updateGlobalBookmark(retrieveBookmark)
        }
    }
    useEffect(initialiseBookmark,[]);

    //Initialise sidebar display
    const initialiseSidebarDisplay=()=>{
        setGlobalPgToggle([{
            "isBusArrival":true,
            "isLocationPlanner":false,
            "isFeedback":false,
            "isAbout":false,
        }])
        setGlobalTitle("Bus Arrivals")
    }
    useEffect(initialiseSidebarDisplay,[]);

    return(
        <div>
            {
                isLoading?
                <LoadingScreen />:null
            }
            <ToastContainer />
            <Navbar></Navbar>
            
            <div className="leftmargin background">
                <div className={width<901?"bg":"bgCom"}>

                    <div class="bordertop"> 
                        <ul class="nav nav-tabs">
                            <li class="nav-item">
                                <a class={globalTabToggle==1?"nav-link active":"nav-link"} aria-current="page" href="#" onClick={searchClick}>Search</a>
                            </li>
                            <li class="nav-item">
                                <a class={globalTabToggle==2?"nav-link active":"nav-link"} href="#" onClick={bookmarkClick}>Bookmark</a>
                            </li>
                            <li class="nav-item">
                                <a class={globalTabToggle==3?"nav-link active":"nav-link"} href="#" onClick={nearbyClick}>Nearby</a>
                            </li>
                        </ul>
                        
                        <div className="tabbg">
                            {
                                globalTabToggle==1?(
                                    // Search tab
                                    <Searchtab />
                                ):(
                                    <div>
                                    {
                                        globalTabToggle==2?(
                                            // Bookmark tab
                                            <Bookmarktab />
                                        ):(
                                            // Nearby tab
                                            <Nearbytab />
                                        )
                                        
                                    }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home