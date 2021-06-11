import React,{useState,useEffect,useContext} from 'react'
import { Redirect } from 'react-router';
import userService from '../service/UserService'
import CompletionPage from './CompletionPage';
const UserContext = React.createContext();

export function useAuth(){
    return useContext(UserContext);
}
export default function AuthProvider({children}) {
    const [user, setuser] = useState()
    const [details, setDetails] = useState()
    const [isLoading, setisLoading] = useState(true)
    async function GetDetails(x){
        
        if(x){
            let { data: UserDetails, error } = await userService.supabase.from('UserDetails').select('*').match({id:x.user.id})
            if(error){
                return;
            }
            
            setDetails(UserDetails)
               
            
        }
        
        
    }
    useEffect(() => {
        const session = userService.supabase.auth.session()
        setuser(session?.user ?? null)
        GetDetails(session)
        setisLoading(false)
        const {data:listener} = userService.supabase.auth.onAuthStateChange(
            async (event, session) => {
                setuser(session?.user ?? null)
                setisLoading(false)
            }
        )
        
        
        return ()=>{
            listener?.unsubscribe();
        }
    }, [])
    const value ={
        user,details
    }
    return (
        <UserContext.Provider value={value}>
            {!isLoading&&children}
        </UserContext.Provider>
    )
}
