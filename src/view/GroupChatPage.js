import React,{useState,useRef,useEffect} from 'react'
import * as r from 'randomstring'
import './Styles/GroupChatStyle.css'
import LoadingPage from './LoadingPage'
import btnLog from './Icons/plus.svg'
import sendIcon from './Icons/send.svg'
import upload from './Icons/upload.png'
import closeBtn from './Icons/close.png'
import {useAuth} from './AuthProvider.js'
import { render } from 'react-dom'



export default function GroupChatPage() {    
    const [isDark,setIsDark] = useState(true)
    const [isGC,setisGC] = useState(true)
    const {details,joinGC} = useAuth()
    const [currentGC,setCurrentGC] = useState()
    function HandleOpen(comp){
        document.getElementById('darkbg').style.display = "block"
        document.getElementById('popup-cont').style.display = "flex"
        switch (comp) {
            case "GC":
                setisGC(true)
                break;
            default:
                setisGC(false)
                break;
        }
    }
    useEffect(()=>{
        console.log(joinGC)
    },[])
    function HandleAvatarClick(x){
        setCurrentGC(x)
    }
    function HandleClose(){
        document.getElementById('darkbg').style.display = "none"
        document.getElementById('popup-cont').style.display = "none"
    }
    const AddSectComp = () =>(
        <>
            <form id="section">
                <label>SECTION NAME</label>
                <input/>
                <button>ADD SECTION</button>

            </form>
        </>
    )
    const Addgcomp = ()=>(
        <>
        <form id="create">  
            <img/>
            <input/>
            <button>SELECT</button>
            <label>Groupname:</label>
            <input/>
            <label>SHAREABLE CODE</label>
            <input/>
            <button>CREATE</button>
        </form>
        <form id="join">  
            <label>CODE:</label>
            <input/>
            <button>JOIN</button>
        </form>
        </>
    )
    const renderGCList = (list) =>(
        list?.map((x)=><img src={x.groupavatar} onClick={()=>{HandleAvatarClick(x)}}/>)
    )
    
    return (
        <div id="gcpage-cont">
            <div id="gclist-cont">
                <img src={btnLog} id="addgcbtn" onClick={()=>{HandleOpen("GC")}}/>
                {renderGCList(joinGC??null)}
            </div>
            <div id="sectionlist-cont">
                {details && details[0]?.userroleid===3?<><label>Section</label><label>ATTENDANCE</label></>:<label onClick={()=>{HandleOpen("SECT")}}>ADD SECTION</label>}
                <label>#Section</label>
            </div>
            <div id="chatcont">
                <div id="messages-area">
                    
                </div>
                <div id="send-cont">
                    <textarea/>
                    <img/>
                </div>
            </div>
            <div id="opt-cont">
                <img src={currentGC?.groupavatar}/>
                <label>{currentGC?.groupname}</label>
                <label>SHARED FILES</label>
            </div>
            <div id="darkbg">
            </div>
            <div id="popup-cont">
                <img src={closeBtn} onClick={()=>{HandleClose()}}/>
                {!isGC?AddSectComp():Addgcomp()}
            </div>
        </div>
    )
   
}
