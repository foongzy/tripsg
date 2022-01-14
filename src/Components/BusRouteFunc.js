import React, {useEffect, useContext, useState} from 'react'
import axios from 'axios'
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { GlobalContext } from "../Resources/GlobalContext.js";
import useWindowDimensions from "../Components/useWindowDimensions"

function BusRouteFunc({BusNum, BusStop}) {
    const {height, width}=useWindowDimensions();
    const [currentBus, setCurrentBus] = useState("")
    const [currentBusDisp, setCurrentBusDisp] = useState(0)
    const [currentBusStopSeq, setCurrentBusStopSeq] = useState(0)

    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey

    return (
        <>
            <a href="#" id={globalDarkMode ? "inFoIconBRD":"inFoIconBR"}><InfoIcon /></a>
        </>
    )
}

export default BusRouteFunc
