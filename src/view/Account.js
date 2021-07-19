import React from 'react'
import { useAuth } from './AuthProvider'
import './Styles/BaseStyle.css'
export default function Account() {
    const {details} = useAuth()
    return (
        <div className="base">
            <label>{details[0]?.userroleid}</label>
        </div>
    )
}
