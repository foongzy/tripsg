import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import Refresh from '@material-ui/icons/Refresh';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import HelpIcon from '@material-ui/icons/HelpOutline'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWindowDimensions from "../Components/useWindowDimensions";
import BusIconBlack from '../assets/img/busIconBlack.png'
import BusIconBlack2 from '../assets/img/busIconBlue2.png'
import axios from 'axios'
import SearchBar from "../Components/SearchBar"
import Bookmark from './BookmarkFunc'
import WheelChair from '@material-ui/icons/Accessible';
import BusArrivalInfoFunc from "./BusArrivalInfoFunc.js";
import MapFunc from "./MapFunc.js";
import Star from "./StarFunc.js"
import InfoIcon from '@material-ui/icons/InfoOutlined';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { tabScrollButtonClasses } from "@mui/material";

function Searchtab() {
    const [showBusRoute, setShowBusRoute] = useState(false)
    const [currentBusStopSeq, setCurrentBusStopSeq] = useState("")
    const [currentBusDets, setCurrentBusDets] = useState("")
    const [currentTotalBusStop, setCurrentTotalBusStop] = useState(0)
    const [extractedBusDets, setExtractedBusDets] = useState("")
    const [busNumState,setBusNum]=useState("")
    const [isLoop,setIsLoop]=useState(false)

    const{globalSearchWordKey}=useContext(GlobalContext)
    const[globalSearchWord,setGlobalSearchWord]=globalSearchWordKey
    const{globalFilteredDataKey}=useContext(GlobalContext)
    const[globalFilteredData,setGlobalFilteredData]=globalFilteredDataKey
    const{globalArrivalDataKey}=useContext(GlobalContext)
    const[globalArrivalData,setGlobalArrivalData]=globalArrivalDataKey
    const{globalbusstopcodeKey}=useContext(GlobalContext)
    const[globalbusstopcode,setGlobalbusstopcode]=globalbusstopcodeKey
    const{globalRefreshToggleKey}=useContext(GlobalContext)
    const[globalRefreshToggle,setGlobalRefreshToggle]=globalRefreshToggleKey
    const{globalFullBusstopListKey}=useContext(GlobalContext)
    const[globalFullBusstopList,setGlobalFullBusstopList]=globalFullBusstopListKey
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    const{globalisBookmarkKey}=useContext(GlobalContext)
    const[globalisBookmarked,setGlobalisBookmarked]=globalisBookmarkKey
    const{globalBookmarkKey}=useContext(GlobalContext)
    const[globalBookmarked,setGlobalBookmarked]=globalBookmarkKey

    const {height, width}=useWindowDimensions();
    const URL='https://tripsg-db.herokuapp.com/api/busstops/'

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

    function refreshClick(event){
        event.preventDefault();
        const URLbusArrival=URL+globalbusstopcode[0].busstopcode+"/"
        axios.get(URLbusArrival).then(res=>{
            let obtainedData=res.data.Services
            
            //Sort bus numbers
            const ifBmark = globalBookmarked.some( bookmark=> bookmark.BusStopCode == globalbusstopcode[0].busstopcode);
            if(ifBmark){
                //Find bookmark bus stop details from selection
                const bookmarkExtracted=globalBookmarked.filter((value)=>{
                    return (value.BusStopCode.toLowerCase()==res.data.BusStopCode.toLowerCase());
                });
                obtainedData=sortArrivalData(bookmarkExtracted[0].Starred, obtainedData)
            }else{
                obtainedData.sort(function(a, b) {
                    return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
                });
            }

            //Calculating time to bus
            const dateTimeNow=Date.now()
            if(globalRefreshToggle[0].refresh==true){
                let busDets=[]
                for (let i = 0; i < obtainedData.length; i++) {
                    if(obtainedData[i].ServiceNo.toLowerCase()==globalSearchWord.toLowerCase()){
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
                        busDets.push(obtainedData[i])
                    }
                }
            }else{
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

                const busStopDets=[{
                    "busstopcode":res.data.BusStopCode,
                    "description": busExtracted[0].Description,
                    "lat": busExtracted[0].Latitude,
                    "lng": busExtracted[0].Longitude,
                }]
                setGlobalbusstopcode(busStopDets)

            }
               
            //reset
            setGlobalSearchWord('')
            setGlobalFilteredData([])

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
            if(globalDarkMode){
                toast.error('Server error', {
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
                toast.error('Server error', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        })
    }

    function clickBack(event){
        if(showBusRoute==true){
            setShowBusRoute(false)
            setIsLoop(false)
        }else{
            setGlobalbusstopcode([{
                "busstopcode":"",
                "description": "",
                "lat": "",
                "lng": "",
            }])
            setGlobalArrivalData([])
        }
    }

    const starSort=()=>{
        const ifExist = globalBookmarked.some( bookmark=> bookmark.BusStopCode == globalbusstopcode[0].busstopcode);
        if(ifExist){
            let snapshotArrivalData=globalArrivalData
            const bookmarkExtracted=globalBookmarked.filter((value)=>{
                return (value.BusStopCode.toLowerCase()==globalbusstopcode[0].busstopcode.toLowerCase());
            });
            let starArray=bookmarkExtracted[0].Starred
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
        const URL="http://tripsg-db.herokuapp.com/api/busroutes/"+BusNum+"/"+globalbusstopcode[0].busstopcode+"/"
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
                    // setLoading(false)
        }).catch(error=>{
            if(globalDarkMode){
                toast.error('Error loading bus route details', {
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
                toast.error('Error loading bus route details', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
                    // setLoading(false)
        })
    }

    return (
        <div>
            {
                globalbusstopcode[0].busstopcode!=''?(
                    //header
                    <div>
                        <div className="container-fluid line">
                            <nav class="navbar navbar-expand-lg navbar-light">
                                <label class="navbar-brand leftLabel">
                                    <a href="#" className={globalDarkMode ? "arrowIconD":"arrowIcon"}><ArrowBack onClick={clickBack}></ArrowBack></a>
                                    <label className={globalDarkMode ? "busLabelD":""} style={{marginRight:"15px"}}>Bus Stop: {globalbusstopcode[0].description} ({globalbusstopcode[0].busstopcode})</label>
                                    <a href="#" style={{marginLeft:"-4px"}}><Bookmark></Bookmark></a>
                                    <a href="#" ><MapFunc></MapFunc></a>
                                    <a href="#" ><BusArrivalInfoFunc></BusArrivalInfoFunc></a>
                                    <a href="#" onClick={refreshClick}><Refresh id={globalDarkMode ? "refreshIconD":"refreshIcon"}></Refresh></a>
                                </label>
                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                                <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                    </ul>
                                    <form class={width>991?"d-flex":"container-fluid"} style={{padding:"0px"}}>
                                        <SearchBar placeholder="Search..." data={globalFullBusstopList} />
                                    </form>
                                </div>
                            </nav>
                        </div>
                        {
                            showBusRoute==true?(
                                <div style={{paddingLeft:"10px", paddingRight:"10px", marginTop:"10px"}}>
                                    <div className="row">
                                    <div className="col-sm-6" style={{marginTop:"10px"}}>
                                            <div className="row container-fluid">
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
                                // {/* Show bus arrivals */}
                                <div className="row row-cols-1 row-cols-sm-2 g-0 topMargin test" style={{paddingLeft:"10px", paddingRight:"10px"}}>
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
                                                                <label className="BusTime" style={{display:"flex", justifyContent:"space-between"}}>Next Bus:
                                                                    <a href="#" onClick={() => InfoClickBusRoute(value.ServiceNo)} id={globalDarkMode ? "inFoIconBRD":"inFoIconBR"} style={{marginLeft:"auto"}}><InfoIcon /></a>
                                                                    {
                                                                        globalisBookmarked?(
                                                                            <div style={{marginLeft:"3px"}}><Star BusNum={value.ServiceNo} style={{marginLeft:"auto"}}/></div>
                                                                        ):(
                                                                            <></>
                                                                        )
                                                                    }
                                                                </label>
                                                                <label className={value.NextBus2.Load=="SEA"?"BusTime empty":value.NextBus2.Load=="SDA"?"BusTime standing":"BusTime full"}>{value.NextBus.EstimatedArrival}{value.NextBus.Feature=="WAB"?<WheelChair className={globalDarkMode ? "WheelChairD":"WheelChair"}></WheelChair>:<></>}</label>
                                                                <label className={value.NextBus2.Load=="SEA"?"BusTime2 empty":value.NextBus2.Load=="SDA"?"BusTime2 standing":"BusTime2 full"}>{value.NextBus2.EstimatedArrival!="NaNmin"?value.NextBus2.EstimatedArrival:""}
                                                                {
                                                                    value.NextBus2.EstimatedArrival!="NaNmin"?(
                                                                        value.NextBus.Feature=="WAB"?<WheelChair className={globalDarkMode ? "WheelChair2D":"WheelChair2"}></WheelChair>:<></>
                                                                    ):(
                                                                        <></>
                                                                    )
                                                                }
                                                                </label>
                                                                <label className={value.NextBus2.Load=="SEA"?"BusTime2 empty":value.NextBus2.Load=="SDA"?"BusTime2 standing":"BusTime2 full"}>{value.NextBus3.EstimatedArrival!="NaNmin"?value.NextBus3.EstimatedArrival:""}
                                                                {
                                                                    value.NextBus3.EstimatedArrival!="NaNmin"?(
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
                    // if havent search
                    <>
                    <div class="container-fluid" style={{textAlign:"right", justifyContent:"right"}}>
                        <a href="#" data-bs-toggle="modal" data-bs-target="#searchHelpModal"><HelpIcon id={globalDarkMode?"helpSearchD":"helpSearch"}></HelpIcon></a>
                    </div>
                    <div class="container-fluid" style={{textAlign:"center", justifyContent:"center"}}>
                        {globalDarkMode ?
                            <img src={BusIconBlack2} style={{height:"auto", width:"8rem", paddingTop:"16px"}} />
                            :
                            <img src={BusIconBlack} style={{height:"auto", width:"8rem", paddingTop:"16px"}} />
                        }
                        <form class="container-fluid" style={{marginTop:"30px"}}>
                            <SearchBar placeholder="Search..." data={globalFullBusstopList}/>
                        </form>
                    </div>
                    </>
                )
            }
            {/* modal */}
            <div class="modal fade" id="searchHelpModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content" id={globalDarkMode ?"searchModal":""}>
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Search methods</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <b>Quick Search</b>
                        <ul style={{marginBottom:"5px"}}>
                            <li>Leave search input empty and click search. Application will show bus arrivals for nearest bus stop.</li>
                            <li>Type in bus number and click search. Application will show bus arrival for queried bus at nearest bus stop.</li>
                        </ul>
                        <div style={{fontSize:"14px", marginLeft:"15px"}}>
                        Note:
                        <ul>
                            <li>Location sharing must be enabled.</li>
                            <li>May not work for temporary bus stops due to limitations from LTA.</li>
                        </ul>
                        </div>
                        <div className="botLine"></div>
                        <b>Normal Search</b>
                        <ul style={{marginBottom:"0px"}}>
                            <li>Search by typing in bus stop name or bus stop code.</li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" className={globalDarkMode ? "btn btn-secondary bgbtnD":"btn btn-secondary bgbtn"} data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Searchtab
