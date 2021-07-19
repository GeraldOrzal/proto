import React,{useEffect,useState} from 'react'
import {useAuth} from './AuthProvider'
import {Redirect} from 'react-router-dom'
import supabase from '../service/Connection'
import {DragDropContext,Droppable,Draggable} from 'react-beautiful-dnd'
import '../view/Styles/BaseStyle.css'
export default function Admin() {
    const {gcmembers,joinGC,details,schedule,isLoading} = useAuth()
    const [list, setlist] = useState({})
    const [isLock, setisLock] = useState(false)
    useEffect(()=>{
        let a =  Object.keys(joinGC)
        let temp = {
            notassigned:[]
        }
        schedule?.map((y)=>{
            if(y.assign_at===null){
                temp.notassigned.push(y)
                return
            }
        })
        a.map((r)=>{
            temp[r] = []
            schedule.map((t)=>{
                if(r==t.assign_at){
                    
                    temp[r].push(t)
                }

            })
        })
        setlist(temp)
        console.log(temp)
    },[])
    function RenderDraggable(e,index,isDis){
        return <Draggable draggableId={e.schedule_id.toString()} index={index} key={e.schedule_id}type="SCHED" isDragDisabled={isDis} >
            {
                (provided)=>(
                    <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}className="sched">
                        <label>{e.description+"\n PERSONS:"+e.num_people+"\n BOD:"+e.fullname}</label>
                        {provided.placeholder}
                    </div>
                )
            }
        </Draggable>
    }
    useEffect(()=>{
        console.log("sdas")
    },[list])
    function RenderSlots(){
       let e = Object.keys(joinGC)
       return e.map((r)=>{
           
           return(
            <Droppable droppableId={r} type="SCHED">
            
            {(provided, snapshot) =>     
            
                <div ref={provided.innerRef} className="slots"> 
                    <label>{joinGC[r].groupname}</label>
                    {list[r]?.map((t,index)=>RenderDraggable(t,index,isLock))}            
                    {provided.placeholder}
                </div>
                }
            </Droppable>
           )
       
       
       })
       
       
    }
   
    function RenderSched(){
        
        return list.notassigned?.map((e,index)=>RenderDraggable(e,index,false))
    }
    async function UpdateAssign(s){
        Move(s)
        const { data, error } = await supabase.from('schedules').update({ assign_at: s.destination.droppableId==="schedule"?null:s.destination.droppableId }).eq('schedule_id', s.draggableId)
        if(error){
            return
        }
        
        
    }
    
    function Move(s){
        let  sourceClone = Array.from(s.source.droppableId==="schedule"?list.notassigned:list[s.source.droppableId])
        let destClone = Array.from(s.destination.droppableId==="schedule"?list.notassigned:list[s.destination.droppableId])
        
        const[removed] =sourceClone.splice(s.source.index, 1)
        destClone.splice(s.destination.index,0,removed)

        if(s.destination.droppableId==="schedule"){
            setlist(prev=>{
                return{
                    ...prev,
                    notassigned:destClone,
                    [s.source.droppableId]:sourceClone      
                }
            })
        }else{
            if(s.source.droppableId==="schedule"){
                setlist(prev=>{
                    return{
                        ...prev,
                        notassigned:sourceClone,     
                        [s.destination.droppableId]:destClone
                    }
                })
            }else{
                setlist(prev=>{
                    return{
                        ...prev,
                        [s.source.droppableId]:sourceClone,
                        [s.destination.droppableId]:destClone
                    }
                })
            }
        }
        
    }
    function Drop(s){
        if (!s.destination) {
            return;
        }
          
        if(s.source.droppableId===s.destination.droppableId){
            return
        }          
          
        UpdateAssign(s)
    }
    return (
        details[0].userroleid!==2&&!isLoading?<Redirect to="/user"/>:
        <div id="adminpage" className="base">
            <DragDropContext onDragEnd={Drop} >
            <div id="schedHolder">
                <h2>SCHEDULES</h2>
                <Droppable droppableId="schedule" type="SCHED">
                    {(provided,q)=>
                        <div id="availsched" ref={provided.innerRef}     {...provided.droppableProps}>
                                {RenderSched()}
                                {provided.placeholder}
                        </div>
                    }
                    
                </Droppable>      
            </div>
                    <div id="groupHolder">
                        <h1>GROUP CHATS</h1>
                        <div id="gcslots">
                            {RenderSlots()}
                        </div>    
                    </div>
            
            </DragDropContext>
            
        </div>
    )
}
