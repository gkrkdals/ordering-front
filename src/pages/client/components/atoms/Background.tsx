import React from "react";

export default function Background({ children } : { children: React.ReactNode }) {
  return (
    <div className='pb-5' style={{backgroundColor: "#EEEEEE"}}>
      {children}
    </div>
  )
}