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

function Home(props){
    const[arrivalData, setArrivalData]=useState([]);

    const{globalBusstopDataKey}=useContext(GlobalContext)
    const[globalBusstopData,setGlobalBusstopData]=globalBusstopDataKey
    const{globalSearchWordKey}=useContext(GlobalContext)
    const[globalSearchWord,setGlobalSearchWord]=globalSearchWordKey
    const{globalFilteredDataKey}=useContext(GlobalContext)
    const[globalFilteredData,setGlobalFilteredData]=globalFilteredDataKey

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
            setArrivalData(obtainedData)

            //reset
            setGlobalSearchWord('')
            setGlobalFilteredData([])
        }).catch(error=>{
            console.log("error")
        })
    }

    return(
        <div>
            <Navbar></Navbar>
            <div className="leftmargin background">
                <div className="bg">
                    <div class="bordertop">
                        <nav class="navbar navbar-expand-md navbar-light bg-light shadowProperty navRadius">
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
                        <div className={width<950?"row row-cols-1 row-cols-sm-2 g-2 topMargin":"row row-cols-1 row-cols-sm-3 g-2 topMargin"}>
                            {arrivalData.map((value,key)=>{
                                return(
                                    <div class="col">
                                        <div class="card shadowProperty">
                                            <div class="card-body">
                                                <div className="row">
                                                    <div className="col-4 borderBot rightDivider" style={{textAlign:"center"}}>
                                                        
                                                            <label className="BusNo">{value.ServiceNo}</label>
                                                   
                                                    </div>
                                                    <div className="col-8 borderLeft">
                                               
                                                            <label className="BusTime">Next Bus: {value.NextBus.EstimatedArrival}</label>
                                                            <div className="row">
                                                                <div className="col-xs-6">
                                                                    {
                                                                        value.NextBus2.EstimatedArrival!="NaNmin"?
                                                                        (
                                                                            <label className="BusTime2">Following Bus: {value.NextBus2.EstimatedArrival}</label>
                                                                        ):(
                                                                            <div></div>
                                                                        )
                                                                    }
                                                                </div>
                                                                <div className="col-xs-6">
                                                                    {
                                                                        value.NextBus3.EstimatedArrival!="NaNmin"?
                                                                        (
                                                                            <label className="BusTime2">Following Bus: {value.NextBus3.EstimatedArrival}</label>
                                                                        ):(
                                                                            <div></div>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                     
                                                    </div>
                                                </div>        
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home