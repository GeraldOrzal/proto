import React from 'react'
import { Redirect } from 'react-router';
import {useAuth} from './AuthProvider'
export default function LandingPage() {
    const user = useAuth();
    return (
        user?<Redirect to={"/user/"+user.email}/>:
        <div>
            Landing Page
        </div>
    )
}
