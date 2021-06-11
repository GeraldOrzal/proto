import React,{useState} from 'react'
import "../Styles/ImageSlider.css"
export default function ImageSlider(props) {
    const [currentImage, setcurrentImage] = useState(0)
    const renderImages = ()=>{
        let count = 0;
        return props.list?props.list.map(
            ({src,alt})=>{
                return <img src={src} alt={alt} key={count++}/>
            }
        ):<></>
    }
    function HandleLeftClick(){
        setcurrentImage(currentImage-1)
    }
    return (
        <div id="slider_cont">
            
            <div id="imgCont">
                <button>{"<"}</button>
                    {renderImages()}
                <button>{">"}</button>
            </div>       
            <div id="cirCont">
                <span></span>
                <span></span>
                <span></span>
            </div>
            
        </div>
    )
}
