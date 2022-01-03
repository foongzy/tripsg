import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import geolocation from "../hooks/useGeoLocation.js";
import HelpIcon from '@material-ui/icons/HelpOutline'
import Square from '@material-ui/icons/CropSquare'
import Refresh from '@material-ui/icons/Refresh';
import ArrowBack from '@material-ui/icons/ArrowBackIos';
// import BookmarkFilled from '@material-ui/icons/Bookmark';
// import Bookmark from '@material-ui/icons/BookmarkBorder';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWindowDimensions from "../Components/useWindowDimensions"
import BusIconBlack from '../assets/img/busIconBlack.png'
import axios from 'axios'
import SearchBar from "../Components/SearchBar"
import Rawdata from '../Resources/test.json'
import Bookmark from './BookmarkFunc'
import WheelChair from '@material-ui/icons/Accessible';

function Searchtab(props) {
    const location=geolocation();

    const{globalSearchWordKey}=useContext(GlobalContext)
    const[globalSearchWord,setGlobalSearchWord]=globalSearchWordKey
    const{globalFilteredDataKey}=useContext(GlobalContext)
    const[globalFilteredData,setGlobalFilteredData]=globalFilteredDataKey
    const{globalBusstopDataKey}=useContext(GlobalContext)
    const[globalBusstopData,setGlobalBusstopData]=globalBusstopDataKey
    const{globalArrivalDataKey}=useContext(GlobalContext)
    const[globalArrivalData,setGlobalArrivalData]=globalArrivalDataKey
    const{globalbusstopcodeKey}=useContext(GlobalContext)
    const[globalbusstopcode,setGlobalbusstopcode]=globalbusstopcodeKey
    const{globalNearbyBusStopsKey}=useContext(GlobalContext)
    const[globalnearbyBusStops,setGlobalNearbyBusStops]=globalNearbyBusStopsKey
    const{globalRefreshToggleKey}=useContext(GlobalContext)
    const[globalRefreshToggle,setGlobalRefreshToggle]=globalRefreshToggleKey
    const{globalBookmarkKey}=useContext(GlobalContext)
    const[globalBookmarked,setGlobalBookmarked]=globalBookmarkKey

    const {height, width}=useWindowDimensions();
    const URL='https://tripsg-db.herokuapp.com/api/busstops/'

    function refreshClick(event){
        event.preventDefault();
        const URLbusArrival=URL+globalbusstopcode+"/"
        axios.get(URLbusArrival).then(res=>{
            let obtainedData=res.data.Services

            //Sort bus numbers
            obtainedData.sort(function(a, b) {
                return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
            });

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
                setGlobalbusstopcode(res.data.BusStopCode)
            }
               
            //reset
            setGlobalSearchWord('')
            setGlobalFilteredData([])

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
        setGlobalbusstopcode('')
        setGlobalArrivalData([])
    }

    return (
        <div>
            {
                globalbusstopcode!=''?(
                    //header
                    <div>
                        <div className="container-fluid line">
                            <nav class="navbar navbar-expand-lg navbar-light">
                                <label class="navbar-brand leftLabel">
                                    <a href="#" style={{color:"black"}}><ArrowBack onClick={clickBack}></ArrowBack></a>
                                    Bus Stop Code: {globalbusstopcode}
                                    <a href="#" ><Bookmark></Bookmark></a>
                                    <a href="#" data-bs-toggle="modal" data-bs-target="#helpModal"><HelpIcon id="helpIcon"></HelpIcon></a>
                                    <a href="#" onClick={refreshClick}><Refresh id="refreshIcon"></Refresh></a>
                                </label>
                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                                <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                    </ul>
                                    <form class={width>991?"d-flex":"container-fluid"} style={{padding:"0px"}}>
                                        <SearchBar placeholder="Search bus stop number or name..." data={Rawdata} />
                                    </form>
                                </div>
                            </nav>
                        </div>

                        {/* Show bus arrivals */}
                        <div className={width<950?"row row-cols-1 row-cols-sm-2 g-0 topMargin":"row row-cols-1 row-cols-sm-3 g-0 topMargin"}  style={{paddingLeft:"10px", paddingRight:"10px"}}>
                            {globalArrivalData.map((value,key)=>{
                                return(
                                    <div class="col">
                                        <div class="card cardR" style={{height:"100%", borderRadius:"0px"}}>
                                            <div class="card-body">
                                                <div className="row">
                                                    <div className="col-4 borderBot rightDivider" style={{textAlign:"center"}}>
                                                        <label className="BusNo">{value.ServiceNo}</label>
                                                    </div>
                                                    <div className="col-8">
                                                        <label className="BusTime">Next Bus:</label>
                                                        <br></br>
                                                        <label className={value.NextBus2.Load=="SEA"?"BusTime empty":value.NextBus2.Load=="SDA"?"BusTime standing":"BusTime full"}>{value.NextBus.EstimatedArrival}{value.NextBus.Feature=="WAB"?<WheelChair className="WheelChair"></WheelChair>:<></>}</label>
                                                        <label className={value.NextBus2.Load=="SEA"?"BusTime2 empty":value.NextBus2.Load=="SDA"?"BusTime2 standing":"BusTime2 full"}>{value.NextBus2.EstimatedArrival!="NaNmin"?value.NextBus2.EstimatedArrival:""}{value.NextBus.Feature=="WAB"?<WheelChair className="WheelChair2"></WheelChair>:<></>}</label>
                                                        <label className={value.NextBus2.Load=="SEA"?"BusTime2 empty":value.NextBus2.Load=="SDA"?"BusTime2 standing":"BusTime2 full"}>{value.NextBus3.EstimatedArrival!="NaNmin"?value.NextBus3.EstimatedArrival:""}{value.NextBus.Feature=="WAB"?<WheelChair className="WheelChair2"></WheelChair>:<></>}</label>
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
                    // if havent search
                    <div class="container-fluid" style={{textAlign:"center", justifyContent:"center"}}>
                        <img src={BusIconBlack} style={{height:"auto", width:"10rem", paddingTop:"40px"}} />
                        <form class="container-fluid" style={{marginTop:"30px"}}>
                            <SearchBar placeholder="Search bus stop number or name..." data={Rawdata}/>
                        </form>
                    </div>
                )
            }

            {/* Modal */}
            <div class="modal fade" id="helpModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Bus Timings Guide</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="col">
                                <div class="card cardR" style={{height:"100%", borderRadius:"0px"}}>
                                    <div class="card-body">
                                        <div className="row">
                                            <div className="col-4 borderBot rightDivider" style={{textAlign:"center"}}>
                                                <label className="BusNo">12</label>
                                            </div>
                                            <div className="col-8 borderLeft">
                                                <label className="BusTime">Next Bus:</label>
                                                <br></br>
                                                <label className="BusTime empty">Arriving</label>
                                                <label className='BusTime2 standing'>5min</label>
                                                <label className='BusTime2 full'>10min</label>
                                            </div>
                                        </div>                    
                                    </div>
                                </div>
                            </div>
                            <div class="card cardR" id="nocardborder" style={{height:"100%", borderRadius:"0px"}}>
                                <div class="card-body">
                                    <div className="row">
                                        <div className="col-4 borderBot rightDivider" style={{textAlign:"center"}}>
                                            <label className="BusTime" style={{textAlign:"center"}}>Bus Number</label>
                                        </div>
                                        <div className="col-8 borderLeft">
                                            <label className="BusTime">Color Legend:</label>
                                            <br></br>
                                            <Square className="BusTime empty"></Square><label className="BusTime2 empty">Seats Available</label>
                                            <br></br>
                                            <Square className="BusTime standing"></Square><label className='BusTime2 standing'>Standing Available</label>
                                            <br></br>
                                            <Square className="BusTime full"></Square><label className='BusTime2 full'>Standing Limited</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                                              
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary bgbtn" data-bs-dismiss="modal">Close</button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Searchtab
