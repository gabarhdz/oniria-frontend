import React from 'react'
interface InstagramProps {
    width: number;
    height :  number;
    color:string;
}


const Instagram: React.FC<InstagramProps> = ({width,height,color}) => {
  return (
    <span className="icon-[line-md--instagram]" style={{"width": `${width}px`, "height": `${height}px`, "color": `#${color}`}}>
    </span>
  )
}

export default Instagram