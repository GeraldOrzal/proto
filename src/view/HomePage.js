import React,{useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import supabase from '../service/Connection'
import {useAuth} from './AuthProvider'
import LoadingPage from './LoadingPage'
import './Styles/BaseStyle.css'
import './Styles/HomePageStyle.css'
import Pic1 from './pics/img1.jpg'
import Pic2 from './pics/img2.jpg'
import Pic3 from './pics/img3.jpg'
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
        console.log(details)
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
        <div className="base">
            <label>{errorMessage}</label>
            <div className="head">
                <h1>Welcome To Laguna Transport Service Cooperative</h1>
            </div>
            <div id="slider">
                <figure>
                    <img src={Pic1}/>
                    <img src={Pic2}/>
                    <img src={Pic1}/>
                    <img src={Pic3}/>
                    <img src={Pic1}/>
                </figure>
            </div>
            <br/>
            <div className="desc">
            <h1>Presently Luzon is serving individuals, small and medium <br/>scale businesses
                and open for future company tie ups.<br/> Our driver/members and staff are committed of
                providing excellent and <br/> dependable services to any part of Luzon.
            </h1>
        </div>
            <div className="mission">
                <h1>Mission</h1>
            </div>
            <div className="mis-desc">
                <h2>We provide reliable and dependable Transportation services to 
                    <br/>satisfy our client's 
                    needs and taking pride in our members.
                </h2>
            </div>
            <div className="vision">
                <h1>Vision</h1>
            </div>
            <div className="vis-desc">
                <h2>To become the leading transport cooperative in Luzon 
                    <br/>
                    with sustainable income and improve quality of life of its member.
                </h2>
            </div>
            <br/>
            
            <button onClick={HandleLogout} id="signout_btn">SIGN OUT</button>
        </div>
        

        
    ) 
        
    
}