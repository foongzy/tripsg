import React, {useState, useContext} from 'react'
import '../assets/css/SearchBar.css'
import '../assets/css/SearchBarD.css'
import SearchIcon from '@material-ui/icons/Search';
import Close from '@material-ui/icons/Close';
import { GlobalContext } from "../Resources/GlobalContext.js";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import geolocation from "../hooks/useGeoLocation.js";
import useWindowDimensions from "../Components/useWindowDimensions"

function SearchBar({placeholder, data}) {
    const location=geolocation();
    const {height, width}=useWindowDimensions();
    const [mapURLState, setMapURLState] = useState("")

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
    const{globalFullBusstopListKey}=useContext(GlobalContext)
    const[globalFullBusstopList,setGlobalFullBusstopList]=globalFullBusstopListKey
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    const{globalBookmarkKey}=useContext(GlobalContext)
    const[globalBookmarked,setGlobalBookmarked]=globalBookmarkKey

    const URL='https://tripsg-db.herokuapp.com/api/busstops/'

    const updateGlobalRefreshToggle=(value)=>{
        setGlobalRefreshToggle(value)
    }

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

    const handleFilter=(event)=>{
        let searchWord = event.target.value
        setGlobalSearchWord(searchWord);
        let newFilterOriginal=data.filter((value)=>{
            return (
                value.BusStopCode.toLowerCase().includes(searchWord.toLowerCase())||
                value.Description.toLowerCase().includes(searchWord.toLowerCase())
            );
        });

        //handle shortforms
        const longwords=["bukit", "block", "street", "opposite", "avenue", "station", "after", "before", "primary", 
        "school", "secondary", "centre", "church", "singapore", "park", "hospital", "road", "mosque", "garden", "drive",
        "square", "towers", "tower", "tanjong", "complex", "place", "national", "library", "terminal", "jalan", "singapore", 
        "pri", "primary", "mount", "building", "court", "interchange", "industrial"]
        const shortforms=["bt", "blk", "st", "opp", "ave", "stn", "aft", "bef", "pr", 
        "sch", "sec", "ctr", "ch", "sg", "pk", "hosp", "rd", "mque", "gdn", "dr",
        "sq", "twrs", "twr", "tg", "cplx", "pl", "natl", "lib", "ter", "jln", "s'pore", 
        "pr", "pri", "mt", "bldg" ,"ct", "int", "ind"]
        for (let i = 0; i < longwords.length; i++) {
            if (searchWord.toLowerCase().includes(longwords[i])){
                const searchWordtmp=searchWord.replace(longwords[i], shortforms[i])
                let newFilterBt=data.filter((value)=>{
                    return (
                        value.BusStopCode.toLowerCase().includes(searchWordtmp.toLowerCase())||
                        value.Description.toLowerCase().includes(searchWordtmp.toLowerCase())
                    );
                });
                newFilterOriginal=[...new Set([...newFilterOriginal,...newFilterBt])]
            }else if(searchWord.toLowerCase().includes(shortforms[i])){
                const searchWordtmp=searchWord.replace(shortforms[i], longwords[i])
                let newFilterBt=data.filter((value)=>{
                    return (
                        value.BusStopCode.toLowerCase().includes(searchWordtmp.toLowerCase())||
                        value.Description.toLowerCase().includes(searchWordtmp.toLowerCase())
                    );
                });
                newFilterOriginal=[...new Set([...newFilterOriginal,...newFilterBt])]
            }else{}
        }

        if(searchWord==""){
            setGlobalFilteredData([])
        }else{
            setGlobalFilteredData(newFilterOriginal)
        }
    }

    function triggerSearch(busCode){
        getBusArrival(busCode, "normal")
    }

    const clearInput=()=>{
        setGlobalFilteredData([])
        setGlobalSearchWord('')
    }

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

    function getBusArrival(busStop, action){
        const URLbusArrival=URL+busStop+"/"
        axios.get(URLbusArrival).then(res=>{
            let obtainedData=res.data.Services

            //Sort bus numbers
            if(action!="quickBusNo"){
                const ifExist = globalBookmarked.some( bookmark=> bookmark.BusStopCode == busStop);
                if(ifExist){
                    //Find bookmark bus stop details from selection
                    const bookmarkExtracted=globalBookmarked.filter((value)=>{
                        return (value.BusStopCode.toLowerCase()==res.data.BusStopCode.toLowerCase());
                    });
                    //Sort
                    obtainedData=sortArrivalData(bookmarkExtracted[0].Starred, obtainedData)
                }else{
                    obtainedData.sort(function(a, b) {
                        return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
                    });
                }
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
                    setGlobalbusstopcode([{
                        "busstopcode": globalnearbyBusStops[0].BusStopCode,
                        "description": globalnearbyBusStops[0].Description,
                        "lat": globalnearbyBusStops[0].Latitude,
                        "lng": globalnearbyBusStops[0].Longitude,
                    }])
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
                
                //Find bus stop details using bus stop code
                const busExtracted=globalFullBusstopList.filter((value)=>{
                    return (value.BusStopCode.toLowerCase()==res.data.BusStopCode.toLowerCase());
                });
                
                setGlobalbusstopcode([{
                    "busstopcode": res.data.BusStopCode,
                    "description": busExtracted[0].Description,
                    "lat": busExtracted[0].Latitude,
                    "lng": busExtracted[0].Longitude,
                }])
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
                toastError('Bus stop does not exist')
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
            }else if(globalSearchWord.length==5 && globalSearchWord.match(/^[0-9]+$/) != null){
                //normal search: search by bus code
                getBusArrival(globalSearchWord, "normal")
            }else{
                //normal search: search by bus name
                const ifNameExist = globalFullBusstopList.some( search=> search.Description.toLowerCase() == globalSearchWord.toLowerCase());
                if(ifNameExist==true){
                    //Find bus stop details using bus stop description
                    const busExtracted=globalFullBusstopList.filter((value)=>{
                        return (value.Description.toLowerCase()==globalSearchWord.toLowerCase());
                    });
                    getBusArrival(busExtracted[0].BusStopCode, "normal")
                }else{
                    toastError('Bus stop name does not exist')
                }
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
                toastError('Search field cannot be empty')
            }else{
                toastError('Server error')
            }
        }
    }

    return (
        <div className='search'>
            <div className='searchInputs'>
                <div class="input-group" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Search by bus stop code or name">
                    <input type="text" id={globalDarkMode ? "searchbarBusD":"searchbarBus"} className={globalDarkMode ? "form-control searchBoxD":"form-control searchBox"} placeholder={placeholder} value={globalSearchWord} onChange={handleFilter} aria-label="Recipient's username with two button addons" />
                    <span className={globalDarkMode ? "input-group-text SearchBgD":"input-group-text SearchBg"} id="basic-addon2">
                        {globalSearchWord.length==0?(
                            <SearchIcon></SearchIcon>
                        ):(
                            <Close id="clearBtn" onClick={clearInput}></Close>
                        )}
                    </span>
                    <button style={{color:"white", zIndex:"0"}} onClick={clickSearch} className={globalDarkMode ? "btn btn-outline-secondary btnradius bgbtnD":"btn btn-outline-secondary btnradius bgbtn"} type="Search" id="searchBtn">Search</button>
                </div>
            </div>
            {
                globalFilteredData.length!=0?(
                    <div className={globalDarkMode ? "dataResultD":"dataResult"}>
                        {globalFilteredData.slice(0, 10).map((value, key)=>{
                            return <div className='container-fluid' id="searchCont">
                                <a href="#" className={globalDarkMode ? 'dataItemD':'dataItem'} onClick={()=>triggerSearch(value.BusStopCode)}>
                                    <div className="searchResults">{value.Description + " ("+value.BusStopCode+")"}</div>
                                </a>
                            </div>
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
