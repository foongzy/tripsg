import React from 'react'

export default function LoadingScreen(){
    return(
        <div style={{display:'flex', justifyContent:"center", alignItems:"center", flexDirection:"column",
            position:"fixed", width:"100%", height:"100%", backgroundColor:"black", opacity:'90%', zIndex:1000}}>
            <div class="spinner-grow text-light" role="status">
                <span class="sr-only"></span>
            </div>
            <br />
            <h4 style={{color:"grey"}}>Loading...</h4>
        </div>
    )
}