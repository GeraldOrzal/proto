import React ,{useState}from 'react'
import {inputReq} from '../domain/formRequirements'
import supabase from '../service/Connection'
import {Link, Redirect, useHistory} from 'react-router-dom'
import {useAuth} from './AuthProvider'
import {mobile,desktop} from './Components/_responsive'
import Responsive,{useResponsive} from './Components/Responsive'
import './Styles/SigninPageStyle.css'
import './Styles/BaseStyle.css'
import userIcon from './Icons/user.svg'
export default function SigninPage() {
    const {user,details} = useAuth();
    const history = useHistory();
    const {isMobile} = useResponsive()
    const [errorMessage, seterrorMessage] = useState()
    const [isLoading, setisLoading] = useState(false)

    async function HandleSubmit(x){
        x.preventDefault();
        const input = inputReq.createInput(x.target[0].value,x.target[1].value)
        setisLoading(true)
        const {error} = await supabase.auth.signIn(input);    
        setisLoading(false)
        if(error==null){
            history.push("/user")
            window.location.reload()
        }else{
           seterrorMessage(error?.message??null)
        }
    }
    return (
        user?<Redirect to={"/user"}/>:
        <div className="base signinpage">
            <form onSubmit={HandleSubmit} className={isMobile?"_form":"desk-form"}>
                <h1><center>SIGN IN</center></h1>
                <label>{errorMessage}</label>
                <label>Email:</label>
                <input type="email"/>
                <label>Password:</label>
                <input type="password"/>
                <button disabled={isLoading}>Sign In</button>
                <Link to="/signup">DONT HAVE AN ACCOUNT YET? CLICK ME</Link>
            </form>
            
        </div>
    )
}
