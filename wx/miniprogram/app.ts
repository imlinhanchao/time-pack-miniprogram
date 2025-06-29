import { wxlogin } from "./utils/wx";

const domain = `time.net.librejo.cn`

// app.ts
App<IAppOption>({
  globalData: {
    apiUrl: `https://${domain}/api`,
    imgUrl: `https://${domain}`,
  },
  onShow(){
    wxlogin(this);
  }
})