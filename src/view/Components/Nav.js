import React,{useContext,useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import {useAuth} from '../AuthProvider'
import "../Styles/NavStyle.css"
import Responsive, { useResponsive } from './Responsive'
import {desktop,mobile} from './_responsive'
import grpIcon from '../Icons/group.svg'
import panelIcon from '../Icons/settings.svg'
import homeIcon from '../Icons/home.svg'
export default function Nav(props) {
    const {isTabletDevice,isLaptop,isMobile,isDesktop,isBigScreen} = useResponsive()
    const list={auth:[{linkName:"HOME",pathName:"/user"},{linkName:"GROUPCHATS",pathName:"/groupchats"},{linkName:"ACCOUNT",pathName:"/account"}],notAuth:[{linkName:"ABOUT US",pathName:"/aboutus"},{linkName:"HOW TO SIGNUP?",pathName:"/howtosignup"},{linkName:"SIGNIN",pathName:"/signin"}]}
    
    const {user,burgerClick,details,setburgerClick} = useAuth();
    const onCPLhover = [{linkName:"Dashboard",pathName:"/controlpanel/dashboard"},{linkName:"Membership",pathName:"/controlpanel/membership"},details[0]?.userroleid===1?{linkName:"BOD",pathName:"/controlpanel/bod"}:{linkName:"Admin",pathName:"/controlpanel/admin"}]
    const authStyle = {left:burgerClick?"0%":"-100%",flexDirection: "row",width: "100%",height: "7vh",top: "93%",columnGap:"20%" }
    const [isHover, setisHover] = useState(false)
    const renderLink = (list)=>{
        const icons =[homeIcon,grpIcon,panelIcon]
        return list.map(

            ({linkName,pathName},index)=>{
                return(<>        
                {isMobile&&user?<Link to={pathName}><img src={icons[index]}/></Link>: <Link to={pathName}>{linkName}</Link>}
                </>)
            }
        )
    }
    function HandleBurgerClick(){
        setburgerClick(!burgerClick)
        
    }
    const authNavStyle = {
        display: "flex",
        flexDirection: "row",
        columnGap: "20vw",
        width: "100%",
        borderTop: "solid black 2px",
        height: "8vh",
        backgroundColor: "white",
        position: "absolute",
        zIndex:"1",
        top: burgerClick?"92%":"-100%",
        alignItems: "center"
    }
    const defNavStyle = {
        display: "flex",
        flexDirection: "column",
        width: "50%",
        height: "100vh",
        backgroundColor: "white",
        position: "absolute",
        top: "0%",
        left: burgerClick?"0%":"-100%",
        alignItems: "center"
    }
    
    return (<>
                {isBigScreen||isDesktop||isLaptop?
            <div id="nav_cont">
                <img/>
                {user?renderLink(list.auth):renderLink(list.notAuth)}
                {user&&details[0]?.userroleid!==3?<a onPointerEnter={()=>{
                    setisHover(true)
                }}
                style={{height:isHover?"20vh":""}}
                >CONTROL PANEL
                    <div id="others" onPointerEnter={()=>{setisHover(true)}} onPointerLeave={()=>{setisHover(false)}} style={{display:isHover?"flex":"none"}}>
                        {renderLink(onCPLhover)}
                    </div>
                </a>:<></>}
                
                
            </div>:
            <div style={user?authNavStyle:defNavStyle} id="nav_cont-mob">
                            <div id="burger" onClick={()=>{HandleBurgerClick()}}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>    
                        {user?renderLink(list.auth):renderLink(list.notAuth)}
                </div>}
            </>
            
        
        
    )
}
