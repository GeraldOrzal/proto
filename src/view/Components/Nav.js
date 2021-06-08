import React,{useContext,useState} from 'react'
import { Link } from 'react-router-dom'
import {useAuth} from '../AuthProvider'


const renderLink = (list)=>{
    return list.map(

        ({linkName,pathName})=>{
            console.log(pathName+" sep "+linkName)
            return(<Link to={pathName}>{linkName}</Link>)
        }
    )
}

export default function Nav() {
    const list={auth:[{linkName:"HOME",pathName:"/user/:name"},{linkName:"GROUPCHATS",pathName:"/user/groupchats"},{linkName:"ATTENDANCE",pathName:"/user/attendance"}],notAuth:[{linkName:"ABOUT US",pathName:"/aboutus"},{linkName:"HOW TO SIGNUP?",pathName:"/howtosignup"},{linkName:"SIGNIN",pathName:"/signin"}]}
    const user = useAuth();
    return (
        <div>
            {user?renderLink(list.auth):renderLink(list.notAuth)}
        </div>
    )
}
