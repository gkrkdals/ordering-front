import React, {ComponentPropsWithoutRef} from "react";

interface CardProps extends ComponentPropsWithoutRef<'div'>{
  children?: React.ReactNode;
}

export default function Card({ children, ...props }: CardProps) {
  return (
    <div
      {...props}
      className="shadow rounded px-4 py-3 my-3"
      style={{
        backgroundColor: "#F1F1F1",
        ...props.style
      }}
    >
      {children}
    </div>
  )
}