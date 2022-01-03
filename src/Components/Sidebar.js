import React, {useState, useEffect, useContext} from 'react'
import {Link} from 'react-router-dom'
import { useHistory } from "react-router-dom";
import useWindowDimensions from "../Components/useWindowDimensions"
import '../assets/css/sidebar.css'
import Menu from '@material-ui/icons/Menu';
import Close from '@material-ui/icons/Close';
import Location from '@material-ui/icons/LocationOn';
import Feedback from '@material-ui/icons/Feedback';
import Bus from '@material-ui/icons/DepartureBoard';
import Info from '@material-ui/icons/Info';
import { GlobalContext } from "../Resources/GlobalContext.js";

function Sidebar() {
    const [sidebar, setSidebar]=useState(false)

    const{globalPgToggleKey}=useContext(GlobalContext)
    const[globalPgToggle,setGlobalPgToggle]=globalPgToggleKey
    const{globalTitleKey}=useContext(GlobalContext)
    const[globalTitle,setGlobalTitle]=globalTitleKey

    const maxwidth=550

    const history = useHistory()
    const {height, width}=useWindowDimensions();

    const setSideNav=()=>{
        if(width>maxwidth){
            setSidebar(true)
        }
    }
    useEffect(setSideNav,[width]);

    const showSidebar=()=>{
        setSidebar(!sidebar)
    }

    function clickHome(event){
        event.preventDefault();
        history.push("/BusArrival");
    }
    function clickLocation(event){
        event.preventDefault();
        history.push("/Location");
    }
    function clickFeedback(event){
        event.preventDefault();
        history.push("/Feedback");
    }
    function clickAbout(event){
        event.preventDefault();
        history.push("/About");
    }

    return (
        <div>
            {
                width>maxwidth?(
                    <div>
                        {/* computer */}
                        <nav class="navbar navv navbar-light">
                            <div class="container-fluid">
                                {/* <a class="navbar-brand" href="#">Navbar w/ text</a> */}
                                <Link to="#" className='menu-bars'>
                                    <Menu onClick={showSidebar} style={{color:"white", fontSize:"30px", marginBottom:"5px"}}></Menu>
                                </Link>
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                </ul>
                                <h2 style={{fontFamily:"sans-serif", color:"white", paddingTop:"7px", fontSize:"25px"}}>{globalTitle}</h2>
                            </div>
                        </nav>
      
                        <nav className='nav-menu out'>
                            <ul className='nav-menu-items'>
                                <li className='navbar-toggleCom'>
                                    <h2 style={{fontFamily:"monospace", color:"white"}}>TripSg</h2>
                                </li>
                                <li className='nav-text topline'>
                                    <a href="#" onClick={clickHome} className={globalPgToggle[0].isBusArrival==true?"active":""}>
                                        <Bus></Bus>
                                        <span className='spann'>Bus Arrivals</span>
                                    </a>
                                </li>
                                <li className='nav-text'>
                                    <a href="#" onClick={clickLocation} className={globalPgToggle[0].isLocationPlanner==true?"active":""}>
                                        <Location></Location>
                                        <span className='spann'>Location Planner</span>
                                    </a>
                                </li>
                                <li className='nav-text'>
                                    <a href="#" onClick={clickFeedback} className={globalPgToggle[0].isFeedback==true?"active":""}>
                                        <Feedback></Feedback>
                                        <span className='spann'>Feedback</span>
                                    </a>
                                </li>
                                <li className='nav-text botline'>
                                    <a href="#" onClick={clickAbout} className={globalPgToggle[0].isAbout==true?"active":""}>
                                        <Info></Info>
                                        <span className='spann'>About</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                ):(
                    <div>
                        {/* handphone */}
                        <nav class="navbar navv navbar-light">
                            <div class="container-fluid">
                                {/* <a class="navbar-brand" href="#">Navbar w/ text</a> */}
                                <Link to="#" className='menu-bars'>
                                    <Menu onClick={showSidebar} style={{color:"white", fontSize:"30px", marginBottom:"5px"}}></Menu>
                                </Link>
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                </ul>
                                <h2 style={{fontFamily:"monospace", color:"white", paddingTop:"10px"}}>TripSg</h2>
                            </div>
                        </nav>
                        <nav className={sidebar ? 'nav-menu active':'nav-menu'}>
                            <ul className='nav-menu-items' onClick={showSidebar}>
                                <li className='navbar-toggle'>
                                    <Link to="#" className='close-bars'>
                                        <Close style={{color:"white", fontSize:"30px", marginLeft:"-4px"}}></Close>
                                    </Link>
                                </li>
                                <li className='nav-text'>
                                    <a href="" onClick={clickHome} className={globalPgToggle[0].isBusArrival==true?"active":""}>
                                        <Bus></Bus>
                                        <span>Bus Arrivals</span>
                                    </a>
                                </li>
                                <li className='nav-text'>
                                    <a href="" onClick={clickLocation} className={globalPgToggle[0].isLocationPlanner==true?"active":""}>
                                        <Location></Location>
                                        <span>Location Planner</span>
                                    </a>
                                </li>
                                <li className='nav-text'>
                                    <a href="" onClick={clickFeedback} className={globalPgToggle[0].isFeedback==true?"active":""}>
                                        <Feedback></Feedback>
                                        <span>Feedback</span>
                                    </a>
                                </li>
                                <li className='nav-text'>
                                    <a href="" onClick={clickAbout} className={globalPgToggle[0].isAbout==true?"active":""}>
                                        <Info></Info>
                                        <span>About</span>
                                    </a>
                                </li>
            
                            </ul>
                        </nav>
                    </div>
                )
            }
            
        </div>
    )
}

export default Sidebar
