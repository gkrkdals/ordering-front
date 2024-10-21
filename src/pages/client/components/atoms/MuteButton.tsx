// import {getUser} from "@src/utils/socket.ts";

interface MuteButtonProps {
  muted: boolean;
  setMuted: (value: boolean) => void;
}

export function MuteButton({ setMuted, muted }: MuteButtonProps) {
  return (
    <button
      className={`btn btn-${muted ? 'secondary' : 'primary'} mb-2`}
      onClick={() => setMuted(!muted)}
    >
      {muted ? <i className="bi bi-volume-mute"></i> : <i className="bi bi-volume-up"></i>}
    </button>
  );
}