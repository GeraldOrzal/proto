import React,{useState,useEffect} from 'react'
import {useAuth} from './AuthProvider'
import {Redirect} from 'react-router-dom'
import supabase from '../service/Connection'
import './Styles/BaseStyle.css'
export default function BOD() {
    const {gcmembers,details,schedule} = useAuth()
    
    const [hub, sethub] = useState()
    function HandleForms(x){
        x.preventDefault()
        const input ={
            hub_id:x.target[0].value,
            start_at:x.target[1].value,
            end_at:x.target[2].value,
            num_people:x.target[3].value,
            submitted_by:details[0].userdetails_id,
            isactive:true
        }
        SubmitSchedule(input)
    }
    
    async function SubmitSchedule(input){
        const { error } = await supabase.from('schedules').insert([input])
        if(error){
            return
        }

    }
    async function RemoveSched(id){

    }
    async function PopulateData(){
        let { data: hubs, error } = await supabase.from('hubs').select('*')
        if(error){
            return
        }
        sethub(hubs)
    }

    function RenderOption(){
        if(hub===undefined){
            return (<></>)
        }
        return hub.map((s)=><option value={s.hub_id}>{s.description}</option>)
        
    }
    function RenderList(data){
        return data?.map((s)=><li value={s}>{"HUB: "+s.hub_id+" DATE: "+s.start_at+"-"+s.end_at+" NEEDED PERSONNEL:"+s.num_people} <button>EDIT</button> <button>REMOVE</button></li>)
    }
    useEffect(()=>{
        
        PopulateData()
    },[])
    return (
        details[0].userroleid!==1?<Redirect to="/user"/>:
        <div className="base" id="bodpanel">
            <form id="form_attendance" onSubmit={HandleForms}>
                <label>HUB:</label>
                <select>
                    {RenderOption()}
                </select>
                <label>
                    START AT:
                </label>
                <input type="date"/>
                <label>
                    ENDED AT:
                </label>
                <input type="date"/>
                <label>NO OF PEOPLE NEEDED:</label>
                <input/>
                <button>SUBMIT</button>
            </form>
            <ul>
                <label>ACTIVE SCHEDS:</label>
                {RenderList(schedule)}
            </ul>
        </div>
    )
}
