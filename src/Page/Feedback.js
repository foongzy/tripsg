import React, {useContext, useEffect, useState} from 'react'
import { GlobalContext } from "../Resources/GlobalContext.js";
import LoadingScreen from "../Components/loadingScreen";
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/css/feedback.css'
import '../assets/css/feedbackD.css'
import axios from 'axios'
import { useHistory } from "react-router-dom";


const useStyles = makeStyles(styles);

function Feedback(props) {
    const history = useHistory()
    const [cardAnimaton, setCardAnimation] = useState("cardHidden");
    const [nameInput, setNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [feedbackInput, setFeedbackInput] = useState("");
    const [nameInputError, setNameInputError] = useState(false);
    const [feedbackInputError, setFeedbackInputError] = useState(false);
    const [emailInputError, setEmailInputError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const{globalPgToggleKey}=useContext(GlobalContext)
    const[globalPgToggle,setGlobalPgToggle]=globalPgToggleKey
    const{globalTitleKey}=useContext(GlobalContext)
    const[globalTitle,setGlobalTitle]=globalTitleKey
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    const{globalDispNameKey}=useContext(GlobalContext)
    const[globalDisplayName,setGlobalDisplayName]=globalDispNameKey

    const {height, width}=useWindowDimensions();
    
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();
    const { ...rest } = props;

    function updateNameInput(event){
        setNameInput(event.target.value);
    }

    function updateEmailInput(event){
        setEmailInput(event.target.value);
    }

    function updateFeedbackInput(event){
        setFeedbackInput(event.target.value);
    }

    function toastError(errorMsg){
        if(globalDarkMode){
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }else{
            toast.error(errorMsg, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    //Initialise sidebar display
    const initialiseSidebarDisplay=()=>{
        setGlobalPgToggle([{
            "isBusArrival":false,
            "isLocationPlanner":false,
            "isFeedback":true,
            "isAbout":false,
        }])
        setGlobalTitle("Feedback")
    }
    useEffect(initialiseSidebarDisplay,[]);

    //Initialise display name
    const initialiseDisplayName=()=>{
        const retrieveDispNameTmp=localStorage.getItem('tripsgname');
        const retrieveDispName=JSON.parse(retrieveDispNameTmp);
        if(retrieveDispName!=null){
            setGlobalDisplayName(retrieveDispName.displayname)
            setNameInput(retrieveDispName.displayname)
        }else{
            history.push("/Login");
        }
    }
    useEffect(initialiseDisplayName,[]);

    function submitform(event){
        if(nameInput!=""){
            if(feedbackInput!=""){
                if(/^[A-Za-z\s]+$/.test(nameInput)){
                    if (emailInput.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)||emailInput==""){
                        const data={
                            "name": nameInput,
                            "email": emailInput,
                            "feedback": feedbackInput,
                        }
                        const URL="https://tripsg.pythonanywhere.com/api/feedback/"
                        setIsLoading(true)
                        axios.post(URL, data).then(res=>{
                            if (globalDisplayName!=""){
                                setNameInput(globalDisplayName)
                            }else{
                                setNameInput("")
                            }
                            setFeedbackInput("")
                            setEmailInput("")
                            setNameInputError(false)
                            setFeedbackInputError(false)
                            setEmailInputError(false)
                            setIsLoading(false)
                            if(globalDarkMode){
                                toast.success('Thank you for your feedback', {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "dark",
                                });
                            }else{
                                toast.success('Thank you for your feedback', {
                                    position: "top-right",
                                    autoClose: 5000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                });
                            }
                        }).catch(error=>{
                            setIsLoading(false)
                            toastError('Error submitting feedback. Please try again')
                        })
                    }else{
                        toastError('Please enter a valid email')
                        setNameInputError(false)
                        setFeedbackInputError(false)
                        setEmailInputError(true)
                    }
                }else{
                    toastError('Name field can only contain letters')
                    setNameInputError(true)
                    setFeedbackInputError(false)
                    setEmailInputError(false)
                }          
            }else{
                toastError('Feedback field cannot be empty')
                setNameInputError(false)
                setFeedbackInputError(true)
                setEmailInputError(false)
            }
        }else{
            toastError('Name field cannot be empty')
            setNameInputError(true)
            setFeedbackInputError(false)
            setEmailInputError(false)
        }
    }

    return (
        <div className={globalDarkMode ? "fullbgD":"fullbg"}>
            {
                isLoading?
                <LoadingScreen />:null
            }
            <ToastContainer />
            <Navbar></Navbar>
            <div className="leftmargin background">
                <div className={width<551?(globalDarkMode?"bgD":"bg"):(globalDarkMode?"bgComD":"bgCom")}>
                    {/* Feedback page */}
                    <div
                        className={classes.pageHeader} style={{zIndex:"0"}}
                    >
                        <div className={classes.container}>
                            <div className="cardCont">
                                <GridContainer justify="center">
                                    <GridItem xs={12} sm={12} md={11}>
                                        <Card className={classes[cardAnimaton]} style={{marginTop:"-10px"}}>
                                            <form className={classes.form} id={globalDarkMode?"feedbackCardbgD":""}>
                                                <CardHeader color="primary" className={classes.cardHeader} style={{background:"linear-gradient(60deg, #5680e9, #1b7ced)", boxShadow:"0 12px 20px -10px rgb(156 39 176 / 28%), 0 4px 20px 0px rgb(0 0 0 / 12%), 0 7px 8px -5px rgb(156 39 176 / 20%)", color:"white"}}>
                                                    <h4>Feedback</h4>
                                                </CardHeader>
                                                <CardBody>
                                                    <label for="exampleFormControlInput1" class="form-label feedbackExp">* refers to mandatory fields</label>
                                                    <div class="mb-3">
                                                        <label for="exampleFormControlInput1" class="form-label feedbackHead">Name*</label>
                                                        <input type="text" maxLength="50" class={nameInputError==true?(globalDarkMode?"form-control inputBoxErrD":"form-control inputBoxErr"):(globalDarkMode?"form-control inputBoxD":"form-control inputBox")} id="exampleFormControlInput1" value={nameInput} onChange={updateNameInput} placeholder="Enter name" />
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="exampleFormControlInput1" class="form-label feedbackHead">Email</label>
                                                        <input type="email" maxLength="50" class={emailInputError==true?(globalDarkMode?"form-control inputBoxErrD":"form-control inputBoxErr"):(globalDarkMode?"form-control inputBoxD":"form-control inputBox")} id="exampleFormControlInput1" value={emailInput} onChange={updateEmailInput} placeholder="Enter email" />
                                                    </div>
                                                    <div class="mb-3">
                                                        <label for="exampleFormControlTextarea1" class="form-label feedbackHead">Feedback*</label>
                                                        <textarea maxLength="500" class={feedbackInputError==true?(globalDarkMode?"form-control inputBoxErrD":"form-control inputBoxErr"):(globalDarkMode?"form-control inputBoxD":"form-control inputBox")} placeholder="Enter feedback" id="exampleFormControlTextarea1" rows="3" value={feedbackInput} onChange={updateFeedbackInput}></textarea>
                                                    </div>
                                                </CardBody>
                                                <CardFooter className={classes.cardFooter}  id="test">
                                                    <button type="button" id="feedbackBtn" className={globalDarkMode ? "btn btn-secondary bgbtnD":"btn btn-secondary bgbtn"} style={{alignItems:"flex-end"}} onClick={submitform}>Submit</button>
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

export default Feedback
