
import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import supabase from '../service/Connection'
import {useAuth} from './AuthProvider'
import LoadingPage from './LoadingPage'
export default function HomePage() {
    const [errorMessage, seterrorMessage] = useState()
    const history = useHistory()
    const {details} = useAuth();
    const [isLoading,setIsLoading] = useState(true)
    useEffect(() => {
        if(details===undefined){
            return;
        }
        if(details?.length===0){
            history.push("/completion")    
            console.log("no details")
            return;
        }
        setIsLoading(false)
        
    }, [details])
    async function HandleLogout(x){
        x.preventDefault();
        const {error} = supabase.auth.signOut()
        seterrorMessage(error?.message);
        
        if(error==null){
            history.push("/signin")
            
        }
    }

    return(
        isLoading?
        <LoadingPage/>:
        <div>
            <label>{errorMessage}</label>
            HOMEPAGE
            <button onClick={HandleLogout}>SIGNOUT</button>
        </div>
        

        
    ) 
        
    
}
