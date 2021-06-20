import supabase from './Connection'
class GroupChatServices {
    async GetMessage(id,storage){
        let { data: messages, error } = await supabase.from('new_messages').select('*').match({messages_id:id})
        if(error){
            return
        }
        storage(messages)
        
    }
    async UploadPhoto(bucket,folder,file,cb){
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


