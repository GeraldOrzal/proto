import React,{useState} from 'react'
import './Styles/CompletionPage.css'
import {useAuth} from './AuthProvider'
import supabase from '../service/UserService'
import {Redirect} from 'react-router-dom'
export default function CompletionPage() {
    const {user,details} = useAuth()
    const [isYes,setIsYes] = useState(true)
    const [errorMessage,setErrorMessage] = useState()
    async function HandleSubmit(x){
        console.log(x)
        x.preventDefault()
        const input ={
            fullname: x.target[0].value+" "+x.target[2].value+" "+x.target[1].value, 
            dateofbirth: x.target[3].value,
            mothersmaidenname: x.target[4].value ,
            driverlicensenumber:x.target[10].value  ,
            expirationdate: x.target[11].value ,
            motorvehiclenumber:x.target[13].value ,
            platenumber:x.target[14].value ,
            franchisenumber:x.target[15].value ,
            expirationdate_franchise:x.target[16].value ,
            otherscooperative:x.target[19].value  
        }  
        
        
        const { error } = await supabase.from('userdetails').insert([{ fullname: input.fullname, dateofbirth: input.dateofbirth,mothersmaidenname: input.mothersmaidenname ,driverlicensenumber: input.driverlicensenumber ,expirationdate: input.expirationdate,motorvehiclenumber:input.motorvehiclenumber,platenumber:input.platenumber,franchisenumber:input.franchisenumber,franchiseexpirationdate:input.expirationdate_franchise,othercoop:input.otherscooperative ,id :user.id,userroleid:1}])
        if(error){
            setErrorMessage(error.message)
            return;
        }
        alert("SUCCESS");
        window.location.reload();
    }
    return (
        details?.length===0?
    <>
        <label>{errorMessage}</label>
        <form id="completion" onSubmit={(x)=>{HandleSubmit(x)}}>
            <label>FIRSTNAME</label>
            <input type="text"/>
            <label>LASTNAME</label>
            <input type="text"/>
            <label>MIDDLENAME</label>
            <input type="text"/>
            <label>DATE OF BIRTH</label>
            <input type="date"/>
            <label>MOTHERS MAIDEN NAME</label>
            <input type="text"/>
            <label>MARITAL STATUS</label>
            <select>

            </select>
            <label>COMPLETE ADDRESS</label>
            <div id="add">
                <label>Blk St No</label>
                <input type="text"/>
                <label>Baranggay</label>
                <input type="text"/>
                <label>City</label>
                <input type="text"/>
                <label>Province</label>
                <input type="text"/>
            </div>
            <label>DRIVERS LICENSE NUMBER</label>
            <input type="text"/>
            <label>Expiration Date</label>
            <input type="date"/>
            <label>Car Category</label>
            <select>

            </select>
            <label>Motor Vehicle Number</label>
            <input type="text"/>
            <label>Plate Number</label>
            <input type="text"/>
            <label>Franchisenumber case number (if any)</label>
            <input type="text"/>
            <label>Expiration Date</label>
            <input type="date"/>
            <label>Have other membership cooperative</label>
            <div>
                <label>Yes</label>
                <input name="coop" type="radio"  onClick={()=>{setIsYes(false)}}/>
                <label>No</label>
                <input name="coop" type="radio"  onClick={()=>{setIsYes(true)}}/>
            </div>
            <label>Others?</label>
            <input type="text" disabled={isYes}/>
            <label>DRIVERS LICENSE PICTURE</label>
            <input type="file"/>
            <label>Medical</label>
            <input type="file"/>
            <label>Car Inssurance</label>
            <input type="file"/>
            <button>SUBMIT</button>
        </form>        
</>:<Redirect to="/user"/>  
        
    )
}
