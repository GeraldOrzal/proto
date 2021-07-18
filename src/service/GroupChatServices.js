import supabase from './Connection'
class GroupChatServices {
    async GetMessage(id,storage){
        let { data: messages, error } = await supabase.from('new_messages').select('*').match({messages_id:id})
        if(error){
            return
        }
        storage(messages)
        
    }
    async UploadFile(bucket,folder,file,cb){
        const {data,error} = await supabase.storage.from(bucket).upload(folder,file)
        if(error){
            return 
        }
        cb(data)
    }
    async GetAllMessages(id,cb){
        let { data: make_sense_message, error } = await supabase.from('new_messages').select('*').order('messages_id',{ascending:true}).match({section_id:id}).limit(100)
        
        if(error){
            return;
        }
        
        cb(make_sense_message)
        
    }
    GetFileViaKey(bucket,key,cb){
        const {data,error} = supabase.storage.from(bucket).getPublicUrl(key)
        if(error){
            return
        }
        cb(data)
    }
    async UpdateSchedulePeople(currentCount,schedule_id,cb,type){
        let latestVal
        if(type==="ADD"){
            latestVal = currentCount+1
        }else{
            latestVal = currentCount-1
        }
        const { data, error } = await supabase.from('schedules').update({ num_people: latestVal }).eq('schedule_id', schedule_id)
        if(error){
            return
        }
        cb()
    }
  
    async InsertGC(value){
        const { error } = await supabase.from('gclist').insert([value])
        console.log(error)
        if(error){
            return
        }
        
    }
    async InsertMessage(value){
        const {error } = await supabase.from('messages').insert([value])
        if(error){
            return
        }
    }
    async GetNewlyCreatedGC(id,storage){
        let { data: createdgc, error } = await supabase.from('createdgc').select('*').match({gclist_id:id})
        if(error){
            return;
        }
        
        storage(prevstate =>prevstate.concat(createdgc))
    }
    GetAvatarURL(bucket,folder,name){
        const {data} = supabase.storage.from(bucket).getPublicUrl(folder+"/"+name);
        return data.publicURL;
    }
    
    async GetDefaultAvatars(bucket,folder,storage){
        const {data,error} = await supabase.storage.from(bucket).list(folder)
        
        if(error){
            return
        }
        let temp = []
        data.forEach(elem => {
            
            const val = this.GetAvatarURL(bucket,folder,elem.name)
            const model = {
                filename: elem.name,
                publicUrl:val
            }
            temp.push(model)

        });

        storage(temp)
    }
   async GetSections(id,cb){
        let { data: sections, error } = await supabase.from('sections').select('*').match({gclist_id:id})
        if(error){
            return;
        }
        cb(sections)
        
        
    }
    async GetAllGroupChat(id,storage){
        let { data: createdgc, error } = await supabase.from('getallgc').select('*').match({userdetails_id:id})
        if(error){
            return;
        }
        
        storage(createdgc)
    }
    async InsertSection(value,cb){
        let {error } = await supabase.from('sections').insert([value]);
        if(error){
            return;
        }
        
    }
     Download(bucket,path){
        this.GetFileViaKey(bucket,path,(s)=>{
            let r = document.createElement("a")
            r.href = s.publicURL
            r.click()
        })
    }
    async UpdateResponse(sched,cb){
        const { data, error } = await supabase.from('scheduleaccepted').update([{ attended_at: new Date().toISOString().split("T")[0], time_attended: new Date().getHours()+":"+new Date().getMinutes()}]).match({scheduleaccepted_id:sched})
        if(error){
            return
        }
        cb(sched)
    }

    AcceptSched(schedule_id,currentCount,details){
        if(currentCount===0){
            alert("NO SLOTS AVAILABLE")
            return;
        }
        
        this.UpdateSchedulePeople(currentCount,schedule_id,async ()=> {
            const { data, error } = await supabase.from('scheduleaccepted').insert([{ schedule_id: schedule_id, responded_by: details,remarks_id:2 }])
            if(error){
                return
            }   
        },"SUB")      
    }
    RemoveSched(schedule_id,currentCount){
        this.UpdateSchedulePeople(currentCount,schedule_id,async ()=> {
            const { data, error } = await supabase.from('scheduleaccepted').update([{remarks_id:1 }]).match({schedule_id:schedule_id})
            if(error){
                return
            }   
        },"ADD")      
    }
    
    async GetCurrentGC(id,cb){
        let { data: createdgc, error } = await supabase.from('getallgc').select('*').match({gclist_id:id})
        if(error){
            return
        }
        cb(createdgc)
    }
    async SecView(id,cb){
        let { data: get_sections, error } = await supabase.from('sections').select('*').match({userdetails_id:id})
        if(error){
            return;
        }
        cb(get_sections)
    }
    async GetGCViaCode(code,cb){
        let { data: createdgc, error } = await supabase.from('getallgc').select('*').match({code:code})
        if(error){
            return
        }
        cb(createdgc)
    }
    async InsertUser(value){
        let { error } = await supabase.from('userlist').insert([value])
        if(error){
            return
        }

    }
}
const groupChatServices = new GroupChatServices()
export default groupChatServices;


