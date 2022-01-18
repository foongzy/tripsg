import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import useWindowDimensions from "../Components/useWindowDimensions"
import LoadingScreen from "../Components/loadingScreen";
import axios from 'axios'
import Navbar from '../Components/Sidebar'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/home.css'
import '../assets/css/homeD.css'
import geolocation from "../hooks/useGeoLocation.js";
import { getDistance, isPointWithinRadius } from 'geolib';
import Searchtab from "../Components/Searchtab"
import Bookmarktab from "../Components/Bookmarktab"
import Nearbytab from "../Components/Nearbytab"

//Icons import
import Refresh from "@material-ui/icons/Refresh";
import HelpIcon from '@material-ui/icons/HelpOutline'
import BookmarkFilled from '@material-ui/icons/Bookmark';
import BookmarkIcon from '@material-ui/icons/BookmarkBorder';
import StarFilled from '@material-ui/icons/Star';
import StarIcon from '@material-ui/icons/StarBorder';

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
        if(location.loaded==false){
            if(globalDarkMode){
                toast.error('Still loading location', {
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
                toast.error('Still loading location', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }else{

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
                                    globalTabToggle==1?(
                                        <a href="#" style={{alignItems:"flex-end", marginLeft:"auto", marginTop:"10px"}} data-bs-toggle="modal" data-bs-target="#searchHelpModal"><HelpIcon id={globalDarkMode?"helpSearchD":"helpSearch"}></HelpIcon></a>
                                    ):(
                                        <></>
                                    )
                                }
                                {
                                    globalTabToggle==2?(
                                        <a href="#" style={{alignItems:"flex-end", marginLeft:"auto", marginTop:"10px"}} data-bs-toggle="modal" data-bs-target="#bookmarkHelpModal"><HelpIcon id={globalDarkMode?"helpBookmarkD":"helpBookmark"}></HelpIcon></a>
                                    ):(
                                        <></>
                                    )
                                }
                                {
                                    globalTabToggle==3?(
                                        <div style={{alignItems:"flex-end", marginLeft:"auto", marginTop:"10px"}}>
                                            <a href="#" data-bs-toggle="modal" data-bs-target="#nearbyHelpModal" style={{marginRight:"3px"}}><HelpIcon id={globalDarkMode?"helpNearbyD":"helpNearby"}></HelpIcon></a>
                                            {
                                                globalbusstopcodeNearby[0].busstopcode==""?(
                                                    <a href="#" onClick={refreshNearby} data-bs-toggle="tooltip" data-bs-placement="bottom" title="Refresh nearby bus stops"><Refresh id={globalDarkMode?"refreshNearbyD":"refreshNearby"}></Refresh></a>
                                                ):(
                                                    <></>
                                                )
                                            }
                                        </div>
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
            {/* search modal */}
            <div class="modal fade" id="searchHelpModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content" id={globalDarkMode ?"searchModal":""}>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Search Methods</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <b>Quick Search</b>
                            <ul style={{marginBottom:"5px"}}>
                                <li>Leave search input empty and click search. Application will show bus arrivals for nearest bus stop</li>
                                <li>Type in bus number and click search. Application will show bus arrival for queried bus at nearest bus stop</li>
                            </ul>
                            <div style={{fontSize:"14px", marginLeft:"15px"}}>
                                Note:
                                <ul>
                                    <li>Location sharing must be enabled</li>
                                    <li>May not work for temporary bus stops due to limitations from LTA</li>
                                </ul>
                            </div>
                            <div className="botLine"></div>
                            <b>Normal Search</b>
                            <ul style={{marginBottom:"0px"}}>
                                <li>Search by typing in bus stop name or bus stop code</li>
                            </ul>
                        </div>
                        <div class="modal-footer">
                            <button type="button" className={globalDarkMode ? "btn btn-secondary bgbtnD":"btn btn-secondary bgbtn"} data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* bookmark modal */}
            <div class="modal fade" id="bookmarkHelpModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content" id={globalDarkMode ?"bmModal":""}>
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Bookmark</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <b>Adding Bookmarks</b>
                        <ul style={{marginBottom:"5px"}}>
                            <li>Search for bus stop and click on <BookmarkIcon></BookmarkIcon></li>
                            <li>Add a name for the bookmark if you like</li>
                            <li>Click the add button</li>
                        </ul>
                        <div className="botLine"></div>
                        <b>Removing Bookmarks</b>
                        <ul style={{marginBottom:"0px"}}>
                            <li>Search for bookmarked bus stop</li>
                            <li>Click on <BookmarkFilled></BookmarkFilled></li>
                        </ul>
                        <div className="botLine"></div>
                        <b>Starred Bus Services</b>
                        <ul style={{marginBottom:"0px"}}>
                            <li>Bookmarked bus stops allows you to star bus services by clicking <StarIcon></StarIcon></li>
                            <li>Starred services appear at the top</li>
                            <li>Remove star by clicking <StarFilled></StarFilled></li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class={globalDarkMode ? "btn btn-secondary bgbtnD":"btn btn-secondary bgbtn"} data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

            {/* nearby modal */}
            <div class="modal fade" id="nearbyHelpModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content" id={globalDarkMode ?"bmModal":""}>
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Nearby</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ul style={{marginBottom:"5px"}}>
                            <li>Shows all nearby bus stops based on your current location</li>
                            {
                                globalbusstopcodeNearby[0].busstopcode==""?(
                                    <li>Refresh nearby bus stops by clicking <Refresh id={globalDarkMode?"refreshNearbyD":"refreshNearby"}/> at the top right corner</li>
                                ):(
                                    <></>
                                )
                            }
                        </ul>
                        <div style={{fontSize:"14px", marginLeft:"15px"}}>
                            Note:
                            <ul>
                                <li>Location sharing must be enabled to use this service</li>
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class={globalDarkMode ? "btn btn-secondary bgbtnD":"btn btn-secondary bgbtn"} data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home