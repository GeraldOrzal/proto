import * as r from 'ramda'
import {notNull, PassLim, validProvider} from './checker'
const createInput = (email,password)=>{
    return checkEmail(email)&&checkPassword(password)?
    Object.freeze({
        email:email,
        password:password
    })
    :null
}
const checkEmail = (email) =>{
    return r.allPass([
        notNull,
        validProvider
    ])(email)
}
const checkPassword = (password) =>{
    return r.allPass(
        [
            notNull,
            PassLim(8)

        ]
    )(password)
}
const InputFactory = ()=>({
   
        createInput,
        checkEmail,
        checkPassword
    
});


export const inputReq = InputFactory();

