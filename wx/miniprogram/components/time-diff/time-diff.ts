import { ComponentWithComputed } from 'miniprogram-computed'

ComponentWithComputed({
  behaviors: [],
  properties: {
    start: {
      type: Number,
      value: 0,
    },
    end: {
      type: Number,
      value: 0,
    },
  },
  computed: {
    time(data) {
      const diff = Math.max(0, data.end - data.start);
      const year = Math.floor(diff / 31536000000);
      const day = Math.floor(diff % 31536000000 / 86400000);
      const hour = Math.floor(diff % 86400000 / 3600000);
      const minute = Math.floor(diff % 3600000 / 60000);
      const second = Math.floor(diff % 60000 / 1000);
      return `${year > 0 ? `${year}年`: ``
      }${day > 0 || year > 0 ? `${day}天`: ``
      }${hour > 0 || day > 0 || year > 0 ? `${hour}小时`: ``
      }${minute > 0 || hour > 0 || day > 0 || year > 0 ? `${minute}分`: ``
      }${second > 0 || minute > 0 || hour > 0 || day > 0 || year > 0 ? `${second}秒`: ``}`;
    },
  },
  data: {

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