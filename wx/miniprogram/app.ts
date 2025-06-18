import { wxlogin } from "./utils/wx";

// app.ts
App<IAppOption>({
  globalData: {
    apiUrl: `https://time-pack.com/api`,
    imgUrl: `https://time-pack.com`,
  },
  onShow(){
    wxlogin(this);
  }
})