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
                                                    <h6>Site Under Construction</h6>
                                                </CardBody>
                                                <CardFooter className={classes.cardFooter}>
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