import {DangerButton} from "@src/components/atoms/Buttons.tsx";

interface GoBackButtonProps {
  handleGoBack: () => void;
}

export default function GoBackButton(props: GoBackButtonProps) {
  return (
    <DangerButton onClick={props.handleGoBack}>
      <i className="bi bi-arrow-left" />
    </DangerButton>
  )
}