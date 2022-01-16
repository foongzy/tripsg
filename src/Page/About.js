import React, {useContext, useEffect} from 'react'
import { GlobalContext } from "../Resources/GlobalContext.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Components/Sidebar'
import useWindowDimensions from "../Components/useWindowDimensions"
import GridContainer from "../Components/Grid/GridContainer.js";
import GridItem from "../Components/Grid/GridItem.js";
import Card from "../Components/Card/Card.js";
import CardBody from "../Components/Card/CardBody.js";
import CardHeader from "../Components/Card/CardHeader.js";
import CardFooter from "../Components/Card/CardFooter.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/aboutPage";
import '../assets/css/about.css'
import '../assets/css/aboutD.css'
import LinkedIn from '@material-ui/icons/LinkedIn';
import GitHub from '@material-ui/icons/GitHub';

const useStyles = makeStyles(styles);

function About(props) {
    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    const {height, width}=useWindowDimensions();

    const{globalPgToggleKey}=useContext(GlobalContext)
    const[globalPgToggle,setGlobalPgToggle]=globalPgToggleKey
    const{globalTitleKey}=useContext(GlobalContext)
    const[globalTitle,setGlobalTitle]=globalTitleKey
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey

    //Initialise sidebar display
    const initialiseSidebarDisplay=()=>{
        setGlobalPgToggle([{
            "isBusArrival":false,
            "isLocationPlanner":false,
            "isFeedback":false,
            "isAbout":true,
        }])
        setGlobalTitle("About")
    }
    useEffect(initialiseSidebarDisplay,[]);
    
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();
    const { ...rest } = props;

    return (
        <div className={globalDarkMode ? "fullbgD":"fullbgab"}>
            <ToastContainer />
            <Navbar></Navbar>
            <div className="leftmargin background">
                <div className={width<551?(globalDarkMode?"bgD":"bgg"):(globalDarkMode?"bgComD":"bggCom")}>
                    {/* About page */}
                    <div
                        className={classes.pageHeader} style={{zIndex:"0"} }
                    >
                        <div className={classes.container}>
                            <div className="cardCont">
                                <GridContainer justify="center">
                                    <GridItem xs={12} sm={12} md={11}>
                                        <Card className={classes[cardAnimaton]} style={{marginTop:"-10px"}}>
                                            <form className={classes.form} id={globalDarkMode?"aboutCardbgD":""}>
                                                <CardHeader className={classes.cardHeader} style={{background:"linear-gradient(60deg, #5680e9, #1b7ced)", boxShadow:"0 12px 20px -10px rgb(156 39 176 / 28%), 0 4px 20px 0px rgb(0 0 0 / 12%), 0 7px 8px -5px rgb(156 39 176 / 20%)", color:"white"}}>
                                                <h4>About</h4>
                                                </CardHeader>
                                                <CardBody>
                                                    <div className="aboutBody">
                                                        <div className='container-fluid '>
                                                            <label>TripSg is a personal full stack project that seeks to quickly provide users with their bus arrival information.</label>
                                                        </div>
                                                        <div className='container-fluid '>
                                                            <h5 className='marA'><b>Features</b></h5>
                                                            <ul>
                                                                <li>Search for bus stops using bus stop name, bus stop code or bus number</li>
                                                                <li>Quicksearch enables you to quickly obtain bus arrival info near you</li>
                                                                <li>Bus arrival info includes bus route, bus capacity and wheelchair accessibility</li>
                                                                <li>Show bus stop location on map</li>
                                                                <li>Personalisation: <br />
                                                                    <ul>
                                                                        <li>Bookmarking commonly visited bus stops</li>
                                                                        <li>Starring bus services for bookmarked bus stops </li>                                                     
                                                                        <li>Change display name</li>
                                                                        <li>Change nearby radius</li>
                                                                        <li>Dark Mode</li>
                                                                    </ul>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='container-fluid '>
                                                            <h5 className='marA'><b>Source</b></h5>
                                                            <label className='marC'><b>Bus info:</b> TripSg utilizes real time data from the Land Transport Authority of Singapore (LTA). </label>
                                                            <br />
                                                            <br />
                                                            <label className='marC'><b>Code:</b> You can view the sourcecode <a href="https://github.com/foongzy/tripsg" target="_blank">here</a>. </label>
                                                        </div>
                                                        <div className='container-fluid linee'>
                                                        <h5 className='marA'><b>Author</b></h5>
                                                            <div style={{display:"flex", justifyContent:"space-between"}}>
                                                                <label className='marB marC'>
                                                                    Foong Zhi Yu
                                                                </label>
                                                                <div style={{marginLeft:"auto"}}>
                                                                    <a href="https://www.linkedin.com/in/foong-zhi-yu/" target="_blank"><LinkedIn id={globalDarkMode ?"aboutIconD":"aboutIcon"} className="marR"/></a>
                                                                    <a href="https://github.com/foongzy" target="_blank"><GitHub id={globalDarkMode ?"gitD":"git"}/></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                                <CardFooter className={classes.cardFooter}>
                                                    <label className='disclaimer'>
                                                        Disclaimer: <br />
                                                        By using TripSg, you agree that the service is provided for your own personal use at no cost.<br />
                                                        TripSg assumes no responsibility for any damages incurred through the use of the services provided by the application.<br />
                                                        Bus arrival information provided by TripSg application is provided "as-is" by Singapore's Land Transport Authority and TripSg cannot guarantee the reliability and accuracy of the information.
                                                    </label>
                                                </CardFooter>
                                            </form>
                                        </Card>
                                    </GridItem>
                                </GridContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About