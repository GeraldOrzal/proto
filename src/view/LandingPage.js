import React from 'react'
import { Redirect } from 'react-router';
import {useAuth} from './AuthProvider'
import {Desktop} from './Components/Responsive'
import ImageSlider from './Components/ImageSlider'
export default function LandingPage() {
    const {user} = useAuth();
    return (
        user?<Redirect to={"/user"}/>:
        <Desktop>
            <ImageSlider/>
            <label>INFO</label>
        </Desktop>

        
    )
}
