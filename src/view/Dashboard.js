import React from 'react'
import './Styles/BaseStyle.css'
import { useAuth } from './AuthProvider'
export default function Dashboard() {
    const {driverSched} = useAuth()
    
    return (
        <div className="base">
            <li>
                {driverSched?.map((r)=>{
                    return <label>r</label>
                })}
            </li>
        </div>
    )
}
