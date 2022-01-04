import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import useWindowDimensions from "../Components/useWindowDimensions"
import HelpIcon from '@material-ui/icons/HelpOutline'
import Square from '@material-ui/icons/CropSquare'
import Refresh from '@material-ui/icons/Refresh';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
import Bookmark from './BookmarkFunc'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BusIconBlack from '../assets/img/busIconBlack.png'
import WheelChair from '@material-ui/icons/Accessible';
import BusArrivalInfoFunc from "./BusArrivalInfoFunc.js";

function Bookmarktab() {

    const {height, width}=useWindowDimensions();
    const URL='https://tripsg-db.herokuapp.com/api/busstops/'

    const{globalArrivalDataKey}=useContext(GlobalContext)
    const[globalArrivalData,setGlobalArrivalData]=globalArrivalDataKey
    const{globalbusstopcodeBMKey}=useContext(GlobalContext)
    const[globalbusstopcodeBM,setGlobalbusstopcodeBM]=globalbusstopcodeBMKey
    const{globalBookmarkKey}=useContext(GlobalContext)
    const[globalBookmarked,setGlobalBookmarked]=globalBookmarkKey
    const{globalFullBusstopListKey}=useContext(GlobalContext)
    const[globalFullBusstopList,setGlobalFullBusstopList]=globalFullBusstopListKey

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

            setGlobalbusstopcodeBM([{
                "busstopcode":res.data.BusStopCode,
                "description": busExtracted[0].Description,
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
        const URLbusArrival=URL+globalbusstopcodeBM[0].busstopcode+"/"
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
            
            setGlobalbusstopcodeBM([{
                "busstopcode":res.data.BusStopCode,
                "description": busExtracted[0].Description,
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
        setGlobalbusstopcodeBM([{
            "busstopcode":"",
            "description": "",
        }])
        setGlobalArrivalData([])
    }

    // const toggleDisplay=()=>{
    //     if(location.Loaded==true){

    //     }else{

    //     }
    // }
    // useEffect(toggleDisplay,[location])

    return (
        <div>
            {
                globalbusstopcodeBM[0].busstopcode!=''?(
                    <div>
                        <div className="container-fluid line">
                            <nav class="navbar navbar-expand-lg navbar-light" id="texthead">
                                <div className="container-fluid">
                                <label class="navbar-brand leftLabel">
                                    <a href="#" style={{color:"black"}}><ArrowBack onClick={clickBack}></ArrowBack></a>
                                    Bus Stop Code: {globalbusstopcodeBM[0].description} ({globalbusstopcodeBM[0].busstopcode})
                                    <a href="#" ><Bookmark></Bookmark></a>
                                    <a href="#" ><BusArrivalInfoFunc></BusArrivalInfoFunc></a>
                                    <a href="#" onClick={refreshClick}><Refresh id="refreshIcon"></Refresh></a>
                                </label>
                                </div>
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
                                    <div class="col">
                                        <div class="card cardR" style={{height:"100%", borderRadius:"0px"}}>
                                            <div class="card-body">
                                                <div className="row">
                                                    <div className="col-5 borderBot rightDivider" style={{textAlign:"center"}}>
                                                        <label className="BusNo">{value.ServiceNo}</label>
                                                    </div>
                                                    <div className="col-7">
                                                        <label className="BusTime">Next Bus:</label>
                                                        <br></br>
                                                        <label className={value.NextBus2.Load=="SEA"?"BusTime empty":value.NextBus2.Load=="SDA"?"BusTime standing":"BusTime full"}>{value.NextBus.EstimatedArrival}{value.NextBus.Feature=="WAB"?<WheelChair className="WheelChair"></WheelChair>:<></>}</label>
                                                        <label className={value.NextBus2.Load=="SEA"?"BusTime2 empty":value.NextBus2.Load=="SDA"?"BusTime2 standing":"BusTime2 full"}>{value.NextBus2.EstimatedArrival!="NaNmin"?value.NextBus2.EstimatedArrival:""}
                                                        {value.NextBus2.EstimatedArrival!="NaNmin"?(
                                                            value.NextBus.Feature=="WAB"?<WheelChair className="WheelChair2"></WheelChair>:<></>
                                                        ):(
                                                            <></>
                                                        )
                                                        }
                                                        </label>
                                                        <label className={value.NextBus2.Load=="SEA"?"BusTime2 empty":value.NextBus2.Load=="SDA"?"BusTime2 standing":"BusTime2 full"}>{value.NextBus3.EstimatedArrival!="NaNmin"?value.NextBus3.EstimatedArrival:""}
                                                        {value.NextBus3.EstimatedArrival!="NaNmin"?(
                                                            value.NextBus.Feature=="WAB"?<WheelChair className="WheelChair2"></WheelChair>:<></>
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
                        {/* Show bookmarked busstops */}
                        <div className={width<950?"row row-cols-1 row-cols-sm-2 g-2 topMargin":"row row-cols-1 row-cols-sm-3 g-2 topMargin"}  style={{paddingLeft:"10px", paddingRight:"10px", marginTop:"0px"}}>
                            {globalBookmarked.map((value,key)=>{
                                return(
                                    <div class="col">
                                        <a href="javascript:void(0)" style={{color:"black", textDecoration:"none"}} onClick={()=>getBusArrival(value.BusStopCode)}>
                                            <div class="card text-dark bg-light mb-3" style={{height:"100%"}}>
                                                <div class="card-header">Bus stop name: {value.CustomName==""?value.Description:value.CustomName} <br></br>({value.BusStopCode})
                                                </div>
                                                <div class="card-body">
                                                    <div className="row">
                                                        <div className="container-fluid">
                                                            <label className="card-text">{value.RoadName}</label>
                                                            <br></br>
                                                            <label className="card-text">{value.distFromUser}</label>
                                                        </div>
                                                    </div>        
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            }
            {
                globalBookmarked==""?(
                    <div class="container-fluid" style={{textAlign:"center", justifyContent:"center"}}>
                        <img src={BusIconBlack} style={{height:"auto", width:"8rem", paddingTop:"40px"}} />
                        <form class="container-fluid" style={{marginTop:"30px"}}>
                            <p>You have no bookmarks added</p>
                        </form>
                    </div>
                ):(
                    <div></div>
                )
            }
        </div>
    )
}

export default Bookmarktab

