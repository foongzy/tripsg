import React, {useState, useContext} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../Resources/GlobalContext.js";
import GridContainer from "../Components/Grid/GridContainer.js";
import GridItem from "../Components/Grid/GridItem.js";
import Card from "../Components/Card/Card.js";
import CardBody from "../Components/Card/CardBody.js";
import CardHeader from "../Components/Card/CardHeader.js";
import CardFooter from "../Components/Card/CardFooter.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/aboutPage";
import Person from '@material-ui/icons/Person';
import Button from "../Components/CustomButtons/Button.js";
import '../assets/css/login.css'
import axios from 'axios'

const useStyles = makeStyles(styles);

function Login(props) {
    const history = useHistory()
    const [userInput, setUserInput]=useState('');
    const [userInputError, setUserInputError] = useState(false);
    const [cardAnimaton, setCardAnimation] = useState("cardHidden");
    const{globalDispNameKey}=useContext(GlobalContext)
    const[globalDisplayName,setGlobalDisplayName]=globalDispNameKey
    const{globalSessionIsLogKey}=useContext(GlobalContext)
    const[globalSessionIsLog,setGlobalSessionIsLog]=globalSessionIsLogKey

    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();
    const { ...rest } = props;

    function updateUserInput(event){
        setUserInput(event.target.value);
    }

    function clickEnter(event){
        event.preventDefault();
        if(userInput!=""){
            const URL ="https://tripsg-db.herokuapp.com/api/logs/"+userInput+"/1/"
            axios.post(URL).then(res=>{
            }).catch(error=>{
                console.log("error")
            })
            //save to local storage
            const tripsgname={
                "displayname":userInput
            }
            localStorage.setItem("tripsgname",JSON.stringify(tripsgname))
            setGlobalDisplayName(userInput)
            setUserInputError(false)
            setUserInput("")
            setGlobalSessionIsLog(true)
            history.push("/BusArrival");
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
            setUserInputError(true)
        }
    }
    
    return (
        <div className="bgg">
        <div
          className={classes.pageHeader}
        >
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[cardAnimaton]}>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader} style={{background:"linear-gradient(60deg, #5680e9, #1b7ced)", boxShadow:"0 12px 20px -10px rgb(156 39 176 / 28%), 0 4px 20px 0px rgb(0 0 0 / 12%), 0 7px 8px -5px rgb(156 39 176 / 20%)", color:"white"}}>
                      <h4>Login</h4>
                    </CardHeader>
                    
                    <CardBody id="logincardBody">
                        <label style={{fontFamily:"sans-serif", fontSize:"16px", marginBottom:"2px"}}>Display Name:</label>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1"><Person></Person></span>
                            <input type="text" id={userInputError?"loginerr":"loginInput"} className="form-control" placeHolder="Enter Display Name" maxLength="20" value={userInput} onChange={updateUserInput} aria-label="Username" aria-describedby="basic-addon1" />
                        </div>
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button onClick={clickEnter} simple color="info" size="lg">
                        Enter
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
            <ToastContainer />
          </div>
        </div>
      </div>
    )
}

export default Login