import React,{useContext,useState} from 'react'
import { Link } from 'react-router-dom'
import {useAuth} from '../AuthProvider'
import "../Styles/NavStyle.css"

const renderLink = (list)=>{
    return list.map(
        ({linkName,pathName})=>{
            return(<Link to={pathName}>{linkName}</Link>)
        }
    )
}

export default function Nav() {
    const list={auth:[{linkName:"HOME",pathName:"/user"},{linkName:"GROUPCHATS",pathName:"/groupchats"},{linkName:"ATTENDANCE",pathName:"/user/attendance"}],notAuth:[{linkName:"ABOUT US",pathName:"/aboutus"},{linkName:"HOW TO SIGNUP?",pathName:"/howtosignup"},{linkName:"SIGNIN",pathName:"/signin"}]}
    const {user} = useAuth();
    return (
        <div id="nav_cont">
            <img/>
            {user?renderLink(list.auth):renderLink(list.notAuth)}
        </div>
    )
}
