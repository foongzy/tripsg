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

function Bookmarktab() {

    const {height, width}=useWindowDimensions();
    const URL='https://tripsg-db.herokuapp.com/api/busstops/'

    const{globalArrivalDataKey}=useContext(GlobalContext)
    const[globalArrivalData,setGlobalArrivalData]=globalArrivalDataKey
    const{globalbusstopcodeBMKey}=useContext(GlobalContext)
    const[globalbusstopcodeBM,setGlobalbusstopcodeBM]=globalbusstopcodeBMKey
    const{globalBookmarkKey}=useContext(GlobalContext)
    const[globalBookmarked,setGlobalBookmarked]=globalBookmarkKey

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
            setGlobalbusstopcodeBM(res.data.BusStopCode)
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
        const URLbusArrival=URL+globalbusstopcodeBM+"/"
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
            setGlobalbusstopcodeBM(res.data.BusStopCode)

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
        setGlobalbusstopcodeBM('')
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
                globalbusstopcodeBM!=''?(
                    <div>
                        <div className="container-fluid line">
                            <nav class="navbar navbar-expand-lg navbar-light">
                                <label class="navbar-brand leftLabel">
                                    <a href="#" style={{color:"black"}}><ArrowBack onClick={clickBack}></ArrowBack></a>
                                    Bus Stop Code: {globalbusstopcodeBM}
                                    <a href="#" ><Bookmark></Bookmark></a>
                                    <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal"><HelpIcon id="helpIcon"></HelpIcon></a>
                                    <a href="#" onClick={refreshClick}><Refresh id="refreshIcon"></Refresh></a>
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
                                                        <label className={value.NextBus2.Load=="SEA"?"BusTime empty":value.NextBus2.Load=="SDA"?"BusTime standing":"BusTime full"}>{value.NextBus.EstimatedArrival}</label>
                                                        <label className={value.NextBus2.Load=="SEA"?"BusTime2 empty":value.NextBus2.Load=="SDA"?"BusTime2 standing":"BusTime2 full"}>{value.NextBus2.EstimatedArrival!="NaNmin"?value.NextBus2.EstimatedArrival:""}</label>
                                                        <label className={value.NextBus2.Load=="SEA"?"BusTime2 empty":value.NextBus2.Load=="SDA"?"BusTime2 standing":"BusTime2 full"}>{value.NextBus3.EstimatedArrival!="NaNmin"?value.NextBus3.EstimatedArrival:""}</label>
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
                        <img src={BusIconBlack} style={{height:"auto", width:"10rem", paddingTop:"40px"}} />
                        <form class="container-fluid" style={{marginTop:"30px"}}>
                            <p>You have no bookmarks added</p>
                        </form>
                    </div>
                ):(
                    <div></div>
                )
            }

            {/* Modal */}
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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

export default Bookmarktab

