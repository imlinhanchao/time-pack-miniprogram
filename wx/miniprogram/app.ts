import { wxlogin } from "./utils/wx";

// app.ts
App<IAppOption>({
  globalData: {
    apiUrl: `https://time.net.librejo.cn/api`,
    imgUrl: `https://time.net.librejo.cn`,
  },
  onShow(){
    wxlogin(this);
  }
})