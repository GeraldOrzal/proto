import React,{useState,useRef,useEffect} from 'react'
import * as r from 'randomstring'
import './Styles/GroupChatStyle.css'
import LoadingPage from './LoadingPage'
import btnLog from './Icons/plus.svg'
import sendIcon from './Icons/send.svg'
import upload from './Icons/upload.png'
import closeBtn from './Icons/close.png'
import {useAuth} from './AuthProvider.js'

import groupChatServices from '../service/GroupChatServices'




export default function GroupChatPage() {    
    const [isDark,setIsDark] = useState(true)
    
    const {details,joinGC,sections,allMessages,isLoading,gcAvatar} = useAuth()
    const [currentGC,setCurrentGC] = useState()
    const [currentSec,setCurrentSection] = useState()
    const [isGCLoading,setIsLoading] = useState(true)
    const [compPop,setCompPop] = useState("GC")
    const gcRef = useRef()
    const gcRefStore = useRef()
    const textArea = useRef()
    const [currentCode,setCurrentCode] = useState()
    function HandleOpen(comp){
        document.getElementById('darkbg').style.display = "block"
        document.getElementById('popup-cont').style.display = "flex"
        setCompPop(comp)
        
    }
    const RenderHandler = () =>{
        switch (compPop) {
            case "SECT":  
                return AddSectComp()
            case "GCAVAT":
                return AddGroupAvatars()
            default:
                
                return Addgcomp()
        }
    }

    useEffect(()=>{
        setCurrentCode(r.generate({
            length: 8,
            charset: 'alphanumeric'
        }))
    },[])
    useEffect(()=>{
        if(Object.entries(joinGC).length===0){
            setIsLoading(false)
            return;
        }
        if(Object.entries(joinGC).length!==0&&Object.entries(sections).length!==0&&!isLoading){
            setIsLoading(false)
        }
        
    },[joinGC,sections,isLoading])
    useEffect(()=>{
        if(isGCLoading){
            return
        }
        
    },[isGCLoading])
    function CreateGroupChat(x){
        x.preventDefault()
        const value = {
            groupavatar:x.target[0].value,
            groupname:x.target[2].value,
            userdetails_id:details[0]?.userdetails_id,
            code:x.target[3].value,
        }
        groupChatServices.InsertGC(value)
        setCurrentCode(r.generate({
            length: 8,
            charset: 'alphanumeric'
        }))
    }
    function CreateSection(x){
        x.preventDefault()
        const value = {
            sectionname:x.target[0].value,
            gclist_id:currentGC?.gclist_id,
            userdetails_id:details[0]?.userdetails_id
        }
        groupChatServices.InsertSection(value);
    }   
    function HandleSend(){
        if(currentSec===undefined){
            return
        }
        const value = {
            userdetails_id: details[0]?.userdetails_id,
            messsagebody: textArea.current.value,
            section_id: currentSec
        }
        groupChatServices.InsertMessage(value)
    }
    function SetCurrentSection(x){   
        setCurrentSection(x)
    }
    
    function HandleAvatarClick(x){
        setCurrentGC(x)
    }
    function HandleClose(){
        document.getElementById('darkbg').style.display = "none"
        document.getElementById('popup-cont').style.display = "none"
    }
    
    const AddSectComp = () =>(
        <>
            <form id="section" onSubmit={CreateSection}>
                <label>SECTION NAME</label>
                <input/>
                <button>ADD SECTION</button>
            </form>
        </>
    )
    const AddGroupAvatars = () =>(
        <div id="gcdefcont">
            {gcAvatar?.map((x)=>{
                return <img src={x.publicUrl} onClick={()=>{SetPicture(x.publicUrl)}}/>
            })}
            <img src={upload} onClick={()=>{Upload()}}/>
        </div>
        
    )
    function SetPicture(x){
        setCompPop("GC")
        setTimeout(()=>{
            gcRef.current.src = x
            gcRefStore.current.value = x
        },1000)
    }
    function JoinGC(x){
        x.preventDefault()
        groupChatServices.GetGCViaCode(x.target[0].value,(s)=>{
            if(s.length===0){
                console.log("THERE IS NO SUCH GC")
                return
            }
            let {gclist_id}=s[0];
            let id = details[0]?.userdetails_id
            let user = {
                gclist_id,
                userdetails_id:id
            }
            groupChatServices.InsertUser(user)
        })
    }
    function Upload(){
        let input = document.createElement('input');
        input.type = 'file';
        input.onchange = _ => {
                let files =   Array.from(input.files);
                groupChatServices.UploadPhoto("defaultavatars","groupphoto/"+files[0].name,files[0],
                ()=>{
                    setCompPop("GC")                    
                    gcRef.current.src=groupChatServices.GetAvatarURL("defaultavatars","groupphoto",files[0].name)
                    
                })
                
        };
        input.click();
    }
    const Addgcomp = ()=>(
        <>
        <form id="create" onSubmit={CreateGroupChat}>  
            <img ref={gcRef}/>
            <input ref={gcRefStore} hidden={true}/>
            <button onClick={()=>{
                setCompPop("GCAVAT")
            }}>SELECT</button>
            <label>Groupname:</label>
            <input/>
            <label>SHAREABLE CODE</label>
            <input value={currentCode} readOnly={true}/>
            <button>CREATE</button>
        </form>
        <form id="join" onSubmit={JoinGC}>  
            <label>CODE:</label>
            <input/>
            <button>JOIN</button>
        </form>
        </>
    )
    const renderGCList = (list) =>{ 
        let keys = Object.keys(list)
        return keys.map((x)=>
        <img src={list[x].groupavatar} onClick={()=>{HandleAvatarClick(list[x])}}/>
        )
    }
    const renderSection = (list) =>{
        
        
        return list?.map((f)=>{
            return <label keys={f.section_id} onClick={()=>{SetCurrentSection(f.section_id)}}>{f.sectionname}</label>
        })
    }
    const renderMessages = (list) =>(    
    list?.map((x)=>(<div className="messages" style={{alignSelf:details[0]?.userdetails_id === x.userdetails_id?'flex-end':'flex-start'}}>  
        <label>{x.fullname}</label>
        <div className="avat-cont">
            {details[0]?.userdetails_id === x.userdetails_id?<><label className="mesBody">{x.messsagebody}</label>
            <img className="useravatar" src={x.useravatar}/></>:<>
            <img className="useravatar" src={x.useravatar}/>
            <label className="mesBody">{x.messsagebody}</label>
            
            </>}
        </div>
        <label className="dt" hidden={true}>{x.datesent+":"+x.timesent}</label>
    </div>
        )   
    )
)
    
        
    
    
    
    
        return (!isGCLoading?<div id="gcpage-cont">
        <div id="gclist-cont">
            <img src={btnLog} id="addgcbtn" onClick={()=>{HandleOpen("GC")}}/>
            {renderGCList(joinGC)}
        </div>
        <div id="sectionlist-cont">
            {details && details[0]?.userroleid===3?<><label>Section</label><label>ATTENDANCE</label></>:currentGC?<label onClick={()=>{HandleOpen("SECT")}}>ADD SECTION</label>:<></>}
            {renderSection(sections[currentGC?.gclist_id])}
        </div>
        <div id="chatcont">
            <div id="messages-area">
                {renderMessages(allMessages[currentSec])}
            </div>
            <div id="send-cont">
                <textarea ref={textArea}/>
                <img src={sendIcon} onClick={()=>{HandleSend()}}/>
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
            {RenderHandler()}
        </div>

    </div>:<LoadingPage/>
    )
    
   
}
