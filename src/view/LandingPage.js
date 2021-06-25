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
            <ImageSlider list={[{src:"data:image/jpeg;base64,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",alt:"My WIFE"}]}/>
            <label>INFO</label>
        </Desktop>

        
    )
}
