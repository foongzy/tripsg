import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import useWindowDimensions from "../Components/useWindowDimensions"
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import geolocation from "../hooks/useGeoLocation.js";
import BusArrivalInfoFunc from "./BusArrivalInfoFunc.js";
import MapFunc from "./MapFunc.js";
import Star from "./StarFunc.js"
import Bookmark from './BookmarkFunc'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import BusIconBlack from '../assets/img/busIconBlack.png'
import BusIconBlack2 from '../assets/img/busIconBlue2.png'

//Icons import
import Refresh from '@material-ui/icons/Refresh';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import WheelChair from '@material-ui/icons/Accessible';
import Location from '@material-ui/icons/LocationOn';
import InfoIcon from '@material-ui/icons/InfoOutlined';

function Nearbytab() {
    const location=geolocation();

    const {height, width}=useWindowDimensions();
    const URL='https://tripsg.pythonanywhere.com/api/busstops/'

    const [activeBookmark, setActiveBookmark]=useState([
        {
            "CustomName": "",
            "BusStopCode": "",
            "RoadName": "",
            "Description": "",
            "Starred":[],
        }
    ])
    const [showBusRoute, setShowBusRoute] = useState(false)
    const [currentBusStopSeq, setCurrentBusStopSeq] = useState("")
    const [currentBusDets, setCurrentBusDets] = useState("")
    const [currentTotalBusStop, setCurrentTotalBusStop] = useState(0)
    const [extractedBusDets, setExtractedBusDets] = useState("")
    const [busNumState,setBusNum]=useState("")
    const [isLoop,setIsLoop]=useState(false)

    const{globalArrivalDataKey}=useContext(GlobalContext)
    const[globalArrivalData,setGlobalArrivalData]=globalArrivalDataKey
    const{globalbusstopcodeNearbyKey}=useContext(GlobalContext)
    const[globalbusstopcodeNearby,setGlobalbusstopcodeNearby]=globalbusstopcodeNearbyKey
    const{globalNearbyBusStopsKey}=useContext(GlobalContext)
    const[globalnearbyBusStops,setGlobalNearbyBusStops]=globalNearbyBusStopsKey
    const{globalFullBusstopListKey}=useContext(GlobalContext)
    const[globalFullBusstopList,setGlobalFullBusstopList]=globalFullBusstopListKey
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    const{globalisBookmarkKey}=useContext(GlobalContext)
    const[globalisBookmarked,setGlobalisBookmarked]=globalisBookmarkKey
    const{globalBookmarkKey}=useContext(GlobalContext)
    const[globalBookmarked,setGlobalBookmarked]=globalBookmarkKey
    const{globalIsLoadingKey}=useContext(GlobalContext)
    const[globalisLoading,setGlobalIsLoading]=globalIsLoadingKey

    function toastError(errorMsg){
        if(globalDarkMode){
            toast.error(errorMsg, {
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
            toast.error(errorMsg, {
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

    const sortArrivalData=(starArray, arrivalData)=>{
        let snapshotArrivalData=arrivalData
        let starArr=[]
        let notstarArr=[]
        //split arrival data into star and no star
        for (let i = 0; i < snapshotArrivalData.length; i++) {
            //check if star
            const isStar = starArray.includes(snapshotArrivalData[i].ServiceNo)
            const busArrivalDets=snapshotArrivalData.filter((value)=>{
                return (value.ServiceNo.toLowerCase()==snapshotArrivalData[i].ServiceNo.toLowerCase());
            });
            if(isStar){
                //starred
                starArr.push(busArrivalDets[0])
            }else{
                //not starred
                notstarArr.push(busArrivalDets[0])
            }
        }

        //sort star
        starArr.sort(function(a, b) {
            return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
        });
        //sort no star
        notstarArr.sort(function(a, b) {
            return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
        });
        
        //combine
        let sorted=starArr.concat(notstarArr)
        return sorted
    }

    function getBusArrival(code){
        const URLbusArrival=URL+code+"/"
        const ifExistNearby = globalBookmarked.some( bookmark=> bookmark.BusStopCode == code);
        setGlobalIsLoading(true)
        axios.get(URLbusArrival).then(res=>{
            let obtainedData=res.data.Services

            //Sort bus numbers
            if(ifExistNearby){
                //Find bookmark bus stop details from selection
                const bookmarkExtracted=globalBookmarked.filter((value)=>{
                    return (value.BusStopCode.toLowerCase()==res.data.BusStopCode.toLowerCase());
                });
                setActiveBookmark(bookmarkExtracted)

                //Sort
                obtainedData=sortArrivalData(bookmarkExtracted[0].Starred, obtainedData)
            }else{
                obtainedData.sort(function(a, b) {
                    return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
                });
            }

            //Calculating time to bus
            const dateTimeNow=Date.now()
            for (let i = 0; i < obtainedData.length; i++) {
                let time=[]
                const busDateTime1=Date.parse(obtainedData[i].NextBus.EstimatedArrival)
                const busDateTime2=Date.parse(obtainedData[i].NextBus2.EstimatedArrival)
                const busDateTime3=Date.parse(obtainedData[i].NextBus3.EstimatedArrival)
                time.push(Math.floor((busDateTime1-dateTimeNow)/(60000)))
                time.push(Math.floor((busDateTime2-dateTimeNow)/(60000)))
                time.push(Math.floor((busDateTime3-dateTimeNow)/(60000)))
                for (let j = 0; j < time.length; j++) {
                    if(time[j]<=0){
                        time[j]="Arriving"
                    }else{
                        time[j]=time[j]+'min'
                    }
                }
                obtainedData[i].NextBus.EstimatedArrival=time[0]
                obtainedData[i].NextBus2.EstimatedArrival=time[1]
                obtainedData[i].NextBus3.EstimatedArrival=time[2]
            }
            setGlobalArrivalData(obtainedData)

            //Find bus stop details using bus stop code
            const busExtracted=globalFullBusstopList.filter((value)=>{
                return (value.BusStopCode.toLowerCase()==res.data.BusStopCode.toLowerCase());
            });

            setGlobalbusstopcodeNearby([{
                "busstopcode":res.data.BusStopCode,
                "description": busExtracted[0].Description,
                "lat": busExtracted[0].Latitude,
                "lng": busExtracted[0].Longitude,
            }])
            setGlobalIsLoading(false)
        }).catch(error=>{
            setGlobalIsLoading(false)
            toastError('Server error. Please try again')
        })   
    }

    function refreshClick(event){
        event.preventDefault();
        const URLbusArrival=URL+globalbusstopcodeNearby[0].busstopcode+"/"
        setGlobalIsLoading(true)
        axios.get(URLbusArrival).then(res=>{
            let obtainedData=res.data.Services

            //Sort bus numbers
            if(globalisBookmarked){
                obtainedData=sortArrivalData(activeBookmark[0].Starred, obtainedData)
            }else{
                obtainedData.sort(function(a, b) {
                    return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
                });
            }

            //Calculating time to bus
            const dateTimeNow=Date.now()
            for (let i = 0; i < obtainedData.length; i++) {
                let time=[]
                const busDateTime1=Date.parse(obtainedData[i].NextBus.EstimatedArrival)
                const busDateTime2=Date.parse(obtainedData[i].NextBus2.EstimatedArrival)
                const busDateTime3=Date.parse(obtainedData[i].NextBus3.EstimatedArrival)
                time.push(Math.floor((busDateTime1-dateTimeNow)/(60000)))
                time.push(Math.floor((busDateTime2-dateTimeNow)/(60000)))
                time.push(Math.floor((busDateTime3-dateTimeNow)/(60000)))
                for (let j = 0; j < time.length; j++) {
                    if(time[j]<=0){
                        time[j]="Arriving"
                    }else{
                        time[j]=time[j]+'min'
                    }
                }
                obtainedData[i].NextBus.EstimatedArrival=time[0]
                obtainedData[i].NextBus2.EstimatedArrival=time[1]
                obtainedData[i].NextBus3.EstimatedArrival=time[2]
            }
            setGlobalArrivalData(obtainedData)

            //Find bus stop details using bus stop code
            const busExtracted=globalFullBusstopList.filter((value)=>{
                return (value.BusStopCode.toLowerCase()==res.data.BusStopCode.toLowerCase());
            });

            setGlobalbusstopcodeNearby([{
                "busstopcode":res.data.BusStopCode,
                "description": busExtracted[0].Description,
                "lat": busExtracted[0].Latitude,
                "lng": busExtracted[0].Longitude,
            }])
            setGlobalIsLoading(false)
            if(globalDarkMode){
                toast.success('Refresh successful', {
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
                toast.success('Refresh successful', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }).catch(error=>{
            setGlobalIsLoading(false)
            toastError('Server error')
        })
    }

    function clickBack(event){
        if(showBusRoute==true){
            setShowBusRoute(false)
            setIsLoop(false)
        }else{
            setGlobalbusstopcodeNearby([{
                "busstopcode": "",
                "description": "",
                "lat": "",
                "lng": "",
            }])
            setGlobalArrivalData([])
        }
    }

    const starSort=()=>{
        const ifExist = globalBookmarked.some( bookmark=> bookmark.BusStopCode == globalbusstopcodeNearby[0].busstopcode);
        if(ifExist){
            let snapshotArrivalData=globalArrivalData
            let starArray=activeBookmark[0].Starred
            let starArr=[]
            let notstarArr=[]
            //split arrival data into star and no star
            for (let i = 0; i < snapshotArrivalData.length; i++) {
                //check if star
                const isStar = starArray.includes(snapshotArrivalData[i].ServiceNo)
                const busArrivalDets=snapshotArrivalData.filter((value)=>{
                    return (value.ServiceNo.toLowerCase()==snapshotArrivalData[i].ServiceNo.toLowerCase());
                });
                if(isStar){
                    //starred
                    starArr.push(busArrivalDets[0])
                }else{
                    //not starred
                    notstarArr.push(busArrivalDets[0])
                }
            }

            //sort star
            starArr.sort(function(a, b) {
                return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
            });
            //sort no star
            notstarArr.sort(function(a, b) {
                return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
            });
            
            //combine
            let sorted=starArr.concat(notstarArr)
            setGlobalArrivalData(sorted )
        }
    }
    useEffect(starSort,[globalBookmarked])

    const InfoClickBusRoute=(BusNum)=>{
        const URL="https://tripsg.pythonanywhere.com/api/busroutes/"+BusNum+"/"+globalbusstopcodeNearby[0].busstopcode+"/"
        setGlobalIsLoading(true)
        axios.get(URL).then(res=>{
            setCurrentBusStopSeq(res.data.currentStopSeq)
            let busstoproutelist=res.data.data
            for (let i = 0; i < busstoproutelist.length; i++) {
                //Find bus stop details using bus stop code
                const busExtracted=globalFullBusstopList.filter((value)=>{
                    return (value.BusStopCode.toLowerCase()==busstoproutelist[i].BusStopCode.toLowerCase());
                });
                busstoproutelist[i]["busStopDescription"] = busExtracted[0].Description
                if(res.data.currentStopSeq==busstoproutelist[i].StopSequence){
                    setExtractedBusDets(busstoproutelist[i])
                }
            }
            if(busstoproutelist[0].BusStopCode==busstoproutelist[busstoproutelist.length-1].BusStopCode){
                setIsLoop(true)
            }
            setCurrentBusDets(busstoproutelist)
            setCurrentTotalBusStop(busstoproutelist.length)
            setShowBusRoute(true)
            setBusNum(BusNum)
            setGlobalIsLoading(false)
        }).catch(error=>{
            toastError('Error loading bus route details')
            setGlobalIsLoading(false)
        })
    }

    return (
        <div>
            {
                globalbusstopcodeNearby[0].busstopcode!=''?(
                    <div>
                        <div className="container-fluid line">
                            <nav class="navbar navbar-expand-lg navbar-light">
                                <label class="navbar-brand leftLabel">
                                    <a href="#" className={globalDarkMode ? "arrowIconD":"arrowIcon"}><ArrowBack onClick={clickBack}></ArrowBack></a>
                                    <label className={globalDarkMode ? "busLabelD":""} style={{marginRight:"15px"}}>Bus Stop: {globalbusstopcodeNearby[0].description} ({globalbusstopcodeNearby[0].busstopcode})</label>
                                    <a href="#" style={{marginLeft:"-4px"}}><Bookmark></Bookmark></a>
                                    <a href="#" ><MapFunc></MapFunc></a>
                                    <a href="#" ><BusArrivalInfoFunc></BusArrivalInfoFunc></a>
                                    <a href="#" onClick={refreshClick}><Refresh id={globalDarkMode ? "refreshIconD":"refreshIcon"}></Refresh></a>
                                </label>
                                <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                    </ul>
                                    <form class={width>991?"d-flex":"container-fluid"} style={{padding:"0px"}}>
                                    </form>
                                </div>
                            </nav>
                        </div>
                        {
                            showBusRoute==true?(
                                <div style={{paddingLeft:"10px", paddingRight:"10px", marginTop:"10px"}}>
                                    <div className="row">
                                    <div className="col-sm-6" style={{marginTop:"10px"}}>
                                            <div className="row container-fluid flbus">
                                                <div className={globalDarkMode ? "card cardRD":"card timingCard"}>
                                                    <h4 className={globalDarkMode ?"card-title busrouteD":"card-title busroute"}>Bus {busNumState} Info</h4>
                                                    {
                                                       isLoop?(
                                                            <div className={globalDarkMode ?"busrouteD":"busroute"} style={{marginTop:"-8px", marginBottom:"8px"}}>Loop Service</div>
                                                       ):(
                                                            <></>
                                                       )
                                                   }
                                                    <div className={globalDarkMode ?"card-body cardbggD":"card-body timingoutline"}>
                                                        <div className="row">
                                                            <div className="col-6 borderBot rightDivider" style={{textAlign:"center"}}>
                                                                <label className="BusTime topmar">Weekdays</label>
                                                            </div>
                                                            <div className="col-6">
                                                                <label className="BusTime2">First Bus: {extractedBusDets.WD_FirstBus}</label>
                                                                <br></br>
                                                                <label className="BusTime2">Last Bus: {extractedBusDets.WD_LastBus}</label>                                                
                                                            </div>
                                                        </div>
                                                        <div className="row" style={{marginTop:"10px"}}>
                                                            <div className="col-6 borderBot rightDivider" style={{textAlign:"center"}}>
                                                                <label className="BusTime topmar">Saturday</label>
                                                            </div>
                                                            <div className="col-6">
                                                                <label className="BusTime2">First Bus: {extractedBusDets.SAT_FirstBus}</label>
                                                                <br></br>
                                                                <label className="BusTime2">Last Bus: {extractedBusDets.SAT_LastBus}</label>                                                
                                                            </div>
                                                        </div> 
                                                        <div className="row" style={{marginTop:"10px"}}>
                                                            <div className="col-6 borderBot rightDivider" style={{textAlign:"center"}}>
                                                                <label className="BusTime topmar">Sunday</label>
                                                            </div>
                                                            <div className="col-6">
                                                                <label className="BusTime2">First Bus: {extractedBusDets.SUN_FirstBus}</label>
                                                                <br></br>
                                                                <label className="BusTime2">Last Bus: {extractedBusDets.SUN_LastBus}</label>                                                
                                                            </div>
                                                        </div> 
                                                    </div>
                                                    <div className={globalDarkMode ?"busrouteD":"busroute"} style={{fontSize:"12px", marginTop:"5px"}}>Note: Timings displayed are for this bus stop</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6" style={{justifyContent:"center"}}>
                                            <Timeline position="left">
                                                {currentBusDets.map((value,key)=>{
                                                    return(
                                                        <div>
                                                            <TimelineItem>
                                                                <TimelineSeparator>
                                                                    <TimelineDot variant={value.StopSequence<currentBusStopSeq?"outlined":"filled"} color="primary" />
                                                                        {
                                                                            currentTotalBusStop-1==key?(
                                                                                <></>
                                                                            ):(
                                                                                <TimelineConnector />
                                                                            )
                                                                        }
                                                                    </TimelineSeparator>
                                                                <TimelineContent className={value.StopSequence<currentBusStopSeq?("busroute passed"):(globalDarkMode?"busrouteD":"busroute")}>{value.busStopDescription} ({value.BusStopCode})</TimelineContent>
                                                            </TimelineItem>
                                                        </div> 
                                                    )
                                                })}
                                            </Timeline>
                                        </div>
                                    </div>
                                </div>
                            ):(
                                // {/* bus arrivals */}
                                <div className="row row-cols-1 row-cols-sm-2 g-0 topMargin" style={{paddingLeft:"10px", paddingRight:"10px"}}>
                                    {globalArrivalData.map((value,key)=>{
                                        return(
                                            <div className="col">
                                                <div className={globalDarkMode ? "card cardRD":"card cardR"} style={{height:"100%", borderRadius:"0px"}}>
                                                    <div className={globalDarkMode ?"card-body cardbggD":"card-body"}>
                                                        <div className="row">
                                                            <div className="col-5 borderBot rightDivider" style={{textAlign:"center"}}>
                                                                <label className="BusNo">{value.ServiceNo}</label>
                                                            </div>
                                                            <div className="col-7">
                                                                <label className="BusTimeNoPad" style={{display:"flex", justifyContent:"space-between"}}>Next Bus:
                                                                    <a href="#" onClick={() => InfoClickBusRoute(value.ServiceNo)} id={globalDarkMode ? "inFoIconBRD":"inFoIconBR"} style={{marginLeft:"auto"}}><InfoIcon id="busRoouteInfoIcon"/></a>
                                                                    {
                                                                        globalisBookmarked?(
                                                                            <div style={{marginLeft:"2px"}}><Star BusNum={value.ServiceNo} style={{marginLeft:"auto"}}/></div>
                                                                        ):(
                                                                            <></>
                                                                        )
                                                                    }
                                                                </label>
                                                                <label className={value.NextBus2.Load=="SEA"?"BusTime empty":value.NextBus2.Load=="SDA"?"BusTime standing":"BusTime full"}>{value.NextBus.EstimatedArrival}{value.NextBus.Feature=="WAB"?<WheelChair className={globalDarkMode ? "WheelChairD":"WheelChair"}></WheelChair>:<></>}</label>
                                                                <label className={value.NextBus2.Load=="SEA"?"BusTime2 empty":value.NextBus2.Load=="SDA"?"BusTime2 standing":"BusTime2 full"}>{value.NextBus2.EstimatedArrival!="NaNmin"?value.NextBus2.EstimatedArrival:""}
                                                                {value.NextBus2.EstimatedArrival!="NaNmin"?(
                                                                    value.NextBus.Feature=="WAB"?<WheelChair className={globalDarkMode ? "WheelChair2D":"WheelChair2"}></WheelChair>:<></>
                                                                ):(
                                                                    <></>
                                                                )
                                                                }
                                                                </label>
                                                                <label className={value.NextBus2.Load=="SEA"?"BusTime2 empty":value.NextBus2.Load=="SDA"?"BusTime2 standing":"BusTime2 full"}>{value.NextBus3.EstimatedArrival!="NaNmin"?value.NextBus3.EstimatedArrival:""}
                                                                {value.NextBus3.EstimatedArrival!="NaNmin"?(
                                                                    value.NextBus.Feature=="WAB"?<WheelChair className={globalDarkMode ? "WheelChair2D":"WheelChair2"}></WheelChair>:<></>
                                                                ):(
                                                                    <></>
                                                                )
                                                                }
                                                                </label>
                                                            </div>
                                                        </div>        
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }
                    </div>
                ):(
                    // havent click bus stop
                    <div>
                        {
                            location.loaded==true?(
                                <div>
                                    {
                                        location.error==''?(
                                            <>
                                            {
                                                globalnearbyBusStops==''?(
                                                    //No bus stops nearby
                                                    <div class="container-fluid nearbytop" style={{textAlign:"center", justifyContent:"center"}}>
                                                        {globalDarkMode ?
                                                            <img src={BusIconBlack2} style={{height:"auto", width:"8rem", paddingTop:"10px"}} />
                                                            :
                                                            <img src={BusIconBlack} style={{height:"auto", width:"8rem", paddingTop:"10px"}} />
                                                        }
                                                        
                                                        <form class="container-fluid" style={{marginTop:"30px"}}>
                                                            <p className={globalDarkMode ?"otherLabelColD":""}>There are no bus stops nearby</p>
                                                        </form>
                                                    </div>
                                                ):(
                                                    // Show nearby busstops
                                                    <div className={width<950?"row row-cols-1 row-cols-sm-2 g-2 topMargin":"row row-cols-1 row-cols-sm-3 g-2 topMargin"}  style={{paddingLeft:"10px", paddingRight:"10px", marginTop:"0px", paddingTop:"0px"}}>
                                                        {globalnearbyBusStops.map((value,key)=>{
                                                            return(
                                                                <div className="col">
                                                                    <a href="javascript:void(0)" style={{color:"black", textDecoration:"none"}} onClick={()=>getBusArrival(value.BusStopCode)}>
                                                                        <div className={globalDarkMode?"card text-dark bg-dark mb-0 cardHover":"card text-dark bg-light mb-0 cardHover"} style={{height:"100%"}}>
                                                                            <div className={globalDarkMode ?"card-header cardHeaderBusStopD":"card-header cardHeaderBusStop"}>
                                                                                {value.Description} 
                                                                                <i style={{borderRadius:"50%", backgroundColor:"#5680E9", color:"white", float:"right", padding:"4px 5px", marginTop:"5px"}}><Location></Location></i>
                                                                                <div style={{fontSize:"14px"}}>{value.BusStopCode}</div>
                                                                            </div>
                                                                            <div className={globalDarkMode ? "card-body borderBodycardD":"card-body borderBodycard"}>
                                                                                <div className="row row-cols-1 row-cols-2 g-1">
                                                                                    <label className="card-text">{value.RoadName}</label>
                                                                                    <label className="card-text" style={{textAlign:"right"}}>{value.distFromUser}m</label>
                                                                                </div>        
                                                                            </div>
                                                                        </div>
                                                                    </a>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )
                                            }
                                                
                                            </>
                                        ):(
                                            //User disabled location
                                            <div class="container-fluid nearbytop" style={{textAlign:"center", justifyContent:"center"}}>
                                                {globalDarkMode ?
                                                    <img src={BusIconBlack2} style={{height:"auto", width:"8rem", paddingTop:"10px"}} />
                                                    :
                                                    <img src={BusIconBlack} style={{height:"auto", width:"8rem", paddingTop:"10px"}} />
                                                }
                                                
                                                <form class="container-fluid" style={{marginTop:"30px"}}>
                                                    <p className={globalDarkMode ?"otherLabelColD":""}>Please allow website to use your location to enable nearby service</p>
                                                </form>
                                            </div>
                                        )
                                    }
                                </div>
                            ):(
                                //Location still not loaded
                                <div class="container-fluid nearbytop" style={{textAlign:"center", justifyContent:"center"}}>
                                    {globalDarkMode ?
                                        <img src={BusIconBlack2} style={{height:"auto", width:"8rem", paddingTop:"10px"}} />
                                        :
                                        <img src={BusIconBlack} style={{height:"auto", width:"8rem", paddingTop:"10px"}} />
                                    }
                                    <form class="container-fluid" style={{marginTop:"30px"}}>
                                        <p className={globalDarkMode ?"otherLabelColD":""}>Loading your location...</p>
                                    </form>
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Nearbytab
