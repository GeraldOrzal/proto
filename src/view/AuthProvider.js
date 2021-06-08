import React,{useState,useEffect,useContext} from 'react'
import userService from '../service/UserService'
const UserContext = React.createContext();

export function useAuth(){
    return useContext(UserContext);
}
export default function AuthProvider({children}) {
    const [user, setuser] = useState()
    const [isLoading, setisLoading] = useState(true)
    useEffect(() => {
        const session = userService.supabase.auth.session()
        setuser(session?.user ?? null)
        setisLoading(false)
        console.log(session);
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

    return (
        <UserContext.Provider value={user}>
            {!isLoading&&children}
        </UserContext.Provider>
    )
}
