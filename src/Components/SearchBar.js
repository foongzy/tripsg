import React, {useState, useContext} from 'react'
import '../assets/css/SearchBar.css'
import SearchIcon from '@material-ui/icons/Search';
import Close from '@material-ui/icons/Close';
import { GlobalContext } from "../Resources/GlobalContext.js";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import geolocation from "../hooks/useGeoLocation.js";

function SearchBar({placeholder, data}) {
    const location=geolocation();

    const{globalFilteredDataKey}=useContext(GlobalContext)
    const[globalFilteredData,setGlobalFilteredData]=globalFilteredDataKey
    const{globalSearchWordKey}=useContext(GlobalContext)
    const[globalSearchWord,setGlobalSearchWord]=globalSearchWordKey
    const{globalArrivalDataKey}=useContext(GlobalContext)
    const[globalArrivalData,setGlobalArrivalData]=globalArrivalDataKey
    const{globalbusstopcodeKey}=useContext(GlobalContext)
    const[globalbusstopcode,setGlobalbusstopcode]=globalbusstopcodeKey
    const{globalNearbyBusStopsKey}=useContext(GlobalContext)
    const[globalnearbyBusStops,setGlobalNearbyBusStops]=globalNearbyBusStopsKey
    const{globalRefreshToggleKey}=useContext(GlobalContext)
    const[globalRefreshToggle,setGlobalRefreshToggle]=globalRefreshToggleKey

    const URL='https://tripsg-db.herokuapp.com/api/busstops/'

    const updateGlobalRefreshToggle=(value)=>{
        setGlobalRefreshToggle(value)
    }

    const handleFilter=(event)=>{
        const searchWord = event.target.value
        setGlobalSearchWord(searchWord);
        const newFilter=data.filter((value)=>{
            return (
                value.BusStopCode.toLowerCase().includes(searchWord.toLowerCase())||
                value.Description.toLowerCase().includes(searchWord.toLowerCase())
            );
        });
        if(searchWord==""){
            setGlobalFilteredData([])
        }else{
            setGlobalFilteredData(newFilter)
        }
    }

    function triggerSearch(event){
        event.preventDefault();
        
    }

    const clearInput=()=>{
        setGlobalFilteredData([])
        setGlobalSearchWord('')
    }

    function toastError(errorMsg){
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

    function getBusArrival(busStop, action){
        const URLbusArrival=URL+busStop+"/"
        axios.get(URLbusArrival).then(res=>{
            let obtainedData=res.data.Services
                    
            //Sort bus numbers
            if(action!="quickBusNo"){
                obtainedData.sort(function(a, b) {
                    return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
                });
            }

            //Calculating time to bus
            const dateTimeNow=Date.now()
            if(action=="quickBusNo"){
                //check if bus searched exist at nearest bus stop
                const ifBusExist = obtainedData.some( busService=> busService.ServiceNo.toLowerCase()==globalSearchWord.toLowerCase());
                if(ifBusExist==true){
                    const busExtracted=obtainedData.filter((value)=>{
                        return (value.ServiceNo.toLowerCase()==globalSearchWord.toLowerCase());
                    });
                    let time=[]
                    const busDateTime1=Date.parse(busExtracted[0].NextBus.EstimatedArrival)
                    const busDateTime2=Date.parse(busExtracted[0].NextBus2.EstimatedArrival)
                    const busDateTime3=Date.parse(busExtracted[0].NextBus3.EstimatedArrival)
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
                    busExtracted[0].NextBus.EstimatedArrival=time[0]
                    busExtracted[0].NextBus2.EstimatedArrival=time[1]
                    busExtracted[0].NextBus3.EstimatedArrival=time[2]
                    setGlobalArrivalData(busExtracted)
                    setGlobalbusstopcode(globalnearbyBusStops[0].BusStopCode)
                    const refreshVal=[{
                        "refresh":true,
                        "busNo": globalSearchWord.toLowerCase(),
                    }]
                    updateGlobalRefreshToggle(refreshVal)
                }else{
                    toastError('Bus '+globalSearchWord+' does not operate at your nearest bus stop')
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
                const refreshVal=[{
                    "refresh":false,
                    "busNo": "",
                }]
                updateGlobalRefreshToggle(refreshVal)
            }
                
            //reset
            setGlobalSearchWord('')
            setGlobalFilteredData([])
        }).catch(error=>{
            if (action=="normal"){
                toastError('Bus stop does not exist. Please try again')
            }else{
                toastError('Server error')
            }
        })
    }

    function clickSearch(event){
        event.preventDefault()
        if(globalSearchWord!=""){
            if(globalSearchWord.length<=4){
                if(location.loaded==true && location.error==''){
                    if (globalnearbyBusStops[0]){
                        //quick search using nearest bus stop
                        getBusArrival(globalnearbyBusStops[0].BusStopCode, "quickBusNo")
                    }else{
                        toastError('You are not near any bus stops to use quicksearch')
                    }
                }else if(location.loaded==false){
                    toastError('Loading location. Please try again')
                }else{
                    toastError('Please allow website to use your location to enable quicksearch')
                }
            }else{
                //normal search
                getBusArrival(globalSearchWord, "normal")
            }
        }else{
            if(location.loaded==true && location.error==''){
                //quick search using nearest bus stop to find bus
                if (globalnearbyBusStops[0]){
                    getBusArrival(globalnearbyBusStops[0].BusStopCode, "quickBusStop")
                }else{
                    toastError('You are not near any bus stops to use quicksearch')
                }
            }else if(location.loaded==false){
                toastError('Loading location. Please try again')
            }else if(location.loaded==true && location.error!=''){
                toastError('Field cannot be empty')
            }else{
                toastError('Server error')
            }
        }
    }

    return (
        <div className='search'>
            <div className='searchInputs'>
                <div class="input-group" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Search by bus stop code or name">
                    <input type="text" id="searchbarBus" class="form-control searchBox" placeholder={placeholder} value={globalSearchWord} onChange={handleFilter} aria-label="Recipient's username with two button addons" />
                    <span class="input-group-text SearchBg" id="basic-addon2">
                        {globalSearchWord.length==0?(
                            <SearchIcon></SearchIcon>
                        ):(
                            <Close id="clearBtn" onClick={clearInput}></Close>
                        )}
                    </span>
                    <button style={{color:"white", zIndex:"0"}} onClick={clickSearch} class="btn btn-outline-secondary btnradius bgbtn" type="Search" id="searchBtn">Search</button>
                </div>
            </div>
            {
                globalFilteredData.length!=0?(
                    <div className='dataResult'>
                        {globalFilteredData.slice(0, 10).map((value, key)=>{
                            return <a className='dataItem' onClick={triggerSearch}>
                                <p>{value.Description + " ("+value.BusStopCode+")"}</p>
                                </a>
                        })}
                    </div>
                ):(
                    <div></div>
                )
            }
        
        </div>
    )
}

export default SearchBar
