import React from 'react'
import { Redirect } from 'react-router';
import {useAuth} from './AuthProvider'
import Responsive,{useResponsive} from './Components/Responsive'
import ImageSlider from './Components/ImageSlider'
import './Styles/BaseStyle.css'
export default function LandingPage() {
    const {user} = useAuth();
    const {isMobile} = useResponsive()
    return (
        user?<Redirect to={"/user"}/>:<div className="base">
            
        </div>

    )
}
