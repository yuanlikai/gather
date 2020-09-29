<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">当前订单状态：
        <span v-if="$route.query.abnormal=='true'" style="color: red;">异常</span>
        <span v-else style="color: red;">{{data.StateStr}}</span>
      </div>
      <ButtonGroup style="float: right;">
        <Button v-if="$route.query.abnormal!='true'" type="dashed" @click="model=true">转为异常订单</Button>
        <Button v-else type="dashed">取消异常订单</Button>
      </ButtonGroup>
    </Card>
    <Content
      :style="{position:'relative',margin: '0 20px 20px 20px', background: '#fff',padding: '16px',height:'auto'}">
      <Spin fix v-if="loading"></Spin>
      <Row :gutter="30">
        <Col span="24">
          <p class="colClass" style="font-weight: 500;">基本信息</p>
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          OMS单号：{{data.ErpOrderNumber}}
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
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          下单时间：{{data.AddTime}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          发货时间：{{data.GetTime}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          支付方式：{{data.PayTypeStr}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          供应商：{{data.Supplier}}
        </Col>
      </Row>
      <Divider/>
      <Row :gutter="30">
        <Col span="24">
          <p class="colClass" style="font-weight: 500;">收货人及物流信息</p>
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          快递公司：{{data.Express}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          收货人：{{data.Consignee}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8">
          手机号：{{data.Phone}}
        </Col>
        <Col class="colClass" :xs="24" :md="12" :lg="8" v-if="data.ExpressNo">
          物流单号：
          <a v-for="(item,index) in data.ExpressNo.split('，')" @click="getExpress(data.Express.split('，')[index],item)">{{item}}，</a>
        </Col>
        <Col class="colClass" :md="24" :lg="16">
          地址：{{data.Address}}
        </Col>.

      </Row>

      <Button @click="amend" type="primary" style="margin-left: 16px">{{data.ExpressNo?'修改':'填写'}}物流信息
      </Button>
      <Button @click="afterSsa" style="margin-left: 16px">修改配送信息
      </Button>
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
          <div v-if="$route.query.vid==='3'">
            合计：<span style="color: red;font-weight: 700;">{{data.CostTotal}}</span>
            (不含运费)
          </div>
          <div v-else-if="$route.query.vid==='2'">
            售价合计：<span style="color: red;font-weight: 700;">{{data.Total}}</span>
            (不含运费)
            <br>
            采购价合计：<span style="color: red;font-weight: 700;">{{data.CostTotal}}</span>
            (不含运费)
          </div>
          <div v-if="$route.query.vid==='1'">
            合计：<span style="color: red;font-weight: 700;">{{data.Total}}</span>
            (不含运费)
          </div>
        </Col>
      </Row>
      <Divider/>
      <Row :gutter="30">
        <Col span="24">
          <p class="colClass" style="font-weight: 500;">备注信息</p>
        </Col>
        <Col class="colClass" span="24">
          用户留言：{{data.Remarks}}
        </Col>
        <Col class="colClass" span="24">
          客服备注：{{data.RemarksHt}}
        </Col>
        <!--<Col class="colClass" span="24">-->
          <!--<Button type="primary">备注</Button>-->
        <!--</Col>-->
      </Row>
      <Divider/>
    </Content>
    <express ref="express" @getOrder="getDetails"></express>
    <getExpress ref="getExpress"></getExpress>
    <Modal v-model="model" width="360">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>确定转为异常？</span>
      </p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60">
        <FormItem label="备注" prop="abnormalstr">
          <Input type="textarea" v-model="formValidate.abnormalstr" placeholder="请输入备注信息"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
      </div>
    </Modal>

    <alterSite ref="alterSite" @getOrder="getDetails" :site="{
    consignee:data.Consignee,
    phone:data.Phone,
    address:data.address
    }"></alterSite>
  </div>
</template>
<script>
  import express from './express'
  import alterSite from './alterSite'
  import getExpress from './getExpress'

  export default {
    components: {
      express,
      alterSite,
      getExpress
    },
    data() {
      return {
        model: false,
        formValidate: {
          abnormalstr: '',
        },
        ruleValidate: {
          abnormalstr: [
            {required: true, message: '请填写异常备注', trigger: 'blur'}
          ],
        },
        loading: true,
        columns1: [
          {
            title: '操作者',
            tooltip: true,
            minWidth: 88,
            align: "center",
          },
          {
            title: '操作时间',
            tooltip: true,
            minWidth: 88,
            align: "center",
          },
          {
            title: '操作状态',
            tooltip: true,
            minWidth: 88,
            align: "center",
          },
          {
            title: '操作后状态',
            tooltip: true,
            minWidth: 88,
            align: "center",
          },
          {
            title: '备注',
            tooltip: true,
            minWidth: 88,
            align: "center",
          }
        ],
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
            title: '售价单价',
            tooltip: true,
            key: 'Price',
            minWidth: 88,
            align: "center",
          },
          {
            title: '采购单价',
            tooltip: true,
            key: 'CostPrice',
            minWidth: 88,
            align: "center",
          },
          {
            title: '供货单价',
            tooltip: true,
            key: 'CostPrice',
            minWidth: 88,
            align: "center",
          },
          {
            title: '售价小计',
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
      afterSsa() {
        const _this = this;
        _this.$refs.alterSite.model = true;
        this.$refs.alterSite.getSite({
          consignee: _this.data.Consignee,
          phone: _this.data.Phone,
          address: _this.data.Address,
        });
      },

      //异常弹窗
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.abnormal();
          }
        })
      },

      //点击获取快递信息
      getExpress(expressname,expressnumber){
        const _this = this;
        this.$refs.getExpress.getExpress(expressname,expressnumber,_this.data.OrderNumber);
      },

      //订单转为异常
      abnormal() {
        const _this = this;
        _this.Axios.post('/Manage/Order/operTransAbnormal', _this.Qs.stringify({
          orderid: _this.$route.query.idstr,
          abnormalstr: _this.formValidate.abnormalstr,  // 异常原因
        })).then(res => {
          if (res.data.error === 0) {
            _this.model = false;
            _this.$Message.success('转为异常成功')
          } else {
            _this.$Message.warning(res.data.errorMsg)
          }
        })
      },

      //修改物流信息
      amend() {
        const _this = this;
        _this.$refs.express.model = true;
        _this.$refs.express.formDynamic.idstr = _this.$route.query.idstr;
        for (let i = 0; i < _this.data.Express.split('，').length; i++) {
          _this.$refs.express.formDynamic.items[i] = {
            Express: _this.data.Express.split('，')[i],
            ExpressNo: _this.data.ExpressNo.split('，')[i]
          }
        }
      },

      //获取订单详情
      getDetails() {
        const _this = this;
        _this.Axios.get('/Manage/Order/detail', {
          params: {
            idstr: _this.$route.query.idstr,
            vid: _this.$route.query.vid,
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
      if(this.$route.query.vid==='3'){
        this.columns.splice(3,2);
        this.$set(this.columns[4],'title','供货价小计');
        this.$set(this.columns[4],'key','SumCostPrice');
        console.log(this.columns[4])
      }else if(this.$route.query.vid==='2'){
        this.columns.splice(5,1);
        this.columns.push({
          title: '采购价小计',
          tooltip: true,
          key: 'SumCostPrice',
          minWidth: 88,
          align: "center",
        })
      }else if(this.$route.query.vid==='1'){
        this.columns.splice(4,2);
      }
      this.getDetails();
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
