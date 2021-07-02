import React,{useState,useContext} from 'react'
import {mobile,desktop} from './_responsive'
import {useMediaQuery} from 'react-responsive'

const ResponsiveContext = React.createContext()
export function useResponsive(){
    return useContext(ResponsiveContext)
}

export default function Responsive({children}) {
    const isMobile = useMediaQuery({
        minDeviceWidth:"300px",maxDeviceWidth:"450px"
      });
    const isTabletDevice = useMediaQuery({
        minDeviceWidth:"768px",maxDeviceWidth:"1024px"
      });
    
      const isLaptop = useMediaQuery({
        minDeviceWidth:"1024px",maxDeviceWidth:"1200px"
        
      });
    
      const isDesktop = useMediaQuery({
        minDeviceWidth:"1200px",maxDeviceWidth:"1360px"
        
      });
    
      const isBigScreen = useMediaQuery({
        query: "(min-device-width: 1360px )",
      });
    
    const value ={
        isTabletDevice,isLaptop,isDesktop,isBigScreen,isMobile
    }
    return (
        <ResponsiveContext.Provider value={value}>
            {children}
        </ResponsiveContext.Provider>
    )
}

