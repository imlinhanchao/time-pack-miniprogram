import { create } from "../../api/capsule"

// pages/create/create.ts
Component({
  data: {
    
  },
  methods: {
    save({ detail }: WechatMiniprogram.CustomEvent<ICapsule>) {
      create(detail).then(_ => {
        console.log(_);
        wx.showToast({
          title: '创建成功',
          icon: 'none'
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      }).catch(err => {
        wx.showToast({
          title: err.message,
          icon: 'none'
        })
      });
    }
  },
})