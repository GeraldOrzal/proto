import React,{useState} from 'react'
import './Styles/GroupChatStyle.css'
import LoadingPage from './LoadingPage'
export default function GroupChatPage() {    
    const [avatar, setAvatarList] = useState()
    const [gc, setGCLIST] = useState()
    const [section,setSection] = useState()
    const [currentGC,setCurrentGC] = useState()
    const [isLoading,setIsLoading] = useState(true)
    const renderList = () =>{
        return avatar?avatar.map(
            ({avatar,key})=>{return <img src={avatar} key={key}/>}
        ):<></>
    }
    const renderMessage = () =>{
        return gc?gc.map(
            ({sender,body,date,time})=>{
              return <div className="message">
                    <label className="sender">{sender}</label>
                    <div className="avt">
                        <label className="body">{body}</label><img/>
                    </div>
                    <label className="dt">{date+":"+time}</label>
                </div>
            }
        ):<></>
        
    }
    const renderSection = () =>{
        return section?section.map(
            ({sectionname,key})=>{
                <label key={key}>{sectionname}</label>
            }
        ):<>
        </>
    }
    return (
        !isLoading?
        <div id="cont">
            <div className="gc-list">
                    {renderList()}
            </div>
            <div id="cat">
                    <button>+ADD SECTION</button>
                    <div id="sections">
                        {renderSection()}
                    </div>
            </div>
            <div id="chat-area">
                <div className="messages-cont">
                    {renderMessage()}
                </div>
                <div id="controller">
                    <textarea/>
                    <button>SEND</button>
                </div>
            </div>
            <div id="gc-options">
                {currentGC?
                <>
                    <img src="data:image/jpeg;base64,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"/>
                    <label>{currentGC?.groupName}</label>
                    <button>SHARED FILES</button>
                    <button>OPTIONS</button>
                    <div id="shared-files" hidden="true">

                    </div>
                </>
                :<></>}
            </div>
        </div>:<LoadingPage/>
    )
}
