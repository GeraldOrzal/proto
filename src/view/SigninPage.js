import React ,{useState,useEffect}from 'react'
import {inputReq} from '../domain/formRequirements'
import userService from '../service/UserService'
import {Link, Redirect, useHistory} from 'react-router-dom'
import {useAuth} from './AuthProvider'
export default function SigninPage() {
    const user = useAuth();
    const history = useHistory();
    const [errorMessage, seterrorMessage] = useState()
    const [isLoading, setisLoading] = useState(false)

    async function HandleSubmit(x){
        x.preventDefault();
        const input = inputReq.createInput(x.target[0].value,x.target[1].value)
        setisLoading(true)
        const {user,error} = await userService.supabase.auth.signIn(input);    
        setisLoading(false)
        if(error==null){
            history.push("/user/"+user.email);
       }else{
           seterrorMessage(error?.message??null)
       }
    }
    return (
        user?<Redirect to={"/user/"+user.email}/>:
        <>
        <form onSubmit={HandleSubmit}>
            <label>SIGNIN</label>
            <label>{errorMessage}</label>
            <label>Email:</label>
            <input type="email"/>
            <label>Password:</label>
            <input type="password"/>
            <button disabled={isLoading}>Signin</button>
        </form>
        <Link to="/signup">DONT HAVE AN ACCOUNT YET? CLICK ME</Link>
        </>
    )
}
