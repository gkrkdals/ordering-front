import Router from "@src/router";
import { RecoilRoot } from "recoil";

function  App() {
  return (
    <RecoilRoot>
      <Router />
    </RecoilRoot>
  );
}

export default App;