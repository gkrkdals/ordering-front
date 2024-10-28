interface MuteButtonProps {
  muted?: boolean;
  setMuted?: (value: boolean) => void;
}

export function MuteButton({ setMuted, muted }: MuteButtonProps) {
  return (
    <button
      className={`btn btn-${muted ? 'secondary' : 'primary'}`}
      onClick={() => (setMuted ?? (() => {}))(!muted)}
    >
      {muted ? <i className="bi bi-volume-mute"></i> : <i className="bi bi-volume-up"></i>}
    </button>
  );
}