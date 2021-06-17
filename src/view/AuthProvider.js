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

    async function GetDetails(x){
        
        if(x){
            let { data: UserDetails, error } = await supabase.from('userdetails').select('*').match({id:x.user.id})
            if(error){
                return;
            }
            groupChatServices.GetAllGroupChat(UserDetails[0].userdetails_id,(createdgc)=>{
                const temp = []
                createdgc.forEach(element => {
                    const {groupname,datecreated,timecreated,fullname,gclist_id,groupavatar,code} = element;
                    let newGc = {
                        groupname,
                        datecreated,
                        timecreated,
                        fullname,
                        gclist_id,
                        groupavatar,
                        code,
                        sectionsids:[],
                        messages:[]
                    }
                 
                    temp.push(newGc)
                 
                });
                setJoinGC(temp)
                joinGC.map((c)=>
                    groupChatServices.GetSections(c.gclist_id,(h)=>{
                        if(h.length!=0){
                            setJoinGC(prevstate =>{
                                return prevstate.map(obj=>{
                                    if(obj.gclist_id===h[0]?.gclist_id){
                                        return {
                                            ...obj,
                                            sectionsids:h
                                        }
                                    }else{
                                        return obj;
                                    }
                                })
                            }   
                            )
                        }
                    }) 
                )
                /*
                joinGC.map(
                    (elem)=>{
                        if(elem.sectionsids.length==0){
                            return;
                        }
                        /*
                        if(elem.length!=0){
                            elem.sectionsids.map(
                                
                                (item)=>{
                                    groupChatServices.GetAllMessages(item.section_id,(array)=>{
                                        if(array.length!=0){
                                            setJoinGC(prevstate =>{
                                                return prevstate.map(obj=>{
                                                    if(obj.gclist_id===h[0]?.gclist_id){
                                                        return {
                                                            ...obj,
                                                            sectionsids:h
                                                        }
                                                    }else{
                                                        return obj;
                                                    }
                                                })
                                            }   
                                            )
                                        }               
                                    })
                                }
                            )
                        }
                    }
                )*/
                
                
            });
            setDetails(UserDetails)
            
            
        }
        
        
    }
    useEffect(() => {
        const session = supabase.auth.session()
        setuser(session?.user ?? null)
        GetDetails(session)
        setisLoading(false)
        const {data:listener} = supabase.auth.onAuthStateChange(
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
        user,details,joinGC
    }
    return (
        <UserContext.Provider value={value}>
            {!isLoading&&children}
        </UserContext.Provider>
    )
}
