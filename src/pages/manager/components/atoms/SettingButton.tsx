interface SettingButtonProps {
  setOpen: (value: boolean) => void;
}

export default function SettingButton(props: SettingButtonProps) {
  return (
    <button className='btn btn-secondary' onClick={() => props.setOpen(true)}>
      <i className="bi bi-gear"/>
    </button>
  )
}