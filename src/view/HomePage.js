import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import userService from '../service/UserService'
import {useAuth} from './AuthProvider'
export default function HomePage() {
    const [errorMessage, seterrorMessage] = useState()
    const history = useHistory()
    const user = useAuth();
    async function HandleLogout(x){
        x.preventDefault();
        const {error} = userService.supabase.auth.signOut()
        seterrorMessage(error?.message);
        if(error==null){
            history.push("/signin")
        }
    }
    return (
        <div>
            <label>{errorMessage}</label>
            HOMEPAGE
            <button onClick={HandleLogout}>SIGNOUT</button>
        </div>
    )
}
