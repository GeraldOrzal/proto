import { createClient } from '@supabase/supabase-js'

class UserService{
    constructor(){
        if(UserService.instance==null){
            UserService.instance = this;
            this.supabaseUrl = 'https://dnbzhfmfscolnmwfiqnl.supabase.co'
            this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjQ0MjE2MCwiZXhwIjoxOTM4MDE4MTYwfQ.M9Ini_vKoi5EzADQSnuBVul4ux7MnOpdNzdvEWqyFKs'
            this.supabase = createClient(this.supabaseUrl, this.supabaseKey)
        }
        return UserService.instance;
    }
}

const userService = new UserService();
Object.freeze(userService)
export default userService;
