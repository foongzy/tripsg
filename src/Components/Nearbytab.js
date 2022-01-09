import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import useWindowDimensions from "../Components/useWindowDimensions"
import Refresh from '@material-ui/icons/Refresh';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import Bookmark from './BookmarkFunc'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import geolocation from "../hooks/useGeoLocation.js";
import BusIconBlack from '../assets/img/busIconBlack.png'
import BusIconBlack2 from '../assets/img/busIconBlue2.png'
import WheelChair from '@material-ui/icons/Accessible';
import Location from '@material-ui/icons/LocationOn';
import BusArrivalInfoFunc from "./BusArrivalInfoFunc.js";
import MapFunc from "./MapFunc.js";

function Nearbytab() {
    const location=geolocation();

    const {height, width}=useWindowDimensions();
    const URL='https://tripsg-db.herokuapp.com/api/busstops/'

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

    function getBusArrival(code){
        const URLbusArrival=URL+code+"/"
        axios.get(URLbusArrival).then(res=>{
            let obtainedData=res.data.Services
            //Sort bus numbers
            obtainedData.sort(function(a, b) {
                return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
            });

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
        }).catch(error=>{
            toast.error('Server error. Please try again', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })   
    }

    function refreshClick(event){
        event.preventDefault();
        const URLbusArrival=URL+globalbusstopcodeNearby[0].busstopcode+"/"
        axios.get(URLbusArrival).then(res=>{
            let obtainedData=res.data.Services
            //Sort bus numbers
            obtainedData.sort(function(a, b) {
                return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
            });

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

            toast.success('Refresh successful', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }).catch(error=>{
            toast.error('Server error', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }

    function clickBack(event){
        setGlobalbusstopcodeNearby([{
            "busstopcode": "",
            "description": "",
            "lat": "",
            "lng": "",
        }])
        setGlobalArrivalData([])
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
                                        {/* <SearchBar placeholder="Search bus stop number or name..." data={Rawdata} /> */}
                                    </form>
                                </div>
                            </nav>
                        </div>
                        {/* bus arrivals */}
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
                                                        <label className="BusTime">Next Bus:</label>
                                                        <br></br>
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
                                                    <div class="container-fluid" style={{textAlign:"center", justifyContent:"center"}}>
                                                        {globalDarkMode ?
                                                            <img src={BusIconBlack2} style={{height:"auto", width:"8rem", paddingTop:"50px"}} />
                                                            :
                                                            <img src={BusIconBlack} style={{height:"auto", width:"8rem", paddingTop:"50px"}} />
                                                        }
                                                        
                                                        <form class="container-fluid" style={{marginTop:"30px"}}>
                                                            <p className={globalDarkMode ?"otherLabelColD":""}>There are no bus stops nearby</p>
                                                        </form>
                                                    </div>
                                                ):(
                                                    // Show nearby busstops
                                                    <div className={width<950?"row row-cols-1 row-cols-sm-2 g-2 topMargin":"row row-cols-1 row-cols-sm-3 g-2 topMargin"}  style={{paddingLeft:"10px", paddingRight:"10px", marginTop:"0px"}}>
                                                        {globalnearbyBusStops.map((value,key)=>{
                                                            return(
                                                                <div className="col">
                                                                    <a href="javascript:void(0)" style={{color:"black", textDecoration:"none"}} onClick={()=>getBusArrival(value.BusStopCode)}>
                                                                        <div className="card text-dark bg-dark mb-0" className="cardHover" style={{height:"100%"}}>
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
                                            <div class="container-fluid" style={{textAlign:"center", justifyContent:"center"}}>
                                                {globalDarkMode ?
                                                    <img src={BusIconBlack2} style={{height:"auto", width:"8rem", paddingTop:"50px"}} />
                                                    :
                                                    <img src={BusIconBlack} style={{height:"auto", width:"8rem", paddingTop:"50px"}} />
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
                                <div class="container-fluid" style={{textAlign:"center", justifyContent:"center"}}>
                                    {globalDarkMode ?
                                        <img src={BusIconBlack2} style={{height:"auto", width:"8rem", paddingTop:"50px"}} />
                                        :
                                        <img src={BusIconBlack} style={{height:"auto", width:"8rem", paddingTop:"50px"}} />
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
