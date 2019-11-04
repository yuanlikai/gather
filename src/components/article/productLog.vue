<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">商品日志</div>
    </Card>
    <Card :style="{margin: '0 20px 20px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        基础列表
      </p>
      <p slot="extra">
        <Icon type="ios-loop-strong"></Icon>
        <!--<span article="users" style="margin: 3px 4px 0 0">操作日期:</span>-->
        <!--<span style="margin: 3px 4px 0 0">操作人员:</span>-->
        <!--<Select v-model="username" @on-change="start=0;getLog()" style="width:120px;margin-right: 16px">-->
          <!--<Option value="全部">全部</Option>-->
          <!--<Option v-for="item in userList" :value="item.username" :key="item.username">{{item.username}}</Option>-->
        <!--</Select>-->
      </p>


      <Table :loading="loading" :show-header="true" :columns="columns" :data="data"></Table>
      <div style="width: 100%;height: 2px;background: #ffffff;margin-top: -1px;z-index: 3;position: relative"></div>
      <div style="width: 100%;text-align: center;margin-top: 15px">
        <Page @on-change="paging" :total="total" :page-size="9" show-elevator show-total/>
      </div>
    </Card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        userList: [],
        loading: true,
        username: '全部',
        total: 0,
        start: 0,
        columns: [
          {
            type: 'index',
            key: 'username',
            width: '60',
            align: "center",
          },
          {
            title: '销售价格',
            key: 'location',
            render: (h, params) => {
              return h('div', [
                h('div', `原：${params.row.marketPriceB?params.row.marketPriceB:'无'}`),
                h('div', `现：${params.row.marketPriceN}`)
              ])
            }
          },
          {
            title: '促销价格',
            key: 'timeCreated',
            render: (h, params) => {
              return h('div', [
                h('div', `原：${params.row.priceB?params.row.priceB:'无'}`),
                h('div', `现：${params.row.priceN}`)
              ])
            }
          },
          {
            title: '上下架',
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                h('div', `原：${params.row.onSaleB===false?'下架':'上架'}`),
                h('div', `现：${params.row.onSaleN===false?'下架':'上架'}`)
              ])
            }
          },
          {
            title: '审核状态',
            key: 'ip',
            render: (h, params) => {
              console.log(params.row.approvalStatusB)
              // console.log(params.row.approvalStatusN)
              return h('div', [
                h('div', `原：${params.row.approvalStatusB?params.row.approvalStatusB.name:'无'}`),
                h('div', `现：${params.row.approvalStatusN?params.row.approvalStatusN.name:'无'}`)
              ])
            }
          },
          {
            title: '操作信息',
            key: 'ip',
            render: (h, params) => {
              return h('div', [
                h('div', `${params.row.operatorName}`),
                h('div', this.riqi(params.row.operationTime))
              ])
            }
          },
        ],
        data: [],
      }
    },
    methods: {
      //获取日志列表
      getLog() {
        const _this = this;
        _this.loading = true;
        _this.Axios.get('/Manage/ProductLog/pageList', {
          params: {
            skuInfoId: this.$route.query.id
          }
        }).then(res => {
          _this.data = res.data.data.content;
          _this.total = Number(res.data.data.totalElements)
          _this.loading = false;
        })
      },

      //分页
      // 用户分页
      paging(i) {
        this.start = i - 1;
        this.getLog();
      },

      //管理员下拉列表
      userInfo() {
        const _this = this;
        _this.Axios.get('/Manage/UserInfo/list').then(res => {
          this.userList = res.data.data
        })
      }
    },
    mounted() {
      this.getLog();
      this.userInfo();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
