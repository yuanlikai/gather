<template>
  <Modal v-model="model" width="360">
    <p slot="header" style="text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>【{{title}}】快递信息</span>
    </p>
    <div class="content-a">
      <Timeline style="margin-left: 20px">
        <TimelineItem v-for="(item,index) in data" :key="index">
          <p class="time">{{item.time}}</p>
          <p class="content">{{item.context}}</p>
        </TimelineItem>
      </Timeline>
    </div>
    <div slot="footer">
      <Button type="primary" @click="model=false">确认</Button>
    </div>
  </Modal>
</template>
<script>
  export default {
    data() {
      return {
        model: false,
        title: '',
        data: []
      }
    },
    methods: {
      //点击获取快递信息
      getExpress(expressname, expressnumber, OrderNumber) {
        const _this = this;
        _this.title = expressnumber;
        _this.Axios.post('http://idlv.e6best.com/getexpress.ashx', _this.Qs.stringify({
          ordernumber: OrderNumber,
          expressname: expressname,
          expressnumber: expressnumber,
        })).then(res => {
          if (res.data.error === 0) {
            _this.model = true;
            _this.data = res.data.data
          } else {
            _this.$Message.warning(res.data.errorMsg)
          }
        })

      },

    },
    mounted() {
    }
  }
</script>
<style scoped>
  .content-a {
    max-height: 400px;
    overflow: auto;
  }
</style>
