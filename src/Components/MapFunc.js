import React, {useContext, useEffect, useState} from "react";
import { GlobalContext } from "../Resources/GlobalContext.js";
import useWindowDimensions from "../Components/useWindowDimensions"
import MapIcon from '@material-ui/icons/Map';

function MapFunc() {
    const {height, width}=useWindowDimensions();
    const [mapURLState, setMapURLState] = useState("")

    const{globalbusstopcodeKey}=useContext(GlobalContext)
    const[globalbusstopcode,setGlobalbusstopcode]=globalbusstopcodeKey
    const{globalbusstopcodeNearbyKey}=useContext(GlobalContext)
    const[globalbusstopcodeNearby,setGlobalbusstopcodeNearby]=globalbusstopcodeNearbyKey
    const{globalbusstopcodeBMKey}=useContext(GlobalContext)
    const[globalbusstopcodeBM,setGlobalbusstopcodeBM]=globalbusstopcodeBMKey
    const{globalFullBusstopListKey}=useContext(GlobalContext)
    const[globalFullBusstopList,setGlobalFullBusstopList]=globalFullBusstopListKey
    const{globalTabToggleKey}=useContext(GlobalContext)
    const[globalTabToggle,setGlobalTabToggle]=globalTabToggleKey
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    const{globalLocationKey}=useContext(GlobalContext)
    const[globalLocation,setGlobalLocation]=globalLocationKey
    const{globalNearbyBusStopsKey}=useContext(GlobalContext)
    const[globalnearbyBusStops,setGlobalNearbyBusStops]=globalNearbyBusStopsKey

    let MapHeight=height-220
    let MapWidth
    //convert 1rem to px
    let px=1 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    if (width>991){
        MapWidth=800-(2*px)
    }else if(width>575){
        MapWidth=498-(2*px)
    }else{
        MapWidth=width-(3*px)-2
    }
    const MapZoom=20
    const markerIcon="fa-bus"
    const markerColor="red"
    let mapType
    if (globalDarkMode){
        mapType="Night"
    }else{
        mapType="Default"
    }
    const MapURLStart="https://www.onemap.gov.sg/amm/amm.html?mapStyle="+mapType+"&zoomLevel="
    let MapURL=MapURLStart+MapZoom
    const MapURLEnd="&popupWidth=200"

    const getMap=()=>{
        let latitude
        let longitude
        let code
        if(globalTabToggle==1){
            latitude=globalbusstopcode[0].lat
            longitude=globalbusstopcode[0].lng
            code=globalbusstopcode[0].busstopcode
        }else if(globalTabToggle==2){
            latitude=globalbusstopcodeBM[0].lat
            longitude=globalbusstopcodeBM[0].lng
            code=globalbusstopcodeBM[0].busstopcode
        }else if(globalTabToggle==3){
            latitude=globalbusstopcodeNearby[0].lat
            longitude=globalbusstopcodeNearby[0].lng
            code=globalbusstopcodeNearby[0].busstopcode
        }else{
            console.log("error")
        }
        MapURL=MapURL+"&marker=latLng:"+latitude+","+longitude+"!icon:"+markerIcon+"!colour:"+markerColor

        //add user position if nearby
        const ifNearby = globalnearbyBusStops.some( nearby=> nearby.BusStopCode == code);
        if(ifNearby){
            MapURL=MapURL+"&marker=latLng:"+globalLocation.coordinates.lat+","+globalLocation.coordinates.lng+"!icon:"+"fa-street-view"+"!colour:"+"blue"
        }
            
        MapURL=MapURL+MapURLEnd
        document.getElementById('map').src = MapURL;
        setMapURLState(MapURL)         
    }
    useEffect(getMap,[globalbusstopcode, globalbusstopcodeNearby, globalbusstopcodeBM])

    return (
        <>
            <MapIcon data-bs-toggle="modal" data-bs-target="#mapModal" id={globalDarkMode ? "mapIconD":"mapIcon"}></MapIcon>
            <div class="modal fade" id="mapModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class={globalDarkMode ? "modal-content colorModalD":"modal-content colorModal"}>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Bus Stop Location</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-0">
                            <iframe id="map" src={mapURLState} height={MapHeight} width={MapWidth} scrolling="no" frameborder="0" allowfullscreen="allowfullscreen"></iframe>                   
                            </div>
                        </div>                                              
                        <div class="modal-footer">
                            <button type="button" className={globalDarkMode ? "btn btn-secondary bgbtnD":"btn btn-secondary bgbtn"} data-bs-dismiss="modal">Close</button>
                         </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MapFunc
