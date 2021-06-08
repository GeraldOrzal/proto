export const notNull = (any) => any != null

export const PassLim = (lim) => (any:string) => lim < any.length

export const PassMax = (max) => (any:string) => max > any.length

export const validProvider = (any) =>{
    const emaiProvider = [
        "@gmail.com","@yahoo.com"
    ]
    const val = emaiProvider.map(
        (x)=>{
            return any.includes(x)
        }
    )
   if(val.includes(true)){
       return true;
   }else{
        return false;
   }
   
}