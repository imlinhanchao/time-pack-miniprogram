type IDataType = {  }
type TComponent = WechatMiniprogram.Component.Options<{}, {}, {}, { 
  properties: {
    item: ICapsule 
  }
}>
Component<{}, {}, {}, {
  properties: {
    item: ICapsule,
    now: number
  }
}>({
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