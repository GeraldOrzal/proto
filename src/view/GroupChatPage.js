import React,{useState,useRef,useEffect} from 'react'
import * as r from 'randomstring'
import './Styles/GroupChatStyle.css'
import LoadingPage from './LoadingPage'
import btnLog from './Icons/plus.svg'
import sendIcon from './Icons/send.svg'
import upload from './Icons/upload.png'
import closeBtn from './Icons/close.png'
import listIcon from './Icons/list.svg'
import {useAuth} from './AuthProvider.js'
import Responsive,{useResponsive} from './Components/Responsive'
import {motion} from 'framer-motion'
import groupChatServices from '../service/GroupChatServices'
import './Styles/BaseStyle.css'
import Calendar from 'react-calendar'
import paperclip from './Icons/paper-clip.svg'
import fileIcon from './Icons/file.svg'


export default function GroupChatPage() {    
    const {isMobile} = useResponsive()
    const [isDark,setIsDark] = useState(true)
    const [currentGC,setCurrentGC] = useState()
    const [file, setfile] = useState()
    const {details,joinGC,sections,allMessages,isLoading,gcAvatar,setCurrentSection,currentSection,burgerClick,setburgerClick,gcmembers,schedule,driverSched} = useAuth()
    const [isGCLoading,setIsLoading] = useState(true)
    const [compPop,setCompPop] = useState("GC")
    const gcRef = useRef()
    const gcRefStore = useRef()
    const textArea = useRef()
    const [currentCode,setCurrentCode] = useState()
    const [isAttendance, setattendance] = useState(false)
    const [clickSched, setclickSched] = useState()
    const [acceptedSched,setAcceptedSched] = useState()
    const [clicklist, setclicklist] = useState(false)
    const [isAnnouncement, setAnnouncement] = useState(false)
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
                return  Addgcomp()
        }
    }

    useEffect(()=>{
        setCurrentCode(r.generate({
            length: 8,
            charset: 'alphanumeric'
        }))
        console.log(gcmembers)
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
    function RenderAcceptedSched(){
        return driverSched?.map((s)=>{
            return <li>{s.schedule_id}<button>REMOVE</button></li>
        })
    }
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
        
        if(currentSection===undefined){
            return
        }
        if(file!==undefined){
            groupChatServices.UploadFile("files",details[0].fullname+"/"+file.filename,file.file,(s)=>{
                
                const value = {
                userdetails_id: details[0]?.userdetails_id,
                    messsagebody: s.Key,
                    section_id: currentSection,
                    messagetype_id: 1,
                    filename: file.filename
                }
                groupChatServices.InsertMessage(value)
                setfile(undefined)
            })
        }else{
            const value = {
                userdetails_id: details[0]?.userdetails_id,
                messsagebody: textArea.current.value,
                section_id: currentSection,
                messagetype_id: 3
            }
            groupChatServices.InsertMessage(value)
        
        }
        
        textArea.current.value=""
        
    }
    function SetCurrentSection(x){   
        setAnnouncement(false)
        if(isMobile){
            setburgerClick(!burgerClick)
            
        }
        setCurrentSection(x)
    }
    
    function HandleAvatarClick(x){
        setCurrentGC(x)
    }
    function HandleClose(){
        
        if(isMobile){
            document.getElementById('popup-cont').style.display = "none"
            return;
        }
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
                groupChatServices.UploadFile("defaultavatars","groupphoto/"+files[0].name,files[0],
                ()=>{
                    setCompPop("GC")                    
                    gcRef.current.src=groupChatServices.GetAvatarURL("defaultavatars","groupphoto",files[0].name)
                    
                })
                
        };
        input.click();
    }
    const inputStyleMob={
        width: "20vw",
        alignSelf:"center"
    }
    const Addgcomp = ()=>(
        <>
        <form id="create" onSubmit={CreateGroupChat} style={isMobile?{alignItems:"center"}:{}}>  
            <img ref={gcRef}/>
            <input ref={gcRefStore} hidden={true} />
            <button onClick={()=>{
                setCompPop("GCAVAT")
            }}>SELECT</button>
            <label>Groupname:</label>
            <input style={isMobile?inputStyleMob:{}}/>
            <label>SHAREABLE CODE</label>
            <input value={currentCode} readOnly={true} style={isMobile?inputStyleMob:{}}/>
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
    list?.map((x)=>x.messagetype_id===1?<div className="files" onClick={()=>{
        groupChatServices.Download("files",x.messsagebody.substring(6,x.messsagebody.length))
        console.log(x.messsagebody.substring(6,x.messsagebody.length))
    }} >
        {details[0]?.userdetails_id === x.userdetails_id?
        <div >
            <img src={fileIcon}/>
            <label> {x.filename}</label>
        </div>
        :<div>
            <img className="useravatar"/>
            <img src={fileIcon}/>
            <label> {x.filename}</label>
            
        </div>}
    </div>
    :<div className="messages" style={{alignSelf:details[0]?.userdetails_id === x.userdetails_id?'flex-end':'flex-start'}}>  
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
    const renderMember = (list) =>{
        let online = [];
        let offline = [];
        list?.map((x)=>{
            if(x.status===1){
                online.push(x)
            }else{
                offline.push(x)
            }   
        }
        )
        return (
            <div>
            {online.map((s)=>{
                return <><label>{s.fullname}</label><span></span></>
            })}
            {offline.map((o)=>{
                return <><label>{o.fullname}</label><span></span></>
            })}
        </div>
        )
    }
   
    const mobStyle={
        position:"absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        display: "none",
        flexDirection: "column",
        zIndex:"2",
    }
    
    function UploadAttachments(){
        
        if(currentSection!==undefined){
            let input = document.createElement('input');
            input.type = 'file';
            input.onchange= ()=>{
                let files =   Array.from(input.files);
                setfile({file:files[0],filename:files[0].name})
            }
            input.click()
        }
        
    }
    
 
        return (
        !isGCLoading?
        <motion.div 
            id="gcpage-cont"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
        >
            
        
        {!isMobile?<><div id="gclist-cont">
            <img src={btnLog} id="addgcbtn" onClick={()=>{HandleOpen("GC")}}/>
            {renderGCList(joinGC)}
        </div>
        <div id="sectionlist-cont">
            {details[0]?.userroleid===3?currentGC?<><label>SECTIONS</label> <label onClick={()=>{
                setAnnouncement(true)
            }}>ANNOUNCEMENTS</label></>:<></>:<label onClick={()=>{HandleOpen("SECT")}}>ADD SECTIONS</label>}
            {renderSection(sections[currentGC?.gclist_id])}
        </div>
        </>:
            <motion.div 
            id="cont"
            initial={{left: "-100%"}}
            animate={burgerClick?{left: "0%"}:{left: "-100%"}}
            transition="2s"
            >
        <div id="gclist-cont-mob" >
            <img src={btnLog} id="addgcbtn" onClick={()=>{HandleOpen("GC")}}/>
            {renderGCList(joinGC)}
        </div>
        <div id="sectionlist-cont-mob">
            {details && details[0]?.userroleid===3?<><label>Sections</label><label onClick={()=>{}}>ATTENDANCE</label></>:currentGC?<label onClick={()=>{HandleOpen("SECT")}}>ADD SECTION</label>:<></>}
            {renderSection(sections[currentGC?.gclist_id])}
            </div>
        </motion.div>
        }
        {isAnnouncement?<div id="announcement">
            {clickSched?<div id="floating-sched">
                <label>Hub:{ " "+clickSched.description}</label>
                <label>start:{ " "+clickSched.start_at} end at: {" "+clickSched.end_at}</label>
                <label>No of person needed:{" "+clickSched.num_people}</label>
                <button onClick={()=>{
                    groupChatServices.AcceptSched(clickSched.schedule_id,clickSched.num_people,details[0]?.userdetails_id)
                   if(clickSched.num_people!=0){
                        setclickSched(prev=>{
                            return{
                                ...prev,
                                num_people:clickSched.num_people-1
                            }

                        })
                   }
                }}>ACCEPT</button>
                
            </div>:<></>}
                <div id="float-acceptedsched">
                    <img src={listIcon} onClick={()=>{
                        setclicklist(!clicklist)
                    }}/>       
                    {clicklist?<ul>
                        <label>Accepted Schedule</label>
                        {RenderAcceptedSched()}
                    </ul>:<></>}
                
                </div>
            <Calendar defaultValue={new Date()} calendarType="US" tileContent={
                
               ({ date, view }) => {
                   
                   
                   return schedule.map((s)=>{
                        let a = new Date(s.start_at)
                        if(s.assign_at==currentGC?.gclist_id&&new Date(a.getFullYear(),a.getMonth(),a.getDate()).toISOString().split("T")[0]==date.toISOString().split("T")[0]){
                            
                            return <div className="sched_ann" key={s.schedule_id} onClick={()=>{
                                setclickSched(s)
                            }}>
                                <label>{s.description}</label>
                            </div>
                        }
                        
                   }
                       
                   )
               }
            } onClickDay={(s)=>{console.log(s)}} 
           />
        </div>:<>
            <div id="chatcont" style={{width:isMobile?"100vw":"50vw",borderRight:isMobile?"none":"solid black 2px"}}>
            {isMobile?<div id="mob-nav-chat"><img/></div>:<></>}

            <div id="messages-area" style={isMobile?{height:"100vh"}:{height:"70%"}}>
                {renderMessages(allMessages[currentSection])}
            </div>
           {file? <div id="attachments-area">
                <img src={fileIcon}/>
                <label>{file.filename}</label>
            </div>:<></>}
            <div id="send-cont" style={{height: isMobile?"6vh":"20%"}}>
                <img src={paperclip} onClick={()=>{
                    UploadAttachments()
                }}/>
                <textarea ref={textArea} style={{height: isMobile?"2vh":"inherit",width: "40vw"}}/>
                
                <img src={sendIcon} onClick={()=>{HandleSend()}}/>
            </div>
        </div>
        
        <div id="opt-cont">
                <img src={currentGC?.groupavatar}/>
                <label>{currentGC?.groupname}</label>
                <label>SHARED FILES</label>
            </div>
            <div id="darkbg" style={{display:isMobile&&burgerClick?"block":"none",zIndex:isMobile&&burgerClick?"-1":"",height:isMobile?"100vh":""}}>
            </div>
            <div id="popup-cont" style={isMobile?mobStyle:{}}>
                <img src={closeBtn} onClick={()=>{HandleClose()}}/>
                {RenderHandler()}
            </div></>}
        
        
        </motion.div>
        
        
        
        :<LoadingPage/>
        
        
    )
    
   
}
