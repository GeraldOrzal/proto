import React,{useEffect} from 'react'
import {useAuth} from './AuthProvider'
import {Redirect} from 'react-router-dom'
export default function Admin() {
    const {gcmembers,details} = useAuth()
    useEffect(()=>{
        console.log(gcmembers)
    },[])
    return (
        details[0].userroleid!==2?<Redirect to="/user"/>:
        <div>
            <label>Admin</label>
        </div>
    )
}
