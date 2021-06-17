import React,{useState,useEffect,useContext} from 'react'
import groupChatServices from '../service/GroupChatServices'
import supabase from '../service/Connection'
const UserContext = React.createContext();

export function useAuth(){
    return useContext(UserContext);
}
export default function AuthProvider({children}) {
    const [user, setuser] = useState()
    const [details, setDetails] = useState()
    const [isLoading, setisLoading] = useState(true)
    const [joinGC,setJoinGC] = useState([])
    const [sections,setSections] = useState([])
    const [allMessages,setAllMessages] = useState({})

    async function GetDetails(x){
        
        if(x){
            let { data: UserDetails, error } = await supabase.from('userdetails').select('*').match({id:x.user.id})
            if(error){
                return;
            }
            
            setDetails(UserDetails)
        
            
        }
        
        
    }
    useEffect(() => {
        const session = supabase.auth.session()
        setuser(session?.user ?? null)
        GetDetails(session)
        const {data:listener} = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setuser(session?.user ?? null)
                setisLoading(false)
            }
        )
        setisLoading(false)
       
        return ()=>{
            listener?.unsubscribe();
        }
    }, [])
    useEffect(()=>{
        if(details===undefined){
            return;
        }
        
        if(joinGC.length==0){
            groupChatServices.SecView(details[0]?.userdetails_id,(val)=>{
                setSections(val)
            })
            groupChatServices.GetAllGroupChat(details[0]?.userdetails_id,(createdgc)=>{    
                let temp = []
                createdgc.forEach(element => {
                    const {groupname,datecreated,timecreated,fullname,gclist_id,groupavatar,code} = element;
                    let newGc = {
                        groupname,
                        datecreated,
                        timecreated,
                        fullname,
                        gclist_id,
                        groupavatar,
                        code
                    }
                 
                temp.push(newGc)
                
                });
                setJoinGC(temp)
            });    
        }
        
    },[details])
    

    useEffect(()=>{
        if(sections.length===0){
            return
        }
        sections.map(({section_id,gclist_id})=>{
            
            groupChatServices.GetAllMessages(section_id,(val)=>{
                
                if(val.length==0){
                    return
                }
                setAllMessages(prevState=>{
                    return {
                        ...prevState,
                        [section_id]:val
                    }
                })
            })
            
        })
        
        
        
    },[sections])
    useEffect(()=>{
        console.log(allMessages)    
    },[allMessages])
    const value ={
        user,details,joinGC,sections,allMessages
    }
    return (
        <UserContext.Provider value={value}>
            {!isLoading&&children}
        </UserContext.Provider>
    )
}
