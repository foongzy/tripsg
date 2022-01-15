import React, {useState, useEffect, useContext} from 'react'
import {Link} from 'react-router-dom'
import { useHistory } from "react-router-dom";
import useWindowDimensions from "../Components/useWindowDimensions"
import '../assets/css/sidebar.css'
import '../assets/css/sidebarD.css'
import Menu from '@material-ui/icons/Menu';
import Close from '@material-ui/icons/Close';
import Setting from '@material-ui/icons/Settings';
import Feedback from '@material-ui/icons/Feedback';
import Bus from '@material-ui/icons/DepartureBoard';
import Info from '@material-ui/icons/Info';
import { GlobalContext } from "../Resources/GlobalContext.js";
import axios from 'axios'

function Sidebar() {
    const [sidebar, setSidebar]=useState(false)

    const{globalPgToggleKey}=useContext(GlobalContext)
    const[globalPgToggle,setGlobalPgToggle]=globalPgToggleKey
    const{globalTitleKey}=useContext(GlobalContext)
    const[globalTitle,setGlobalTitle]=globalTitleKey
    const{globalTabToggleKey}=useContext(GlobalContext)
    const[globalTabToggle,setGlobalTabToggle]=globalTabToggleKey
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    const{globalDispNameKey}=useContext(GlobalContext)
    const[globalDisplayName,setGlobalDisplayName]=globalDispNameKey
    const{globalSessionIsLogKey}=useContext(GlobalContext)
    const[globalSessionIsLog,setGlobalSessionIsLog]=globalSessionIsLogKey
    const{globalIsLoadingKey}=useContext(GlobalContext)
    const[globalisLoading,setGlobalIsLoading]=globalIsLoadingKey
    const{globalShowBusRouteKey}=useContext(GlobalContext)
    const[globalShowBusRoute, setGlobalShowBusRoute]=globalShowBusRouteKey
    const{globalIsLoopKey}=useContext(GlobalContext)
    const[globalIsLoop, setGlobalIsLoop]=globalIsLoopKey

    const maxwidth=900

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
        setGlobalShowBusRoute(false)
        setGlobalIsLoop(false)
        setGlobalTabToggle(1)
        history.push("/BusArrival");
    }
    function clickSetting(event){
        event.preventDefault();
        setGlobalShowBusRoute(false)
        setGlobalIsLoop(false)
        setGlobalTabToggle(1)
        history.push("/Settings");
    }
    function clickFeedback(event){
        event.preventDefault();
        setGlobalShowBusRoute(false)
        setGlobalIsLoop(false)
        setGlobalTabToggle(1)
        history.push("/Feedback");
    }
    function clickAbout(event){
        event.preventDefault();
        setGlobalShowBusRoute(false)
        setGlobalIsLoop(false)
        setGlobalTabToggle(1)
        history.push("/About");
    }

    //initialise dark mode
    function initialiseDarkMode(){
        const retrieveDarkModeTmp=localStorage.getItem('darkModeToggle');
        const retrieveDarkMode=JSON.parse(retrieveDarkModeTmp);
        if(retrieveDarkMode!=null && retrieveDarkMode.isDarkMode==true){
            setGlobalDarkMode(true)
        }
    }
    useEffect(initialiseDarkMode,[]);

    //Initialise display name
    const initialiseDisplayName=()=>{
        const retrieveDispNameTmp=localStorage.getItem('tripsgname');
        const retrieveDispName=JSON.parse(retrieveDispNameTmp);
        if(retrieveDispName!=null){
            setGlobalDisplayName(retrieveDispName.displayname)
            if (globalSessionIsLog==false){
            const URL ="https://tripsg-db.herokuapp.com/api/logs/"+retrieveDispName.displayname+"/2/"
            setGlobalIsLoading(true)
            axios.post(URL).then(res=>{
                setGlobalSessionIsLog(true)
                setGlobalIsLoading(false)
            }).catch(error=>{
                console.log("error")
                setGlobalIsLoading(false)
            })
        }
        }else{
            history.push("/Login");
        }
    }
    useEffect(initialiseDisplayName,[]);

    return (
        <div>
            {
                width>maxwidth?(
                    <div>
                        {/* computer */}
                        <nav className={globalDarkMode ? "navbar navvD navbar-light":"navbar navv navbar-light"}>
                            <div className="container-fluid">
                                {/* <a class="navbar-brand" href="#">Navbar w/ text</a> */}
                                <Link to="#" className='menu-bars'>
                                    <Menu onClick={showSidebar} style={{color:"white", fontSize:"30px", marginBottom:"5px"}}></Menu>
                                </Link>
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                </ul>
                                <h2 style={{fontFamily:"sans-serif", color:"white", paddingTop:"7px", fontSize:"25px", marginRight:"10px"}}>{globalTitle}</h2>
                            </div>
                        </nav>
      
                        <nav className={globalDarkMode ? 'nav-menuD out':'nav-menu out'}>
                            <ul className='nav-menu-items'>
                                <li className={globalDarkMode ? 'navbar-toggleComD':'navbar-toggleCom'}>
                                    <h2 style={{fontFamily:"monospace", color:"white"}}>TripSg</h2>
                                </li>
                                <li className={globalDarkMode ? 'nav-textD toplineD':'nav-text topline'}>
                                    <li className={globalDisplayName.length<=14?'welcomeS':'welcome'}>Welcome {globalDisplayName}!</li>
                                </li>
                                <li className={globalDarkMode ? 'nav-textD toplineD':'nav-text topline'}>
                                    <a href="#" onClick={clickHome} className={globalPgToggle[0].isBusArrival==true?"active":""}>
                                        <Bus></Bus>
                                        <span className='spann'>Bus Arrivals</span>
                                    </a>
                                </li>
                                <li className={globalDarkMode ? 'nav-textD':'nav-text'}>
                                    <a href="#" onClick={clickFeedback} className={globalPgToggle[0].isFeedback==true?"active":""}>
                                        <Feedback></Feedback>
                                        <span className='spann'>Feedback</span>
                                    </a>
                                </li>
                                <li className={globalDarkMode ? 'nav-textD':'nav-text'}>
                                    <a href="#" onClick={clickAbout} className={globalPgToggle[0].isAbout==true?"active":""}>
                                        <Info></Info>
                                        <span className='spann'>About</span>
                                    </a>
                                </li>
                                <li className={globalDarkMode ? 'nav-textD botlineD':'nav-text botline'}>
                                    <a href="#" onClick={clickSetting} className={globalPgToggle[0].isLocationPlanner==true?"active":""}>
                                        <Setting></Setting>
                                        <span className='spann'>Settings</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                ):(
                    <div>
                        {/* handphone */}
                        <nav className={globalDarkMode ? "navbar navvD navbar-light":"navbar navv navbar-light"}>
                            <div className="container-fluid">
                                {/* <a class="navbar-brand" href="#">Navbar w/ text</a> */}
                                <Link to="#" className='menu-bars'>
                                    <Menu onClick={showSidebar} style={{color:"white", fontSize:"30px", marginBottom:"5px"}}></Menu>
                                </Link>
                                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                </ul>
                                <h2 style={{fontFamily:"monospace", color:"white", paddingTop:"10px"}}>TripSg</h2>
                            </div>
                        </nav>
                        <nav className={sidebar ? (globalDarkMode ?'nav-menuD active':'nav-menu active'):(globalDarkMode ?'nav-menuD':'nav-menu')}>
                            <ul className='nav-menu-items' onClick={showSidebar}>
                                <li className='navbar-toggle'>
                                    <Link to="#" className='close-bars'>
                                        <Close style={{color:"white", fontSize:"30px", marginLeft:"-4px"}}></Close>
                                    </Link>
                                </li>
                                <li className={globalDarkMode ? 'nav-textD toplineD':'nav-text topline'}>
                                    <li className={globalDisplayName.length<=14?'welcomeS':'welcome'}>Welcome {globalDisplayName}!</li>
                                </li>
                                <li className={globalDarkMode ? 'nav-textD toplineD':'nav-text topline'}>
                                    <a href="" onClick={clickHome} className={globalPgToggle[0].isBusArrival==true?"active":""}>
                                        <Bus></Bus>
                                        <span className='spann'>Bus Arrivals</span>
                                    </a>
                                </li>
                                <li className={globalDarkMode ? 'nav-textD':'nav-text'}>
                                    <a href="" onClick={clickFeedback} className={globalPgToggle[0].isFeedback==true?"active":""}>
                                        <Feedback></Feedback>
                                        <span className='spann'>Feedback</span>
                                    </a>
                                </li>
                                <li className={globalDarkMode ? 'nav-textD':'nav-text'}>
                                    <a href="" onClick={clickAbout} className={globalPgToggle[0].isAbout==true?"active":""}>
                                        <Info></Info>
                                        <span className='spann'>About</span>
                                    </a>
                                </li>
                                <li className={globalDarkMode ? 'nav-textD botlineD':'nav-text botline'}>
                                    <a href="" onClick={clickSetting} className={globalPgToggle[0].isLocationPlanner==true?"active":""}>
                                        <Setting></Setting>
                                        <span className='spann'>Settings</span>
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
