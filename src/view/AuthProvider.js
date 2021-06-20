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
    const [joinGC,setJoinGC] = useState({})
    const [sections,setSections] = useState({})
    const [allMessages,setAllMessages] = useState({})
    const [gcAvatar,setGcAvatar] = useState()
    const [userAvatar,setUserAvatar] = useState()

    async function GetDetails(x){
        
        if(x){
            let { data: UserDetails, error } = await supabase.from('userdetails').select('*').match({id:x.user.id})
            if(error){
                return;
            }
            
            setDetails(UserDetails)
            console.log(UserDetails)
            
        }
        
        
    }
    useEffect(() => {
        const session = supabase.auth.session()
        setuser(session?.user ?? null)
        GetDetails(session)
        groupChatServices.GetDefaultAvatars("defaultavatars","groupphoto",setGcAvatar);
        groupChatServices.GetDefaultAvatars("defaultavatars","useravatars",setUserAvatar);
        const {data:listener} = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setuser(session?.user ?? null)
                setisLoading(false)
            }
        )
        console.log(session)
       
        return ()=>{
            listener?.unsubscribe();
        }
    }, [])
    function InitGC(){
        groupChatServices.GetAllGroupChat(details[0]?.userdetails_id,(createdgc)=>{    
            if(Object.entries(createdgc).length===0){
                setJoinGC({message:"NO AVAILABLE GC"})
                return;
            }
                            let temp = {}
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
             
            temp = {
                ...temp,
                [gclist_id]:newGc
            }
            
            });
            setJoinGC(temp)
            
        }); 
        
    }
    useEffect(()=>{
        console.log(details)
        console.log("sadasdad")
        if(details===undefined){
            return
        }
        console.log(details)
        let subgc = supabase.from('userlist:userdetails_id=eq.'+details[0]?.userdetails_id).on('INSERT', payload => {
            groupChatServices.GetCurrentGC(payload.new.gclist_id,(v)=>{
                let {groupname,datecreated,fullname,timecreated,gclist_id,code,groupavatar} = v[0];
    
                let temp = {
                    groupname,
                    datecreated,
                    timecreated,
                    gclist_id,
                    groupavatar,
                    code,
                    fullname
                }
                setJoinGC(prevstate=>{
                    return {
                        ...prevstate,
                        [gclist_id]:temp
                    }
                })
            })
            
            
        }).subscribe()    
        if(Object.entries(joinGC).length===0){   
            InitGC()
        }
        return ()=>{
            subgc.unsubscribe();
        }
         
    },[details])
    
   
    useEffect(()=>{
        console.log(joinGC)
        console.log(sections)
        if(joinGC === undefined ||details === undefined || Object.entries(details).length === 0||Object.entries(joinGC).length === 0){
            return;
        }
        if(joinGC.message){
            return;
        }
        let keys = Object.keys(joinGC)
        let subs = []
        let messages;
        keys.map((f,index)=>{
            const sub = supabase.from('sections:gclist_id=eq.'+f).on('INSERT', payload => {     
                let {gclist_id,section_id} = payload.new;
                 messages = supabase.from('messages:section_id=eq.'+section_id).on('INSERT', payload => {
                 let {messages_id,section_id} = payload.new;
                 groupChatServices.GetMessage(messages_id,(s)=>{
                     setAllMessages(prevState=>{
                         if(prevState[section_id]!==undefined){
 
                             return{
                                 ...prevState,
                                 [section_id]:prevState[section_id].concat(s)
                             }
                         }
                         return {
                             ...prevState,
                             [section_id]:s
                         }
                     }
                     )
                 })
                 
                 }).subscribe()
                setSections(prevState=>{
                        if(prevState[gclist_id]===undefined){
                            return {
                                ...prevState,
                               [gclist_id]:[payload.new]
                            }
                        }else{   
                            return {
                                ...prevState,
                                [gclist_id]: prevState[gclist_id].concat([payload.new])
                            }                         
                        
                        
                        }
                        
                    }    
                )
                

            }).subscribe()
            subs.push(sub)
            groupChatServices.GetSections(f,(b)=>{
                    setSections(prevstate=>{
                        if(b.length===0){
                            return {
                                ...prevstate,
                                [f]:[]
                            }
                        }else{
                            return{
                                ...prevstate,
                                [f]:b
                            }
                        }
                    })
                    if(index===keys.length-1){
                
                        setisLoading(false)
                    }
            })
            
            
        })
        return ()=>{
            subs.map((v)=>{
                v.unsubscribe()
            })
            if(messages!==undefined){
                messages?.unsubscribe()
            }
            
        }
        
        
    },[joinGC,details])
    useEffect(()=>{
        
        console.log(sections)
        let listener = []
        
        
        
        let key = Object.keys(sections)
        key.map((c)=>{
        
        sections[c].map((v)=>{
            const messages = supabase.from('messages:section_id=eq.'+v.section_id).on('INSERT', payload => {
                let {messages_id,section_id} = payload.new;
                groupChatServices.GetMessage(messages_id,(s)=>{
                    setAllMessages(prevState=>{
                        if(prevState[section_id]!==undefined){

                            return{
                                ...prevState,
                                [section_id]:prevState[section_id].concat(s)
                            }
                        }
                        return {
                            ...prevState,
                            [section_id]:s
                        }
                    }
                    )
                })
                
            }).subscribe()
            listener.push(messages)
            groupChatServices.GetAllMessages(v.section_id,(val)=>{
                setAllMessages(prevState=>{
                    return {
                        ...prevState,
                        [v.section_id]:val
                    }
                }
                
                )
                                
            })
            
        })
        
        })
    
    
        return ()=>{
            listener?.map((x)=>{
                x.unsubscribe()
            })
        }
    },[isLoading])
    const value ={
        user,details,joinGC,sections,allMessages,isLoading,gcAvatar,userAvatar
    }
    return (
        <UserContext.Provider value={value}>
            {!isLoading&&children}
        </UserContext.Provider>
    )
}
