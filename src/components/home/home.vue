<style>
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  @keyframes ani-demo-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .demo-spin-col {
    height: 100px;
    position: relative;
    border: 1px solid #eee;
  }
</style>
<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">系统首页</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        待处理事务
      </p>
      <Row style="min-height: 105px;">
        <Spin fix v-if="loading">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>Loading</div>
        </Spin>
        <Col span="8" style="height: 35px;padding: 0 20px" v-for="(item,index) in statusList" :key="index">
          <a @click="order(item.Id)">{{item.Name}}</a> ({{orderNum["num"+String(index+1)]}})
        </Col>
      </Row>

    </Card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: true,
        statusList: [],
        orderNum: {}
      }
    },
    methods: {
      //获取状态
      getStatus() {
        const _this = this;
        _this.Axios.get('/GetStateStr.ashx').then(res => {
          _this.statusList = res.data.data;
        })
      },

      //根据ID 跳转到订单页面
      order(Id) {
        this.menu1 = '3';
        let menuList = JSON.parse(localStorage.getItem('menuList'));

        // this.$emit('operateMuen', '3', '3-1-1');
        // this.$router.push({
        //   name: '客服模式',
        //   params: {
        //     id: Id
        //   }
        // });


        for(let i =0;i<menuList.length;i++){
          if(menuList[i].numb==='3'){
            this.$emit('operateMuen', '3', menuList[i].children[0].children[0].numb);
            this.$router.push({
              name: menuList[i].children[0].children[0].name,
              params: {
                id: Id
              }
            });
            return
          }
        }
      },

      //获取状态数量
      getOrderNum() {
        const _this = this;
        _this.Axios.get('/GetOrderNum.ashx').then(res => {
          _this.orderNum = res.data;
          setTimeout(()=>{
            _this.loading = false;
          },100)
        });
      },
    },
    mounted() {
      this.getStatus();
      this.getOrderNum()

    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .shiwu {
    float: left;
    margin-right: 4px;
    margin-top: 2px;
    width: 16px
  }
</style>
