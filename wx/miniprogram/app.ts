import { wxlogin } from "./utils/wx";

// app.ts
App<IAppOption>({
  globalData: {
    apiUrl: `http://time.net.librejo.cn/api`,
  },
  onShow() {
    wxlogin(this);
  },
})