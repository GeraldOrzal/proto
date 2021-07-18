import React,{useEffect,useState} from 'react'
import './Styles/BaseStyle.css'
import supabase from '../service/Connection'
import {Redirect} from 'react-router-dom'
import {useAuth} from './AuthProvider';
export default function Membership() {
    const [members, setmembers] = useState()
    const [status, setstatus] = useState()
    const [current,setCurrent] = useState()
    const {details} = useAuth();
async function PopulateData(table,cb){

    let { data, error } = await supabase.from(table).select('*')
    if(error){
        return
    }
    cb(data)

}
async function UpdateDriverStatus(id,userdetails_id){
    const { error } = await supabase.from('userdetails').update({ driverstatus_id: id }).eq('userdetails_id', userdetails_id)
    if(error){
        return
    }

}
useEffect(()=>{
    if(current===undefined){
        return;
    }
    
},[current])
function RenderOption(current){
    
    return status?.map(({driverstatus_id,description})=>{
        return <option key={driverstatus_id} selected={current===driverstatus_id?"selected":""} value={driverstatus_id}>{description}</option>
    })
    
    
}
function RenderTableRows(){
    return members?.map(({fullname,driverstatus_id,userdetails_id})=>{
        return <tr key={userdetails_id}>
            <td>{fullname}</td>
            <td>
                
                <select onChange={(x)=>{
                    UpdateDriverStatus(x.currentTarget.value,userdetails_id)
                }}>
                    {RenderOption(driverstatus_id)}        
                </select>
            </td>
            <td><button>CHECK</button></td>
        </tr>
    });
}
async function GetAllPendingMember(cb){
    let { data: userdetails, error } = await supabase.from('userdetails').select('*').match({userroleid:3})
    if(error){
        return
    }
    cb(userdetails)
}
useEffect(()=>{
    GetAllPendingMember(setmembers);
    PopulateData('driverstatus',setstatus);
},[])
    return (
        details[0].userroleid===3?<Redirect to="/unauthorized"/>:
        <div className="base">
                <table>
                        <thead>
                        <tr>
                            <th>
                                Name:
                            </th>
                            <th>
                                Status:
                            </th>
                            <th>
                                Check Requirements:
                            </th>
                            <th>
                                
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                            {RenderTableRows()}
                        </tbody>
                        
                    
                    </table>
        </div>
    )
}
