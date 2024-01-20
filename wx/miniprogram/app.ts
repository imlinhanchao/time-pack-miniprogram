import { wxlogin } from "./utils/wx";

// app.ts
App<IAppOption>({
  globalData: {
    apiUrl: `http://127.0.0.1:3000`,
  },
  onLaunch() {
    wxlogin();
  },
})