import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import HelpIcon from '@material-ui/icons/HelpOutline'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWindowDimensions from "../Components/useWindowDimensions";
import axios from 'axios'
import SearchBar from "../Components/SearchBar"
import Bookmark from './BookmarkFunc'
import BusArrivalInfoFunc from "./BusArrivalInfoFunc.js";
import MapFunc from "./MapFunc.js";
import RefreshFunc from "./RefreshFunc.js"
import Star from "./StarFunc.js"
import BusIconBlack from '../assets/img/busIconBlack.png'
import BusIconBlack2 from '../assets/img/busIconBlue2.png'
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

//Icons import
import InfoIcon from '@material-ui/icons/InfoOutlined';
import WheelChair from '@material-ui/icons/Accessible';

function Searchtab() {
    const [currentBusStopSeq, setCurrentBusStopSeq] = useState("")
    const [currentBusDets, setCurrentBusDets] = useState("")
    const [currentTotalBusStop, setCurrentTotalBusStop] = useState(0)
    const [extractedBusDets, setExtractedBusDets] = useState("")
    const [busNumState,setBusNum]=useState("")

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
    const{globalIsLoadingKey}=useContext(GlobalContext)
    const[globalisLoading,setGlobalIsLoading]=globalIsLoadingKey
    const{globalShowBusRouteKey}=useContext(GlobalContext)
    const[globalShowBusRoute, setGlobalShowBusRoute]=globalShowBusRouteKey
    const{globalIsLoopKey}=useContext(GlobalContext)
    const[globalIsLoop, setGlobalIsLoop]=globalIsLoopKey

    const {height, width}=useWindowDimensions();
    const URL='https://tripsg.pythonanywhere.com/api/busstops/'

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

    function clickBack(event){
        if(globalShowBusRoute==true){
            setGlobalShowBusRoute(false)
            setGlobalIsLoop(false)
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
        const URL="https://tripsg.pythonanywhere.com/api/busroutes/"+BusNum+"/"+globalbusstopcode[0].busstopcode+"/"
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
                setGlobalIsLoop(true)
            }
            setCurrentBusDets(busstoproutelist)
            setCurrentTotalBusStop(busstoproutelist.length)
            setGlobalShowBusRoute(true)
            setBusNum(BusNum)
            setGlobalIsLoading(false)
        }).catch(error=>{
            setGlobalIsLoading(false)
            toastError('Error loading bus route details')
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
                                    <a href="#"><MapFunc></MapFunc></a>
                                    <a href="#"><BusArrivalInfoFunc></BusArrivalInfoFunc></a>
                                    <a href="#"><RefreshFunc></RefreshFunc></a>
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
                            globalShowBusRoute==true?(
                                <div style={{paddingLeft:"10px", paddingRight:"10px", marginTop:"10px"}}>
                                    <div className="row">
                                    <div className="col-sm-6" style={{marginTop:"10px"}}>
                                            <div className="row container-fluid flbus">
                                                <div className={globalDarkMode ? "card cardRD":"card timingCard"}>
                                                    <h4 className={globalDarkMode ?"card-title busrouteD":"card-title busroute"}>Bus {busNumState} Info</h4>
                                                   {
                                                       globalIsLoop?(
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
                                                                <label className="BusTimeNoPad" style={{display:"flex", justifyContent:"space-between"}}>Next Bus:
                                                                    <a href="#" onClick={() => InfoClickBusRoute(value.ServiceNo)} id={globalDarkMode ? "inFoIconBRD":"inFoIconBR"} style={{marginLeft:"auto"}}><InfoIcon id="busRoouteInfoIcon"/></a>
                                                                    {
                                                                        globalisBookmarked?(
                                                                            <div style={{marginLeft:"2px"}}><Star BusNum={value.ServiceNo} style={{marginLeft:"auto"}} /></div>
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
                        <div class="container-fluid nearbytop" style={{textAlign:"center", justifyContent:"center"}}>
                            {globalDarkMode ?
                                <img src={BusIconBlack2} style={{height:"auto", width:"8rem", paddingTop:"10px"}} />
                                :
                                <img src={BusIconBlack} style={{height:"auto", width:"8rem", paddingTop:"10px"}} />
                            }
                            <form class="container-fluid" style={{marginTop:"30px"}}>
                                <SearchBar placeholder="Search..." data={globalFullBusstopList}/>
                            </form>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default Searchtab
