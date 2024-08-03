import React from "react";

export default function Background({ children } : { children: React.ReactNode }) {
  return (
    <div style={{backgroundColor: "#EEEEEE"}}>
      {children}
    </div>
  )
}