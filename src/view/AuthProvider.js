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
    const [schedule, setschedule]= useState()
    const [currentSection,setCurrentSection] = useState()
    const [burgerClick, setburgerClick] = useState(false)
    const [gcmembers,setgcmembers] = useState()
    const [driverSched, setdriverSched] = useState()
    async function GetDriverSched(){
        let { data: scheduleaccepted, error } = await supabase.from('scheduleaccepted').select('*').match({responded_by:details[0]?.userdetails_id,remarks_id:2})
        if(error){
            return
        }
        setdriverSched(scheduleaccepted)
    }
    async function GetGcMembers(id){
        let { data: userlist, error } = await supabase.from('userlist').select('*').match({gclist_id:id})
        if(error){
            return;
        }
        setgcmembers(prev=>{
            return{
                ...prev,
                [id]:userlist
            }
        })
    }
    async function GetDetails(x){
        console.log(x)
        if(x){
            let { data: UserDetails, error } = await supabase.from('userdetails').select('*').match({id:x.user.id})
            if(error){
                return;
            }
            
            setDetails(UserDetails)
        
            
        }
        
        
    }
    async function GetAllSchedules(cb){
        let { data: attendance, error } = await supabase.from('schedule_modif').select('*').match({isactive:true,remarks_id:2})
        if(error){
            return
        }
        console.log(attendance)
        cb(attendance)
    }
    useEffect(() => {
        const session = supabase.auth.session()
        setuser(session?.user ?? null)
        GetDetails(session)
        
        const sub = supabase.from('schedules').on('INSERT', payload => {
            GetAllSchedules(setschedule)
        }).on('UPDATE',payload=>{
            GetAllSchedules(setschedule)
        }).subscribe()
        const sub2 = supabase.from('scheduleaccepted').on('INSERT', payload => {
            setdriverSched(prev=>[...prev,payload.new])
        }).on('UPDATE',payload=>{
            setdriverSched(prev=>[...prev,payload.new])
        }).subscribe()
        
        groupChatServices.GetDefaultAvatars("defaultavatars","groupphoto",setGcAvatar);
        groupChatServices.GetDefaultAvatars("defaultavatars","useravatars",setUserAvatar);
        
        const {data:listener} = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setuser(session?.user ?? null)
                setisLoading(false)
            }
        )
        if(session===null){
            setisLoading(false)
        }
       
        return ()=>{
            sub?.unsubscribe()
            sub2?.unsubscribe()
            listener?.unsubscribe();
        }
    }, [])
    function InitGC(){
        
        groupChatServices.GetAllGroupChat(details[0]?.userdetails_id,(createdgc)=>{    
            if(Object.entries(createdgc).length===0){
                setisLoading(false)
                return;
            }
            let temp = {}
            createdgc.forEach(element => {
                
                const {groupname,datecreated,timecreated,fullname,gclist_id,groupavatar,code} = element;
                GetGcMembers(gclist_id)
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
        if(details===undefined){
            return
        }
        if(details?.length===0){
            setisLoading(false)
            return
        }
        if(Object.entries(joinGC).length===0){   
            InitGC()
        }
        GetDriverSched()
        GetAllSchedules(setschedule)
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
        
        
        return ()=>{
            subgc.unsubscribe();
        }
         
    },[details])
    
   
    useEffect(()=>{
        if(joinGC === undefined ||details === undefined || Object.entries(details).length === 0||Object.entries(joinGC).length === 0){
            console.log(joinGC)
            return;
        }
        let keys = Object.keys(joinGC)
        let subs = []
        let messages;
        keys.map((f,index)=>{
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
        user,details,joinGC,sections,allMessages,isLoading,gcAvatar,userAvatar,setCurrentSection,currentSection,burgerClick,setburgerClick,gcmembers,schedule,setschedule,driverSched
    }
    return (
        <UserContext.Provider value={value}>
            {!isLoading&&children}
        </UserContext.Provider>
    )
}
