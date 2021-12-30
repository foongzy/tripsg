import React from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../Components/Sidebar'
import useWindowDimensions from "../Components/useWindowDimensions"

function Location() {
    const {height, width}=useWindowDimensions();
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