<style lang="less">
  .ivu-tree li ul {
    padding: 0 0 0 60px;
  }
</style>
<template>
  <div class="content">
    <Card style="border:none;margin-bottom: 16px;">
      <div class="ivu-page-header-title">订单详情页</div>
    </Card>
    <Content :style="{position:'relative',margin: '0 20px 20px 20px', background: '#fff',padding: '16px',height:'auto'}">
      <Spin fix v-if="loading"></Spin>
      <Row :gutter="30">
        <Col span="24">
          <p class="colClass" style="font-weight: 500;">基本信息</p>
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          ERP单号：{{data.ErpOrderNumber}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          平台单号：{{data.OrderNumber}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          平台：{{data.PlatformName}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          用户名：{{data.UserName}}
        </Col>
        <!--<Col class="colClass" :xs="24" :md="12" :lg="8">-->
        <!--供应商：-->
        <!--</Col>-->
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          下单时间：{{data.AddTime}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          支付方式：{{data.PayTypeStr}}
        </Col>
      </Row>
      <Divider/>
      <Row :gutter="30">
        <Col span="24">
          <p class="colClass" style="font-weight: 500;">收货人及物流信息</p>
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          收货人：{{data.Consignee}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          手机号：{{data.Phone}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          快递公司：{{data.Express}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          物流单号：{{data.ExpressNo}}
        </Col>
        <Col class="colClass" :md="24" :lg="16">
          地址：{{data.Address}}
        </Col>
      </Row>
      <Divider/>
      <Row :gutter="30">
        <Col span="24">
          <p class="colClass" style="font-weight: 500;">商品信息</p>
        </Col>
        <Col span="24">
          <Table :show-header="true" :columns="columns" :data="OperBtn"></Table>
        </Col>
      </Row>
      <Row :gutter="30" style="font-size: 14px;">
        <Col style="margin-top: 16px;" :xs="{ span: 9, offset: 1 }" :lg="{ span: 11, offset: 1 }">
          运费：{{data.Freight}}
        </Col>
        <Col style="margin-top: 16px;text-align: right" :xs="13" :lg="{ span: 11, pull: 0 }">
          合计：{{data.Total}} (不含运费)
        </Col>
      </Row>
    </Content>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: true,
        columns: [
          {
            title: '商品名称',
            tooltip: true,
            key: 'ProductName',
            minWidth: 88,
            align: "center",
          },
          {
            title: '货号',
            tooltip: true,
            key: 'StockNo',
            minWidth: 88,
            align: "center",
          },
          {
            title: '数量',
            tooltip: true,
            key: 'Num',
            minWidth: 88,
            align: "center",
          },
          {
            title: '单价',
            tooltip: true,
            key: 'Price',
            minWidth: 88,
            align: "center",
          },
          {
            title: '小计',
            tooltip: true,
            key: 'SumPrice',
            minWidth: 88,
            align: "center",
          },
        ],
        data: [],
        OperBtn: [],
      }
    },
    methods: {
      getDetails() {
        const _this = this;
        _this.Axios.get('/Manage/Order/detail', {
          params: {
            idstr: _this.$route.query.idstr,
          }
        }).then(res => {
          if (res.data.error === 0) {
            _this.OperBtn = res.data.data;
            _this.data = res.data;

          } else {
            _this.$Message.error(res.data.errorMsg)
          }
          _this.loading = false
        })
      }
    },
    mounted() {
      this.getDetails()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .colClass {
    font-size: 14px;
    color: #17233d;
    margin-bottom: 16px;
  }
</style>
