import React ,{useState}from 'react'
import {inputReq} from '../domain/formRequirements'
import supabase from '../service/Connection'
import {Redirect, useHistory} from 'react-router-dom'
import {useAuth} from './AuthProvider'
import './Styles/BaseStyle.css'
import './Styles/SigninPageStyle.css'
export default function SignupPage() {
    const [isLoading, setisLoading] = useState(false)
    const [errorMessage, seterrorMessage] = useState()
    const {user} = useAuth();
    const history = useHistory();
    async function HandleSubmit(x){
        x.preventDefault();

        const input = inputReq.createInput(x.target[0].value,x.target[1].value)
        setisLoading(true)
        const {error} = await supabase.auth.signUp(input);    
        
        setisLoading(false)
        if(error==null){
            seterrorMessage("CHECK EMAIL FOR CONFIRMATION")
        }else{
            seterrorMessage(error?.message??null)
        }
    }
    return (
        user?<Redirect to={"/user"}/>:
        <div className="base">
            <form onSubmit={HandleSubmit} className="desk-form">   
                <label>{errorMessage}</label> 
                <label>EMAIL:</label>
                <input type="email"/>
                <label>PASSWORD:</label>
                <input type="password"/>
                <button disabled={isLoading}>Sign Up</button>
            </form>
        </div>
    )
}
