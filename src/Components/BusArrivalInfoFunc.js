import React, {useContext} from 'react'
import HelpIcon from '@material-ui/icons/HelpOutline'
import Square from '@material-ui/icons/CropSquare'
import WheelChair from '@material-ui/icons/Accessible';
import { GlobalContext } from "../Resources/GlobalContext.js";

function BusArrivalInfoFunc() {
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    return (
        <>
            <HelpIcon id={globalDarkMode ? "helpIconD":"helpIcon"} data-bs-toggle="modal" data-bs-target="#helpModal"></HelpIcon>
            {/* Modal */}
            <div class="modal fade" id="helpModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content" id={globalDarkMode ?"arrivalInfoModalD":"arrivalInfoModal"}>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Bus Timings Guide</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="col">
                                <div class={globalDarkMode ? "card cardRD":"card cardR"} style={{height:"100%", borderRadius:"0px"}}>
                                    <div class="card-body">
                                        <div className="row">
                                            <div className="col-4 borderBot rightDivider" style={{textAlign:"center"}}>
                                                <label className="BusNo">12</label>
                                            </div>
                                            <div className="col-8 borderLeft">
                                                <label className="BusTime">Next Bus:</label>
                                                <br></br>
                                                <label className="BusTime empty">Arriving</label>
                                                <label className='BusTime2 standing'>5min<WheelChair className={globalDarkMode ? "WheelChair2D":"WheelChair2"}></WheelChair></label>
                                                <label className='BusTime2 full'>10min</label>
                                            </div>
                                        </div>                    
                                    </div>
                                </div>
                            </div>
                            <div class={globalDarkMode ? "card cardRD":"card cardR"} id={globalDarkMode ? "nocardborderD":"nocardborder"} style={{height:"100%", borderRadius:"0px"}}>
                                <div class="card-body">
                                    <div className="row">
                                        <div className="col-4 borderBot rightDivider" style={{textAlign:"center"}}>
                                            <label className="BusTime" style={{textAlign:"center"}}>Bus Number</label>
                                        </div>
                                        <div className="col-8 borderLeft">
                                            <label className="BusTime">Color Legend:</label>
                                            <br></br>
                                            <Square className="BusTime empty"></Square><label className="BusTime2 empty">Seats Available</label>
                                            <br></br>
                                            <Square className="BusTime standing"></Square><label className='BusTime2 standing'>Standing Available</label>
                                            <br></br>
                                            <Square className="BusTime full"></Square><label className='BusTime2 full'>Standing Limited</label>
                                            <br></br>
                                            <WheelChair className={globalDarkMode ? "WheelChairD":"WheelChair"}></WheelChair><label className='BusTime2' style={{marginLeft:"2px"}}>Wheelchair Accessible</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                                              
                        <div class="modal-footer">
                            <button type="button" className={globalDarkMode ? "btn btn-secondary bgbtnD":"btn btn-secondary bgbtn"} data-bs-dismiss="modal">Close</button>
                         </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BusArrivalInfoFunc
