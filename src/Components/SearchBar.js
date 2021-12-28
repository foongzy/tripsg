import React, {useState, useContext} from 'react'
import '../assets/css/SearchBar.css'
import SearchIcon from '@material-ui/icons/Search';
import Close from '@material-ui/icons/Close';
import { GlobalContext } from "../Resources/GlobalContext.js";

function SearchBar({placeholder, data}) {
    const{globalFilteredDataKey}=useContext(GlobalContext)
    const[globalFilteredData,setGlobalFilteredData]=globalFilteredDataKey
    const{globalSearchWordKey}=useContext(GlobalContext)
    const[globalSearchWord,setGlobalSearchWord]=globalSearchWordKey

    const handleFilter=(event)=>{
        const searchWord = event.target.value
        setGlobalSearchWord(searchWord);
        const newFilter=data.filter((value)=>{
            return (
                value.BusStopCode.toLowerCase().includes(searchWord.toLowerCase())||
                value.Description.toLowerCase().includes(searchWord.toLowerCase())
            );
        });
        if(searchWord==""){
            setGlobalFilteredData([])
        }else{
            setGlobalFilteredData(newFilter)
        }
    }

    const clearInput=()=>{
        setGlobalFilteredData([])
        setGlobalSearchWord('')
    }

    return (
        <div className='search'>
            <div className='searchInputs'>
            <div class="input-group" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Search by bus stop code or name">
                <input type="text" placeholder={placeholder} value={globalSearchWord} onChange={handleFilter} class="form-control searchBox" aria-label="Search" aria-describedby="basic-addon2" />
                <span class="input-group-text SearchBg" id="basic-addon2">
                    {globalSearchWord.length==0?(
                        <SearchIcon></SearchIcon>
                    ):(
                        <Close id="clearBtn" onClick={clearInput}></Close>
                    )}
                </span>
                </div>
            </div>
            {
                globalFilteredData.length!=0?(
                    <div className='dataResult'>
                        {globalFilteredData.slice(0, 10).map((value, key)=>{
                            return <a className='dataItem' href="*" target="_blank">
                                <p>{value.Description + " ("+value.BusStopCode+")"}</p>
                                </a>
                        })}
                    </div>
                ):(
                    <div></div>
                )
            }
        
        </div>
    )
}

export default SearchBar
