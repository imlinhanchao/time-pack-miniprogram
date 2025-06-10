import { ComponentWithComputed } from 'miniprogram-computed'
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
    userOpenId:app.globalData.userInfo?.openid
  },
  computed:{
    currentProcess(data){

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

  },
});