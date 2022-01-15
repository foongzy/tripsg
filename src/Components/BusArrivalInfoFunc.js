import React, {useContext} from 'react'
import HelpIcon from '@material-ui/icons/HelpOutline'
import Square from '@material-ui/icons/CropSquare'
import WheelChair from '@material-ui/icons/Accessible';
import { GlobalContext } from "../Resources/GlobalContext.js";
import InfoIcon from '@material-ui/icons/InfoOutlined';

function BusArrivalInfoFunc() {
    const{globalDarkModeKey}=useContext(GlobalContext)
    const[globalDarkMode,setGlobalDarkMode]=globalDarkModeKey
    return (
        <>
            <HelpIcon id={globalDarkMode ? "helpIconD":"helpIcon"} data-bs-toggle="modal" data-bs-target="#helpModal"></HelpIcon>
            {/* Modal */}
            <div className="modal fade" id="helpModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" id={globalDarkMode ?"arrivalInfoModalD":"arrivalInfoModal"}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Bus Timings Guide</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="col">
                                <div className={globalDarkMode ? "card cardRD":"card cardR"} style={{height:"100%", borderRadius:"0px"}}>
                                    <div className={globalDarkMode ?"card-body boxBusInfoD":"card-body"}>
                                        <div className="row">
                                            <div className="col-4 borderBot rightDivider" style={{textAlign:"center"}}>
                                                <label className="BusNo">12</label>
                                            </div>
                                            <div className="col-8 borderLeft">
                                                <label className="BusTime" style={{display:"flex", justifyContent:"space-between"}}>Next Bus:
                                                <a id={globalDarkMode ? "inFoIconBRD":"inFoIconBR"} style={{marginLeft:"auto"}}><InfoIcon /></a>
                                                </label>
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
                                            <WheelChair className={globalDarkMode ? "WheelChair3D":"WheelChair3"}></WheelChair><label className='BusTime2 mleft'>Wheelchair Accessible</label>
                                            <br></br>
                                            <InfoIcon className={globalDarkMode ? "WheelChair3D":"WheelChair3"}/><label className='BusTime2 mleft'>Bus Route Info</label>
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
