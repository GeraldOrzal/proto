import supabase from './Connection'
class GroupChatServices {
    constructor(usertable,groupchattable){
        this.usertable = usertable;
        this.groupchattable = groupchattable;
    }
    async GetMessage(id,storage){
        let { data: messages, error } = await supabase.from('usablemessage').select('*').match({messages_id:id})
        if(error){
            return
        }
        storage(messages)
        
    }
    async GetAllMessages(section_id,cb){
        let { data: make_sense_message, error } = await supabase.from('make_sense_message').select('*').match({section_id:section_id})
        if(error){
            return;
        }
        cb(make_sense_message)
    }
    async InsertGC(storage,value){
        const { data, error } = await supabase.from('gclist').insert([value])
        if(error){
            return
        }
        storage(data)
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
        let { data: sections, error } = await supabase.from('sections').select('section_id,gclist_id').match({gclist_id:id})
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
}
const groupChatServices = new GroupChatServices("userlist","gclist")
export default groupChatServices;


