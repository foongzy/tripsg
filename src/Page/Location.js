import React, {useContext, useEffect, useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Components/Sidebar'
import useWindowDimensions from "../Components/useWindowDimensions"
import { GlobalContext } from "../Resources/GlobalContext.js";

function Location() {
    const {height, width}=useWindowDimensions();

    const{globalPgToggleKey}=useContext(GlobalContext)
    const[globalPgToggle,setGlobalPgToggle]=globalPgToggleKey
    const{globalTitleKey}=useContext(GlobalContext)
    const[globalTitle,setGlobalTitle]=globalTitleKey

    //Initialise sidebar display
    const initialiseSidebarDisplay=()=>{
        setGlobalPgToggle([{
            "isBusArrival":false,
            "isLocationPlanner":true,
            "isFeedback":false,
            "isAbout":false,
        }])
        setGlobalTitle("Location Planner")
    }
    useEffect(initialiseSidebarDisplay,[]);

    return (
        <div>
            <ToastContainer />
            <Navbar></Navbar>
            <div className="leftmargin background">
                <div className={width<551?"bg":"bgCom"}>
                    <div>Site Under Construction</div>
                </div>
            </div>
        </div>
    )
}

export default Location