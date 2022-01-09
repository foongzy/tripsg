import React, {useContext, useEffect, useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Components/Sidebar'
import useWindowDimensions from "../Components/useWindowDimensions"
import { GlobalContext } from "../Resources/GlobalContext.js";
import GridContainer from "../Components/Grid/GridContainer.js";
import GridItem from "../Components/Grid/GridItem.js";
import Card from "../Components/Card/Card.js";
import CardBody from "../Components/Card/CardBody.js";
import CardHeader from "../Components/Card/CardHeader.js";
import CardFooter from "../Components/Card/CardFooter.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/aboutPage";
import '../assets/css/settings.css'
import '../assets/css/settingsD.css'
import axios from 'axios'

const useStyles = makeStyles(styles);

function Settings(props) {
    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    const {height, width}=useWindowDimensions();

    const [nameInput, setNameInput] = useState("");
    const [nameInputError, setNameInputError] = useState(false);

    const{globalPgToggleKey}=useContext(GlobalContext)
    const[globalPgToggle,setGlobalPgToggle]=globalPgToggleKey
    const{globalTitleKey}=useContext(GlobalContext)
    const[globalTitle,setGlobalTitle]=globalTitleKey
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    const{globalDispNameKey}=useContext(GlobalContext)
    const[globalDisplayName,setGlobalDisplayName]=globalDispNameKey

    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();
    const { ...rest } = props;

    function updateNameInput(event){
        setNameInput(event.target.value);
    }

    //Initialise sidebar display
    const initialiseSidebarDisplay=()=>{
        setGlobalPgToggle([{
            "isBusArrival":false,
            "isLocationPlanner":true,
            "isFeedback":false,
            "isAbout":false,
        }])
        setGlobalTitle("Settings")
    }
    useEffect(initialiseSidebarDisplay,[]);

    function darkModeToggle(event){
        setGlobalDarkMode(!globalDarkMode)
        const toggle={
            "isDarkMode":!globalDarkMode
        }
        localStorage.removeItem("darkModeToggle")
        localStorage.setItem("darkModeToggle",JSON.stringify(toggle))
    }

    function clickNameUpdate(event){
        event.preventDefault();
        if(nameInput!=""){
            const URL ="https://tripsg-db.herokuapp.com/api/logs/"+globalDisplayName+"/3/"
            const data={
                "newuser": nameInput
            }
            axios.post(URL,data).then(res=>{
            }).catch(error=>{
                console.log("error")
            })
            //save to local storage
            const tripsgname={
                "displayname":nameInput
            }
            localStorage.removeItem("tripsgname")
            localStorage.setItem("tripsgname",JSON.stringify(tripsgname))
            setGlobalDisplayName(nameInput)
            setNameInputError(false)
            setNameInput("")
            toast.success('Successfully updated display name', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }else{
            toast.error('Name field cannot be empty', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setNameInputError(true)
        }
    }

    return (
        <div className={globalDarkMode ? "fullbgD":"fullbgSe"}>
            <ToastContainer />
            <Navbar></Navbar>
            <div className="leftmargin background">
                <div className={width<551?(globalDarkMode?"bgD":"bg"):(globalDarkMode?"bgComD":"bgCom")}>
                    {/* Settings page */}
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
                                                <h4>Settings</h4>
                                                </CardHeader>
                                                <CardBody>
                                                <div className="accordion accordion-flush" id="accordionFlushExample">
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id="flush-headingOne">
                                                        <button className="accordion-button collapsed" id={globalDarkMode?"accordianBtn1D":"accordianBtn1"} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                                            Display Name
                                                        </button>
                                                        </h2>
                                                        <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                                        <div className={globalDarkMode?"accordion-bodyD":"accordion-body"}>
                                                        <div className="row">
                                                                        <div className="col-sm-6 borderBot">
                                                                            <div className="col-sm-12">
                                                                                <label>You can update your display name here.</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-6 borderLeftt">
                                                                            <div className="col-sm-12">
                                                                                <label style={{marginBottom:"5px"}}>Current display name: {globalDisplayName}</label>
                                                                                <br />
                                                                                <label style={{marginBottom:"5px"}}>Enter new display name:</label>
                                                                                <div className="custom-file">
                                                                                    <input type="text" placeholder="Enter display name" maxLength="20" className={nameInputError==true?(globalDarkMode?"form-control form-control-sm inputBoxErrD":"form-control form-control-sm inputBoxErr"):(globalDarkMode?"form-control form-control-sm inputBoxD":"form-control form-control-sm inputBox")} id="exampleFormControlInput1" value={nameInput} onChange={updateNameInput}/>
                                                                                </div>
                                                                                <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{marginTop:"15px"}}>
                                                                                    <button className="btn btn-secondary bgbtn " id="button" onClick={clickNameUpdate}>Update</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header" id={globalDarkMode?"flush-headingTwoD":"flush-headingTwo"}>
                                                        <button className="accordion-button collapsed" id={globalDarkMode?"accordianBtn2D":"accordianBtn2"} type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                                            Dark Mode
                                                        </button>
                                                        </h2>
                                                        <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                                        <div className={globalDarkMode?"accordion-bodyD":"accordion-body"}>
                                                        <div className="row">
                                                                        <div className="col-sm-6 borderBot">
                                                                            <div className="col-sm-12">
                                                                                <label>You can toggle dark mode on/off here.</label>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-sm-6 borderLeftt">
                                                                            <div className="col-sm-12" style={{display:"flex", alignContent:"space-between"}}>
                                                                                <label style={{marginBottom:"5px"}}>{globalDarkMode?"Toggle dark mode off:":"Toggle dark mode on:"}</label>

                                                                                <div class="form-check form-switch" style={{alignItems:"flex-end", marginLeft: "auto"}}>
                                                                                    {
                                                                                        globalDarkMode==true?(
                                                                                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheck" onClick={darkModeToggle} checked/>
                                                                                        ):(
                                                                                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheck" onClick={darkModeToggle}/>
                                                                                        )
                                                                                    }
                                                                                    
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    </div>
  
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

export default Settings