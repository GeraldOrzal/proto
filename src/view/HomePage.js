
import React,{useState,useEffect} from 'react'
import {Redirect, useHistory} from 'react-router-dom'
import userService from '../service/UserService'
import {useAuth} from './AuthProvider'
import LoadingPage from './LoadingPage'
export default function HomePage() {
    const [errorMessage, seterrorMessage] = useState()
    const history = useHistory()
    const {user,details} = useAuth();
    useEffect(() => {
        if(details===undefined){
            return;
        }
        if(details?.length===0){
            console.log(details)
            history.push("/completion")    
        }
        
    }, [details])
    async function HandleLogout(x){
        x.preventDefault();
        const {error} = userService.supabase.auth.signOut()
        seterrorMessage(error?.message);
        
        if(error==null){
            history.push("/signin")
        }
    }

    return(
        details?
           <div>
                <label>{errorMessage}</label>
                HOMEPAGE
                <button onClick={HandleLogout}>SIGNOUT</button>
            </div>:
        <LoadingPage/>
        
    ) 
        
    
}
