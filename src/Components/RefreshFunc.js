import React, {useContext} from 'react'
import { GlobalContext } from "../Resources/GlobalContext.js";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Refresh from '@material-ui/icons/Refresh';

function RefreshFunc() {
    const{globalRefreshToggleKey}=useContext(GlobalContext)
    const[globalRefreshToggle,setGlobalRefreshToggle]=globalRefreshToggleKey
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    const{globalbusstopcodeKey}=useContext(GlobalContext)
    const[globalbusstopcode,setGlobalbusstopcode]=globalbusstopcodeKey
    const{globalIsLoadingKey}=useContext(GlobalContext)
    const[globalisLoading,setGlobalIsLoading]=globalIsLoadingKey
    const{globalSearchWordKey}=useContext(GlobalContext)
    const[globalSearchWord,setGlobalSearchWord]=globalSearchWordKey
    const{globalBookmarkKey}=useContext(GlobalContext)
    const[globalBookmarked,setGlobalBookmarked]=globalBookmarkKey
    const{globalArrivalDataKey}=useContext(GlobalContext)
    const[globalArrivalData,setGlobalArrivalData]=globalArrivalDataKey
    const{globalFullBusstopListKey}=useContext(GlobalContext)
    const[globalFullBusstopList,setGlobalFullBusstopList]=globalFullBusstopListKey
    const{globalFilteredDataKey}=useContext(GlobalContext)
    const[globalFilteredData,setGlobalFilteredData]=globalFilteredDataKey
    
    const URL='https://tripsg-db.herokuapp.com/api/busstops/'

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

    function refreshClick(event){
        event.preventDefault();
        const URLbusArrival=URL+globalbusstopcode[0].busstopcode+"/"
        setGlobalIsLoading(true)
        axios.get(URLbusArrival).then(res=>{
            let obtainedData=res.data.Services
            
            //Sort bus numbers
            const ifBmark = globalBookmarked.some( bookmark=> bookmark.BusStopCode == globalbusstopcode[0].busstopcode);
            if(ifBmark){
                //Find bookmark bus stop details from selection
                const bookmarkExtracted=globalBookmarked.filter((value)=>{
                    return (value.BusStopCode.toLowerCase()==res.data.BusStopCode.toLowerCase());
                });
                obtainedData=sortArrivalData(bookmarkExtracted[0].Starred, obtainedData)
            }else{
                obtainedData.sort(function(a, b) {
                    return parseFloat(a.ServiceNo) - parseFloat(b.ServiceNo);
                });
            }

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

                //Find bus stop details using bus stop code
                const busExtracted=globalFullBusstopList.filter((value)=>{
                    return (value.BusStopCode.toLowerCase()==res.data.BusStopCode.toLowerCase());
                });

                const busStopDets=[{
                    "busstopcode":res.data.BusStopCode,
                    "description": busExtracted[0].Description,
                    "lat": busExtracted[0].Latitude,
                    "lng": busExtracted[0].Longitude,
                }]
                setGlobalbusstopcode(busStopDets)
            }
               
            //reset
            setGlobalSearchWord('')
            setGlobalFilteredData([])
            setGlobalIsLoading(false)

            if(globalDarkMode){
                toast.success('Refresh successful', {
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
                toast.success('Refresh successful', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }).catch(error=>{
            setGlobalIsLoading(false)
            toastError('Server error')
        })
    }

    return (
        <Refresh onClick={refreshClick} id={globalDarkMode ? "refreshIconD":"refreshIcon"}></Refresh>
    )
}

export default RefreshFunc
