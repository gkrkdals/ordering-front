import {DangerButton} from "@src/components/atoms/Buttons.tsx";
import React from "react";

interface GoBackButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  handleGoBack: () => void;
}

export default function GoBackButton(props: GoBackButtonProps) {
  return (
    <DangerButton onClick={props.handleGoBack} disabled={props.disabled}>
      <i className="bi bi-arrow-left" />
    </DangerButton>
  )
}