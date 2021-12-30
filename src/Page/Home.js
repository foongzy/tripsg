import React, {useContext, useEffect, useState} from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../Resources/GlobalContext.js";
import useWindowDimensions from "../Components/useWindowDimensions"
import '../assets/css/home.css'
import SearchBar from "../Components/SearchBar"
import axios from 'axios'
import Rawdata from '../Resources/test.json'
import Navbar from '../Components/Sidebar'
import Refresh from '@material-ui/icons/Refresh';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BusIconBlack from '../assets/img/busIconBlack.png'
import HelpIcon from '@material-ui/icons/HelpOutline'
import Square from '@material-ui/icons/CropSquare'

function Home(props){
    const{globalBusstopDataKey}=useContext(GlobalContext)
    const[globalBusstopData,setGlobalBusstopData]=globalBusstopDataKey
    const{globalSearchWordKey}=useContext(GlobalContext)
    const[globalSearchWord,setGlobalSearchWord]=globalSearchWordKey
    const{globalFilteredDataKey}=useContext(GlobalContext)
    const[globalFilteredData,setGlobalFilteredData]=globalFilteredDataKey
    const{globalArrivalDataKey}=useContext(GlobalContext)
    const[globalArrivalData,setGlobalArrivalData]=globalArrivalDataKey
    const{globalbusstopcodeKey}=useContext(GlobalContext)
    const[globalbusstopcode,setGlobalbusstopcode]=globalbusstopcodeKey

    const {height, width}=useWindowDimensions();

    const updateGlobalBusstopData=(busData)=>{
        setGlobalBusstopData(busData)
    }

    const URL='https://tripsg-db.herokuapp.com/api/busstops/'
    const loadBusstopsData=()=>{
        if(globalBusstopData==""){
            axios.get(URL).then(res=>{
                updateGlobalBusstopData(res.data.data)
            }).catch(error=>{
                console.log("error")
            })
        }
    }
    useEffect(loadBusstopsData,[])

    function getBusArrival(event){
        event.preventDefault();
        if(globalSearchWord!=""){
            const URLbusArrival=URL+globalSearchWord+"/"
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
                setGlobalbusstopcode(res.data.BusStopCode)

                //reset
                setGlobalSearchWord('')
                setGlobalFilteredData([])
            }).catch(error=>{
                toast.error('Bus stop does not exist. Please try again', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
        }else{
            toast.error('Field cannot be empty', {
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

    return(
        <div>
            <ToastContainer />
            <Navbar></Navbar>
            <div className="leftmargin background">
                <div className={width<551?"bg":"bgCom"}>
                    <div class="bordertop">
                        <nav class="navbar navbar-expand-md navbar-light shadowProperty navRadius">
                            <div class="container-fluid">
                                <a class="navbar-brand" style={{color:"white"}}>Bus Arrivals</a>
                                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                                    <span class="navbar-toggler-icon"></span>
                                </button>
                                <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                                    <ul class="navbar-nav me-auto mb-2 mb-md-0">
                                    </ul>
                                    <form class="d-flex">
                                        <SearchBar className="flex-fill" placeholder="Search..." data={Rawdata}/>
                                        <button class="btn btn-secondary btnradius flex-fill bgbtn" type="Search" id="searchBtn" onClick={getBusArrival}>Search</button>
                                    </form>
                                </div>
                            </div>
                        </nav>
                        {
                            globalbusstopcode!=''?(
                                <nav class="navbar navbar-light shadowProperty headerbus">
                                    <div class="container-fluid line">
                                        <label className="leftLabel">Bus Stop Code: {globalbusstopcode}</label>
                                        <form class="d-flex">
                                            <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal" style={{textAlign:"right"}}><HelpIcon id="helpIcon"></HelpIcon></a>
                                            <a href="" style={{textAlign:"right"}} onClick={refreshClick}><Refresh id="refreshIcon"></Refresh></a>
                                        </form>
                                    </div>
                                    <div className={width<950?"row row-cols-1 row-cols-sm-2 g-0 topMargin":"row row-cols-1 row-cols-sm-3 g-0 topMargin"}>
                                        {globalArrivalData.map((value,key)=>{
                                            return(
                                                <div class="col">
                                                    <div class="card cardR" style={{height:"100%", borderRadius:"0px"}}>
                                                        <div class="card-body">
                                                            <div className="row">
                                                                <div className="col-4 borderBot rightDivider" style={{textAlign:"center"}}>
                                                                    <label className="BusNo">{value.ServiceNo}</label>
                                                                </div>
                                                                <div className="col-8 borderLeft">
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
                                </nav> 
                            ):(
                                // if havent search
                                <div class="row row-cols-1 row-cols-lg-12 g-2" style={{textAlign:"center", justifyContent:"center", paddingLeft:"32px"}}>
                                    <img src={BusIconBlack} style={{height:"auto", width:"25%", paddingTop:"40px"}} />
                                    <label style={{fontSize:"16px", fontFamily:"sans-serif"}}>- Type bus stop in searchbar to begin -</label>
                                </div>
                            )
                        }
                         
                    </div>
                </div>
            </div>

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

export default Home