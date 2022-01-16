import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import useWindowDimensions from "../Components/useWindowDimensions"
import '../assets/css/home.css'
import '../assets/css/homeD.css'
import LoadingScreen from "../Components/loadingScreen";
import axios from 'axios'
import Navbar from '../Components/Sidebar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import geolocation from "../hooks/useGeoLocation.js";
import { getDistance, isPointWithinRadius } from 'geolib';
import Searchtab from "../Components/Searchtab"
import Bookmarktab from "../Components/Bookmarktab"
import Nearbytab from "../Components/Nearbytab"
import Refresh from "@material-ui/icons/Refresh";

function Home(props){
    const location=geolocation();

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
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    const{globalSearchRadiusKey}=useContext(GlobalContext)
    const[globalSearchRadius,setGlobalSearchRadius]=globalSearchRadiusKey
    const{globalLocationKey}=useContext(GlobalContext)
    const[globalLocation,setGlobalLocation]=globalLocationKey
    const{globalIsLoadingKey}=useContext(GlobalContext)
    const[globalisLoading,setGlobalIsLoading]=globalIsLoadingKey
    const{globalShowBusRouteKey}=useContext(GlobalContext)
    const[globalShowBusRoute, setGlobalShowBusRoute]=globalShowBusRouteKey
    const{globalIsLoopKey}=useContext(GlobalContext)
    const[globalIsLoop, setGlobalIsLoop]=globalIsLoopKey
    const{globalTriggerLocationRefreshKey}=useContext(GlobalContext)
    const[globalTriggerLocationRefresh, setGlobalTriggerLocationRefresh]=globalTriggerLocationRefreshKey

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
        //retrieve search radius settings
        const retrieveSearchRTmp=localStorage.getItem('tripsgradius');
        const retrieveSearchR=JSON.parse(retrieveSearchRTmp);
        if(retrieveSearchR!=null){
            setGlobalSearchRadius(retrieveSearchR.radius)
        }
        const radius=globalSearchRadius //in metres
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
        setGlobalLocation(location)
    }
    useEffect(findNearestBusStops,[location, globalFullBusstopList])

    const URL='https://tripsg-db.herokuapp.com/api/busstops/'
    const loadBusstopsData=()=>{
        if(globalFullBusstopList==""){
            const retrieveBusStopListTmp=localStorage.getItem('busstoplistdata');
            const retrieveBusStopList=JSON.parse(retrieveBusStopListTmp);
            //check if retrieved already 
            if(retrieveBusStopList!=null && retrieveBusStopList.lastUpdate>=new Date().setHours(0,0,0,0)){
                setGlobalFullBusstopList(retrieveBusStopList.data)
                findNearestBusStops()
            }else{
                setGlobalIsLoading(true)
                axios.get(URL).then(res=>{
                    setGlobalFullBusstopList(res.data.data)
                    findNearestBusStops()
                    let now=new Date()
                    const toLocalStorageBusstopList={
                        "lastUpdate":now.setHours(0,0,0,0),
                        "data":res.data.data
                    }
                    localStorage.removeItem("busstoplistdata")
                    localStorage.setItem("busstoplistdata",JSON.stringify(toLocalStorageBusstopList))
                    setGlobalIsLoading(false)
                }).catch(error=>{
                    console.log("failed to load full bus stop list")
                    setGlobalIsLoading(false)
                })
            }
        }
    }
    useEffect(loadBusstopsData,[])

    function nearbyClick(event){
        updateGlobalTabToggle(3)
        setGlobalShowBusRoute(false)
        setGlobalIsLoop(false)
        setGlobalbusstopcodeNearby([{
            "busstopcode":"",
            "description": "",
            "lat": "",
            "lng": "",
        }])
    }

    function bookmarkClick(event){
        updateGlobalTabToggle(2)
        setGlobalShowBusRoute(false)
        setGlobalIsLoop(false)
        setGlobalbusstopcodeBM([{
            "busstopcode":"",
            "description": "",
            "lat": "",
            "lng": "",
        }])
    }

    function searchClick(event){
        updateGlobalTabToggle(1)
        setGlobalShowBusRoute(false)
        setGlobalIsLoop(false)
        setGlobalbusstopcode([{
            "busstopcode":"",
            "description": "",
            "lat": "",
            "lng": "",
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

    const refreshNearby=()=>{
        setGlobalTriggerLocationRefresh(true)
        //retrieve search radius settings
        const retrieveSearchRTmp=localStorage.getItem('tripsgradius');
        const retrieveSearchR=JSON.parse(retrieveSearchRTmp);
        if(retrieveSearchR!=null){
            setGlobalSearchRadius(retrieveSearchR.radius)
        }
        const radius=globalSearchRadius //in metres
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
        setGlobalLocation(location)

        if(globalDarkMode){
            toast.success('Nearby bus stops refreshed', {
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
            toast.success('Nearby bus stops refreshed', {
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

    return(
        <div className={globalDarkMode ? "fullbgHomeD":"fullbgHome"}>
            {
                globalisLoading?
                <LoadingScreen />:null
            }
            <ToastContainer />
            <Navbar></Navbar>
            
            <div className="leftmargin background">
                <div className={width<901?(globalDarkMode?"bgD":"bg"):(globalDarkMode?"bgComD":"bgCom")}>

                    <div className="bordertop">
                        <div style={{display:"flex"}}>
                                <ul className={globalDarkMode?"nav nav-tabs topLineTabD":"nav nav-tabs"}>
                                    <li className="nav-item">
                                        <a className={globalTabToggle==1?(globalDarkMode?"nav-link active navLinkActiveD":"nav-link active"):(globalDarkMode?"nav-link navLinkD":"nav-link")} aria-current="page" href="#" onClick={searchClick}>Search</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={globalTabToggle==2?(globalDarkMode?"nav-link active navLinkActiveD":"nav-link active"):(globalDarkMode?"nav-link navLinkD":"nav-link")} href="#" onClick={bookmarkClick}>Bookmark</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className={globalTabToggle==3?(globalDarkMode?"nav-link active navLinkActiveD":"nav-link active"):(globalDarkMode?"nav-link navLinkD":"nav-link")} href="#" onClick={nearbyClick}>Nearby</a>
                                    </li>
                                </ul>
                                {
                                    globalTabToggle==3&&globalbusstopcodeNearby[0].busstopcode==""?(
                                        <a href="#" onClick={refreshNearby} style={{alignItems:"flex-end", marginLeft:"auto", marginTop:"10px"}}><Refresh id={globalDarkMode?"refreshNearbyD":"refreshNearby"}></Refresh></a>
                                    ):(
                                        <></>
                                    )
                                }
                        </div>
                        
                        <div className={globalDarkMode ? "tabbgD":"tabbg"}>
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