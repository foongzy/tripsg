import React from 'react'
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
import '../assets/css/feedback.css'
import axios from 'axios'

const useStyles = makeStyles(styles);

function Feedback(props) {
    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    const [nameInput, setNameInput] = React.useState("");
    const [emailInput, setEmailInput] = React.useState("");
    const [feedbackInput, setFeedbackInput] = React.useState("");
    const [nameInputError, setNameInputError] = React.useState(false);
    const [feedbackInputError, setFeedbackInputError] = React.useState(false);
    const [emailInputError, setEmailInputError] = React.useState(false);

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
                        const URL="https://tripsg-db.herokuapp.com/api/feedback/"
                        axios.post(URL, data).then(res=>{
                            setNameInput("")
                            setFeedbackInput("")
                            setEmailInput("")
                            setNameInputError(false)
                            setFeedbackInputError(false)
                            setEmailInputError(false)
                            toast.success('Thank you for your feedback', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                        }).catch(error=>{
                            toast.error('Error submitting feedback. Please try again', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                        })
                    }else{
                        toast.error('Please enter a valid email', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        setNameInputError(false)
                        setFeedbackInputError(false)
                        setEmailInputError(true)
                    }
                }else{
                    toast.error('Name field can only contain letters', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setNameInputError(true)
                    setFeedbackInputError(false)
                    setEmailInputError(false)
                }          
            }else{
                toast.error('Feedback field cannot be empty', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setNameInputError(false)
                setFeedbackInputError(true)
                setEmailInputError(false)
            }
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
            setFeedbackInputError(false)
            setEmailInputError(false)
        }
    }

    return (
        <div>
            <ToastContainer />
            <Navbar></Navbar>
            <div className="leftmargin background">
                <div className={width<551?"bg":"bgCom"}>
                    {/* Feedback page */}
                    <div
                        className={classes.pageHeader} style={{zIndex:"0"}}
                    >
                        <div className={classes.container}>
                            <div className="cardCont">
                                <GridContainer justify="center">
                                    <GridItem xs={12} sm={12} md={11}>
                                        <Card className={classes[cardAnimaton]} style={{marginTop:"-10px"}}>
                                            <form className={classes.form}>
                                                <CardHeader color="primary" className={classes.cardHeader} style={{background:"linear-gradient(60deg, #8860d0, #6b3fa0)", boxShadow:"0 12px 20px -10px rgb(156 39 176 / 28%), 0 4px 20px 0px rgb(0 0 0 / 12%), 0 7px 8px -5px rgb(156 39 176 / 20%)", color:"white"}}>
                                                <h4>Feedback</h4>
                                                </CardHeader>
                                                <CardBody>
                                                <label for="exampleFormControlInput1" class="form-label feedbackExp">* refers to mandatory fields</label>
                                                <div class="mb-3">
                                                    <label for="exampleFormControlInput1" class="form-label feedbackHead">Name*</label>
                                                    <input type="text" maxLength="50" class={nameInputError==true?"form-control inputBoxErr":"form-control inputBox"} id="exampleFormControlInput1" value={nameInput} onChange={updateNameInput} placeholder="Enter name" />
                                                </div>
                                                <div class="mb-3">
                                                    <label for="exampleFormControlInput1" class="form-label feedbackHead">Email</label>
                                                    <input type="email" maxLength="50" class={emailInputError==true?"form-control inputBoxErr":"form-control inputBox"} id="exampleFormControlInput1" value={emailInput} onChange={updateEmailInput} placeholder="Enter email" />
                                                </div>
                                                <div class="mb-3">
                                                    <label for="exampleFormControlTextarea1" class="form-label feedbackHead">Feedback*</label>
                                                    <textarea maxLength="500" class={feedbackInputError==true?"form-control inputBoxErr":"form-control inputBox"} placeholder="Enter feedback" id="exampleFormControlTextarea1" rows="3" value={feedbackInput} onChange={updateFeedbackInput}></textarea>
                                                </div>
                                                </CardBody>
                                                <CardFooter className={classes.cardFooter}  id="test">
                                                    <button type="button" id="feedbackBtn" class="btn btn-secondary bgbtn" style={{alignItems:"flex-end"}} onClick={submitform}>Submit</button>
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
