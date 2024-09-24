import React from "react";

export default function CenterContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className='d-flex justify-content-center align-items-center' style={{ width: '100vw', height: '100vh' }}>
      {children}
    </div>
  )
}