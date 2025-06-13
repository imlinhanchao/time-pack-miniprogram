import { ComponentWithComputed } from 'miniprogram-computed'
import { open } from "../../api/capsule"
const app = getApp<IAppOption>();
ComponentWithComputed({
  behaviors: [],
  properties: {
    item: {
      type: Object,
    },
    now: {
      type: Number,
    }
  },
  data: {
    userOpenId:app.globalData.userInfo?.openid,
    imgUrl:app.globalData.imgUrl,
  },
  computed:{
    currentProcess(data){
      if(data.now >= data.item.time_out){
        return 100
      }
      let total = data.item.time_out - data.item.create_time
      let pro = data.now - data.item.create_time
      return pro / total * 100
    },
    showStatusText(data){
      if(data.item.status==0){
        return "未被领取"
      }else{
        if(data.item.create_user != data.userOpenId){
          return "赠送"
        }else{
          return "已领取"
        }
      }
    }
  },
  lifetimes: {
    created() {

    },
    attached() {

    },
    moved() {

    },
    detached() {

    },
  },
  methods: {
    openPack(){
      if(this.data.item.status!=2){
        // 未开启
        if(this.data.now >= this.data.item.time_out){
          // 到时间了
          open(this.data.item.id).then(res=>{
            this.setData({
              item:res
            })
            this.goToDetail()
          }).catch(e=>{
            this.showToast(e.message || "打开出错了，待会再试试吧~")
          })
        }else{
          this.showToast("别急，还没到开启时间哟~")
        }
      }else{
        // 已开启 直接跳转
        this.goToDetail()
      }
    },
    goToDetail(){
      wx.navigateTo({
        url:'/pages/read/read?id='+this.data.item.id
      })
    },

    showToast(msg){
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    }
  },
});