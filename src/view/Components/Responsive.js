import React from 'react'
import {useMediaQuery} from 'react-responsive'

export function Desktop({children}) {
    const bool = useMediaQuery({minDeviceWidth:"1020px",maxDeviceWidth:"1920px"})
    return bool?children:null
    
}
