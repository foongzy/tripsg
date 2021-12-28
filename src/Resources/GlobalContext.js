import React, {createContext, useState} from "react"

//create context to hold global state and export this to other components
//context is like a container for the global state
export const GlobalContext=createContext();

function GlobalContextProvider(props){
    // const[globalLoginData,setGlobalLoginData]=useState([{
    //     "user":'',
    //     "username": "",
    //     "displayPicLink":"",
    //     "isLogin":false,
    // }]);
    const[globalBusstopData,setGlobalBusstopData]=useState("")
    const[globalSearchWord,setGlobalSearchWord]=useState("")
    const[globalFilteredData,setGlobalFilteredData]=useState([])

    return(
        //Provider is like declare what global state to expose or chare to other components
        //for global state you want to share, you have to put global state into the value attribute of the provider
        <GlobalContext.Provider
        value={{
            globalBusstopDataKey:[globalBusstopData,setGlobalBusstopData],
            globalSearchWordKey:[globalSearchWord,setGlobalSearchWord],
            globalFilteredDataKey:[globalFilteredData,setGlobalFilteredData]
            
        }}
        >
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;