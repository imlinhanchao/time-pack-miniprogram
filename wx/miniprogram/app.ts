import { wxlogin } from "./utils/wx";

// app.ts
App<IAppOption>({
  globalData: {
    apiUrl: `https://time-pack.com/api`,
  },
  onShow() {
    wxlogin(this);
  },
})