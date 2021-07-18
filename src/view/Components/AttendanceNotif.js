import React,{useState,useEffect} from 'react'
import {useAuth} from '../AuthProvider'
import '../../view/Styles/BaseStyle.css'
import groupChatServices from '../../service/GroupChatServices'
export default function AttendanceNotif() {
    const {user,driverSched,details,schedule} = useAuth()
    const [currentLength, setcurrentLength] = useState()
    const [schedToday, setschedToday] = useState([])
    useEffect(()=>{
        
        let a = []
        var today = new Date();
        driverSched?.map((s)=>{
            if(today.toISOString().split("T")[0]===s.start_at&&s.attended_at==null){
                a.push(s)
            }
        })
        setcurrentLength(a.length)
        setschedToday(a)
    },[])
    
    return (
        user&&details[0]?.userroleid===3&&schedToday?.length!==0?<div id="blackdrop">
            <div id="notif">
                <label>YOU HAVE A TRIP AT {schedToday[currentLength-1]?.description}</label>
                <div>
                    <button onClick={
                        ()=>{

                            groupChatServices.UpdateResponse(schedToday[currentLength-1].scheduleaccepted_id,()=>{
                                let a = Array.from(schedToday)
                                var index = a.indexOf(schedToday[currentLength-1])
                                if (index !== -1) {
                                  a.splice(index, 1);
                                  setschedToday(a)
                                }
                                setcurrentLength(prev=>prev-1)
                            })

                        }
                    }>ACCEPT</button>
                    <button onClick={
                        ()=>{
                            schedule?.map((r)=>{
                                if(r.schedule_id===schedToday[currentLength-1].schedule_id){
                                    groupChatServices.RemoveSched(schedToday[currentLength-1].scheduleaccepted_id,r.num_people)
                            
                                }
                                
                            })
                            let a = Array.from(schedToday)
                            var index = a.indexOf(schedToday[currentLength-1])
                            if (index !== -1) {
                                a.splice(index, 1);
                                setschedToday(a)
                            }
                            setcurrentLength(prev=>prev-1)
                        }
                    }>REMOVE</button>
                </div>
            </div>
        </div>:<></>
    )
}
