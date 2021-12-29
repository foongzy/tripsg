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
                updateGlobalBusstopData(res.data.value)
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
                                    <a href="" style={{textAlign:"right"}} onClick={refreshClick}><Refresh id="refreshIcon"></Refresh></a>
                                </form>
                            </div>
                            <div className={width<950?"row row-cols-1 row-cols-sm-2 g-0 topMargin":"row row-cols-1 row-cols-sm-3 g-0 topMargin"}>
                                {globalArrivalData.map((value,key)=>{
                                    return(
                                        <div class="col">
                                            <div class="card cardR" style={{height:"100%"}}>
                                                <div class="card-body">
                                                    <div className="row">
                                                        <div className="col-4 borderBot rightDivider" style={{textAlign:"center"}}>
                                                            <label className="BusNo">{value.ServiceNo}</label>
                                                        </div>
                                                        <div className="col-8 borderLeft">
                                                            <label className="BusTime">Next Bus:</label>
                                                            <br></br>
                                                            <label className="BusTime">{value.NextBus.EstimatedArrival}</label>
                                                            <label className="BusTime2">{value.NextBus2.EstimatedArrival!="NaNmin"?value.NextBus2.EstimatedArrival:""}</label>
                                                            <label className="BusTime2">{value.NextBus3.EstimatedArrival!="NaNmin"?value.NextBus3.EstimatedArrival:""}</label>
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
                                <div></div>
                            )
                        }
                         
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home