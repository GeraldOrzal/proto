import React,{useState,useEffect,useRef} from 'react'
import './Styles/CompletionPage.css'
import {useAuth} from './AuthProvider'
import supabase from '../service/Connection'
import {Redirect} from 'react-router-dom'
import './Styles/BaseStyle.css'
export default function CompletionPage() {
    const {user,details} = useAuth()
    const [isYes,setIsYes] = useState(true)
    const [optValue, setoptValue] = useState({})
    const [codeEnabler, setcodeEnabler] = useState(false)
    const [errorMessage,setErrorMessage] = useState()
    const [codes, setcodes] = useState()
    const [validCode, setvalidCode] = useState()
    const [isAdmin, setisAdmin] = useState(false)
    function SubscribeToChangesInCode(){
        const admincodes = supabase.from('admincodes').on('UPDATE', payload => {
            setcodes(payload.new)
        }).subscribe()
        return admincodes;

    }
    async function HandleSubmit(x){
        x.preventDefault()
        if(x.target[0].value!=3){
            if(isAdmin){
                UpdateCodes(validCode.admincodes_id,true)

            }else{
                alert("CODES ARE NOT VALID")
                return;
            }   
        }
        const input ={
            fullname: x.target[2].value+" "+x.target[4].value+" "+x.target[3].value, 
            dateofbirth: x.target[5].value,
            mothersmaidenname: x.target[6].value ,
            driverlicensenumber:x.target[12].value  ,
            expirationdate: x.target[13].value ,
            motorvehiclenumber:x.target[15].value ,
            platenumber:x.target[16].value ,
            franchisenumber:x.target[17].value ,
            expirationdate_franchise:x.target[18].value ,
            otherscooperative:x.target[21].value  
        }  
        
        const driver ={ fullname: input.fullname, dateofbirth: input.dateofbirth,mothersmaidenname: input.mothersmaidenname ,driverlicensenumber: input.driverlicensenumber ,expirationdate: input.expirationdate,motorvehiclenumber:input.motorvehiclenumber,platenumber:input.platenumber,franchisenumber:input.franchisenumber,franchiseexpirationdate:input.expirationdate_franchise,othercoop:input.otherscooperative ,id :user.id,userroleid:x.target[0].value,driverstatus_id:2}
        const admin = { fullname: input.fullname, dateofbirth: input.dateofbirth,mothersmaidenname: input.mothersmaidenname ,driverlicensenumber: input.driverlicensenumber ,expirationdate: input.expirationdate,motorvehiclenumber:input.motorvehiclenumber,platenumber:input.platenumber,franchisenumber:input.franchisenumber,franchiseexpirationdate:input.expirationdate_franchise,othercoop:input.otherscooperative ,id :user.id,userroleid:x.target[0].value}
        const { error } = await supabase.from('userdetails').insert([x.target[0].value==3?driver:admin])
        if(error){
            setErrorMessage(error.message)
            return;
        }
        alert("SUCCESS");
        window.location.reload();
    }
    function RenderOption(optKey){
        if(Object.keys(optValue).length===0){
            return(<></>)
        }
        
        let a = Object.keys(optValue[optKey][0])
        
        return optValue[optKey].map((x)=>
            
            <option value={x[a[0]]}>{x[a[1]]}</option>
        )
        
        
    }
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
    async function GetAllCodes(cb){
        let { data, error } = await supabase.from('admincodes').select('code,admincodes_id').match({isused:false})
        if(error){
            return
        }
        cb(data)
    }
    async function UpdateCodes(id,bool){
        const { data, error } = await supabase.from('admincodes').update({ isused: bool }).eq('admincodes_id', id)
        if(error){
            return
        }
    }
    useEffect(()=>{
        //let b = ["userrole"]
        PopulateData('userrole',setoptValue)
        GetAllCodes(setcodes);
        const listener = SubscribeToChangesInCode()
        return ()=>{
            listener.unsubscribe()
        }
    },[])
    return (
        details?.length===0?
    <div className="base">
        <label>{errorMessage}</label>
        <form id="completion" onSubmit={(x)=>{HandleSubmit(x)}}>
            <label>ACCOUNT TYPE:</label>
            <select onChange={(x)=>{
                setcodeEnabler(x.currentTarget.value==3?true:false)
            }}>
                {RenderOption('userrole')}
            </select>
            <label>CODE:</label>
            <input disabled={codeEnabler} onChange={(x)=>{
                let a = []
                codes.map(({admincodes_id,code})=>{
                    if(x.currentTarget.value==code.trim()){
                        a.push({admincodes_id,code})   
                    }
                })
                if(a.length!==0){
                    setvalidCode(a[0])
                    setisAdmin(true)
                    x.currentTarget.style.border="solid green 2px"
                }else{
                    x.currentTarget.style.border="solid red 2px"
                }
            }}/>
            <label>FIRST NAME</label>
            <input type="text"/>
            <label>LAST NAME</label>
            <input type="text"/>
            <label>MIDDLE NAME</label>
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
            <label>Franchise Number Case Number (if any)</label>
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
    </div>:
    <Redirect to="/user"/>  
        
    )
}
