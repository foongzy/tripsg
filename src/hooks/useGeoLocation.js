import React, {useEffect, useState, useContext} from 'react'
import { GlobalContext } from "../Resources/GlobalContext.js";

const useGeoLocation=()=> {
    const{globalTriggerLocationRefreshKey}=useContext(GlobalContext)
    const[globalTriggerLocationRefresh, setGlobalTriggerLocationRefresh]=globalTriggerLocationRefreshKey
    const[location, setLocation]=useState({
        loaded:false,
        coordinates:{lat:"", lng:""},
    });

    const onSuccess=location=>{
      setLocation({
          loaded: true,
          coordinates:{
            lat: location.coords.latitude, 
            lng: location.coords.longitude,
          },
          error: ""
      });
    };

    const onError=error=>{
      setLocation({
          loaded: true,
          coordinates:{
            lat: "", 
            lng: "",
          },
          error,
      })
    }

    useEffect(()=>{
        if(!("geolocation" in navigator)){
          onError({
            code:0,
            message:"Geolocation not supported",
          })
  
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError)
        setGlobalTriggerLocationRefresh(false)
    },[globalTriggerLocationRefresh])

    return location
}

export default useGeoLocation
