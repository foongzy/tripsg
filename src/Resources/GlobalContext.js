import React, {createContext, useState} from "react"

//create context to hold global state and export this to other components
//context is like a container for the global state
export const GlobalContext=createContext();

function GlobalContextProvider(props){
    const[globalSearchWord,setGlobalSearchWord]=useState("")
    const[globalFilteredData,setGlobalFilteredData]=useState([])
    const[globalArrivalData,setGlobalArrivalData]=useState([])
    const[globalbusstopcode,setGlobalbusstopcode]=useState([{
        "busstopcode":"",
        "description": "",
        "lat": "",
        "lng": "",
    }])
    const[globalbusstopcodeNearby,setGlobalbusstopcodeNearby]=useState([{
        "busstopcode":"",
        "description": "",
        "lat": "",
        "lng": "",
    }])
    const[globalbusstopcodeBM,setGlobalbusstopcodeBM]=useState([{
        "busstopcode":"",
        "description": "",
        "lat": "",
        "lng": "",
    }])
    const[globalnearbyBusStops,setGlobalNearbyBusStops]=useState([])
    const[globalTabToggle,setGlobalTabToggle]=useState(1)
    const[globalRefreshToggle,setGlobalRefreshToggle]=useState([{
        "refresh":false,
        "busNo": "",
    }]);
    const[globalBookmarked,setGlobalBookmarked]=useState([])
    const[globalisBookmarked,setGlobalisBookmarked]=useState(false)
    const[globalFullBusstopList,setGlobalFullBusstopList]=useState([])
    const[globalPgToggle,setGlobalPgToggle]=useState([{
        "isBusArrival":true,
        "isLocationPlanner":false,
        "isFeedback":false,
        "isAbout":false,
    }])
    const[globalTitle,setGlobalTitle]=useState("Bus Arrivals")
    const[globalDarkMode,setGlobalDarkMode]=useState(false)
    const[globalDisplayName,setGlobalDisplayName]=useState("")
    const[globalSessionIsLog,setGlobalSessionIsLog]=useState(false)
    const[globalSearchRadius,setGlobalSearchRadius]=useState(300)
    const[globalLocation,setGlobalLocation]=useState("")

    return(
        <GlobalContext.Provider
        value={{
            globalSearchWordKey:[globalSearchWord,setGlobalSearchWord],
            globalFilteredDataKey:[globalFilteredData,setGlobalFilteredData],
            globalArrivalDataKey:[globalArrivalData,setGlobalArrivalData],
            globalbusstopcodeKey:[globalbusstopcode,setGlobalbusstopcode],
            globalbusstopcodeNearbyKey:[globalbusstopcodeNearby,setGlobalbusstopcodeNearby],
            globalbusstopcodeBMKey:[globalbusstopcodeBM,setGlobalbusstopcodeBM],
            globalNearbyBusStopsKey:[globalnearbyBusStops,setGlobalNearbyBusStops],
            globalTabToggleKey:[globalTabToggle,setGlobalTabToggle],
            globalRefreshToggleKey:[globalRefreshToggle,setGlobalRefreshToggle],
            globalBookmarkKey:[globalBookmarked,setGlobalBookmarked],
            globalisBookmarkKey:[globalisBookmarked,setGlobalisBookmarked],
            globalFullBusstopListKey:[globalFullBusstopList,setGlobalFullBusstopList],
            globalPgToggleKey:[globalPgToggle,setGlobalPgToggle],
            globalTitleKey:[globalTitle,setGlobalTitle],
            globalDarkModeKey:[globalDarkMode,setGlobalDarkMode],
            globalDispNameKey:[globalDisplayName,setGlobalDisplayName],
            globalSessionIsLogKey:[globalSessionIsLog,setGlobalSessionIsLog],
            globalSearchRadiusKey:[globalSearchRadius,setGlobalSearchRadius],
            globalLocationKey:[globalLocation,setGlobalLocation]
        }}
        >
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;