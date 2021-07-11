import React,{useEffect,useState} from 'react'
import './Styles/BaseStyle.css'
import supabase from '../service/Connection'
export default function Membership() {
    const [members, setmembers] = useState()
    const [status, setstatus] = useState()

async function PopulateData(table,cb){

    let { data, error } = await supabase.from(table).select('*')
    if(error){
        return
    }
    cb(prev=>{
        return {
            ...prev,
        [table]:data
        }   
    })

}
function RenderOption(){
    
    if(status===undefined){
        return(<></>)
    }
    return status['driverstatus'].map(({driverstatus_id,description})=>{
        return <option value={driverstatus_id}>{description}</option>
    })
    
    
}
function RenderTableRows(){
    return members?.map(({fullname,userdetails_id})=>{
        return <tr>
            <td>{fullname}</td>
            <td>
                <select value="2">
                    {RenderOption()}        
                </select>
            </td>
            <td><button>CHECK</button></td>
        </tr>
    });
}
async function GetAllPendingMember(cb){
    let { data: userdetails, error } = await supabase.from('userdetails').select('*').match({driverstatus_id:2})
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
