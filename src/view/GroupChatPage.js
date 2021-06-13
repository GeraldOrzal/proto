import React,{useState,useRef,useEffect} from 'react'
import * as r from 'randomstring'
import './Styles/GroupChatStyle.css'
import LoadingPage from './LoadingPage'
import supabase from '../service/UserService.js'
import btnLog from './Icons/plus.svg'
import sendIcon from './Icons/send.svg'
import upload from './Icons/upload.png'
import closeBtn from './Icons/close.png'
import {useAuth} from './AuthProvider.js'



export default function GroupChatPage() {    
    const [isDark,setIsDark] = useState(true)
    const [profileAvatar,setprofileAvatar] = useState([])
    const [gcAvatar,setgcAvatar] = useState([])
    const [currentGC,setCurrentGC] = useState()
    const code = useRef()
    const avatarInput = useRef()
    const imageStore = useRef()
    const popup = useRef()
    const {details} = useAuth()
     /** MOUNTING */

    useEffect(()=>{
        FetchAvatarList("defaultavatars","groupphoto")
        FetchAvatarList("defaultavatars","useravatars")

    },[])
    /** MOUNTING */

    /*Fetching Function*/
    function FetchWithPublicUrl(bucket,folder,name){
        const {data} = supabase.storage.from(bucket).getPublicUrl(folder+"/"+name);
        return data.publicURL;
    }
    async function FetchAvatarList(bucket,folder){
        const {data,error} = await supabase.storage.from(bucket).list(folder)
        
        if(error){
            return
        }
        let temp = []
        data.forEach(elem => {
            
            const val = FetchWithPublicUrl(bucket,folder,elem.name)
            const model = {
                filename: elem.name,
                publicUrl:val
            }
            temp.push(model)

        });

        switch (folder) {
            default:
            case "groupphoto":
                setgcAvatar(temp)                
                break;
        
            case "useravatars":
                
                setprofileAvatar(temp)
                break;
        }
        
    }

    function ClickAvatarGC(x){
        setCurrentGC(x)
    }

    function Click(){
        setIsDark(!isDark)
        if(isDark===false){
            code.current.value = GenerateCode()
        }
    }
    function GenerateCode(){
        return r.generate({
            length: 8,
            charset:'alphanumeric'
        })
    }
    async function HandleSubmitCreateGC(x){
        x.preventDefault()
        
        const temp = {
            groupavatar:imageStore.current.value,
            groupname:x.target[2].value,
            code: code.current.value,
            remarks_id:2,
            userdetails_id:details[0]?.userdetails_id
        }
        
        const { data, error } = await supabase.from('gclist').insert([temp])
        if(error){
            return
        }
        setIsDark(true)
        setCurrentGC(data)

        alert("SUCCESS")
        avatarInput.current.src=""
        document.getElementById("creategc").reset();
    }
    function OpenAvatarList(x){
        x.preventDefault()
        popup.current.style.display ="grid"
    }
    function SelectAvatar(x){
        avatarInput.current.src = x;
        imageStore.current.value = x;
        popup.current.style.display ="none"
    }





    /*Fetching Function*/

    /*component section*/
    const renderJoinComponent = ()=>(
        <form className="gc join">
            <label>INPUT CODE</label>
            <input/>
            <button>JOIN</button>
        </form>
    )    
    const renderCreateGCComponent = ()=>(
        <form id="creategc" className="gc create" onSubmit={HandleSubmitCreateGC}>
            <img ref={avatarInput}/>
            <input ref={imageStore} hidden={true}/>
            <button onClick={OpenAvatarList}>SELECT</button>
            <label>Groupname</label>
            <input />
            <label>SHARE THIS CODE</label>
            <input ref={code} readOnly={true}/>
            <button>CREATE GC</button>
        </form>
    )
    const pictures = ({filename,publicUrl}) =>(
        <div className="card" onClick={()=>{SelectAvatar(publicUrl)}}>
            <label>{filename}</label>
            <img src={publicUrl}/>
        </div>
    )
    const renderList = (list) =>(
        list.map(
            (x)=>pictures(x)
        )
    )
    const message = ({fullname,publicUrl,date,time,body}) =>(
        <div className="message">
            <label className="sender">{fullname}</label>
            <div className="picbodcont">
                <img src={publicUrl}/><label>{body}</label>
            </div>
            <label className="dt">{date+":"+time}</label>
        </div>
    )
    const renderMessage = (messages) =>(
        messages.list(
            (x) =>message(x)
        )
    )
    const gcInitialState = ({publicUrl,groupname}) =>(
        <>
            <img className="gcInit_img" src={publicUrl}/>
            <label className="gcInit_label">{groupname}</label>
        
        </>
    )
    const uploadBtn = () =>(
        <div className="card">
                <img src={upload}/>
                <input type="file"/>
        </div>
    )
    const renderSendArea = (cb) =>(
        <div id="send">
            <textarea/>
            <img src={sendIcon}onClick={cb}/>
        </div>
    )
   
    const avatar = ({publicURL,gcid}) =>(
        <img src={gcAvatar[0]?.publicUrl} onClick={ClickAvatarGC({gcid:gcid,publicUrl:publicURL})}/>
    )
    
    /*component section*/






    return (
        <div id="base">
            <div id="darkBG" hidden={isDark} onClick={Click}>
            </div>
            {details?.userroleid===3?
            renderJoinComponent():
            <div id="pop" hidden={isDark}>
            {renderCreateGCComponent()}
            <label id="or">OR</label>
            {renderJoinComponent()}
            </div>
            }
            <div id="gclist-cont">
                <img src={btnLog} onClick={Click}/>

            </div>
            
            <div id="chat">
                <div id="chatCont">
                    {gcInitialState({publicUrl:gcAvatar[1]?.publicUrl,groupname:"BatangasHub"})}
                    {message({fullname:"Gerald Orzal",publicUrl:profileAvatar[0]?.publicUrl,date:"2020-06-01",time:"20:24",body:"Hi!!!"})}
                </div>
                {renderSendArea(()=>{
                    
                    console.log("send")
                })}
            </div>
            <div className="popup" ref={popup}>
                    {renderList(gcAvatar)}
                    {uploadBtn()}    
            </div>
        </div>
    )
   
}
