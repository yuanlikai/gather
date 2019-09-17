
<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">订单列表</div>
    </Card>
    <RadioGroup :style="{margin: '0 0 0 20px', background: '#fff',height:'auto'}" size="large" type="button"
                v-model="formValidate.state" @on-change="start=1,getOrder()">
      <Radio style="padding:0 20px" v-for="(item,index) in statusList" :key="index" :label="item.Id">
        {{ item.Name }}
      </Radio>
    </RadioGroup>
    <RadioGroup :style="{margin: '0 20px 0 20px', background: '#fff',height:'auto'}" size="large" type="button"
                v-model="formValidate.state">
      <Radio style="padding:0 20px" label="异常订单">异常订单</Radio>
      <Radio style="padding:0 20px" label="超时发货">超时发货</Radio>
    </RadioGroup>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        筛选查询
      </p>
      <Form ref="formValidate" :model="formValidate" :label-width="80">
        <Row :gutter="30">
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="供应商：" prop="supplierid">
              <Select :disabled="supplier.userType==='SUPPLIER'"
                      v-model="supplier.userType==='SUPPLIER'?Number(supplier.supplierId):formValidate.supplierid"
                      @on-change="start=1,getOrder()">
                <Option value="-1">全部</Option>
                <Option v-for="(item,index) in supplierList" :value="item.ID" :key="index">{{ item.Name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="订单编号：" prop="ordernumber">
              <Input v-model="formValidate.ordernumber" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="商品名称：" prop="proname">
              <Input v-model="formValidate.proname" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="产品货号：" prop="stockno">
              <Input v-model="formValidate.stockno" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="收货人：" prop="consignee">
              <Input v-model="formValidate.consignee" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="手机号：" prop="phone">
              <Input v-model="formValidate.phone" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="成交时间：" prop="time">
              <DatePicker @on-change="start=1,getOrder()" style="width: 100%" v-model="formValidate.time"
                          format="yyyy/MM/dd" type="daterange"
                          placement="bottom-end" placeholder="请选择" :editable="false"></DatePicker>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="订单金额：" prop="price1">
              <div style="width: 280px">
                <Input v-model="formValidate.price1"
                       @on-keyup="formValidate.price1=formValidate.price1.replace(/[^\d]/g,'');" style="width: 100px"
                       placeholder="请输入"/>
                -
                <Input v-model="formValidate.price2"
                       @on-keyup="formValidate.price2=formValidate.price2.replace(/[^\d]/g,'');" style="width: 100px"
                       placeholder="请输入"/>
              </div>
            </FormItem>
          </Col>
          <Col :xs="24" :md="24" :lg="8" style="text-align: right">
            <FormItem>
              <Button type="primary" style="margin-right: 6px" @click="handleSubmit('formValidate')">查询</Button>
              <Button style="margin-right: 6px" @click="handleReset('formValidate')">重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :style="{margin: '0 20px 20px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        数据列表
      </p>
      <p slot="extra">
        <ButtonGroup>
          <Button type="dashed" v-show="formValidate.state==='1'">批量发货</Button>
          <Button type="dashed">批量导出订单</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button type="dashed">下载模板</Button>
        </ButtonGroup>
      </p>
      <Table :loading="loading1" :show-header="true" :columns="columns" :data="data"></Table>
      <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      <div style="width: 100%;text-align: center;margin-top: 15px">
        <Page @on-change="paging" :total="total" :page-size="10" show-elevator show-total/>
      </div>
    </Card>
    <Modal v-model="modal1" width="360">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>请填写发货信息</span>
      </p>
      <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="80">
        <FormItem label="快递公司" prop="Express">
          <Input v-model="formValidate1.Express" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="快递单号" prop="ExpressNo">
          <Input v-model="formValidate1.ExpressNo" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="备注" prop="Description">
          <Input type="textarea" v-model="formValidate1.Description" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="success" size="large" long @click="shipments('formValidate1')">发货</Button>
      </div>
    </Modal>
    <Modal v-model="modal2" width="660">
      <p slot="header">
        <Icon type="ios-information-circle"></Icon>
        <span>确认申请订单《{{OrderNumber}}》的退单？</span>
      </p>
      <Table style="margin-bottom: 16px;" :show-header="true" :columns="columns1" :data="OperBtn"
             @on-selection-change="operChange"></Table>
      <Row>
        <Col span="24">
          退运费：
          <InputNumber size="small" :max="ReOrder.freight" :min="0" v-model="ReOrder.freight"
                       :formatter="value => `¥${value}`"
                       :parser="value => value.replace('¥', '')"></InputNumber>
          <p style="float: right;">合计退款：<span
            style="color: red;font-weight: 700;font-size: 18px;">¥{{ReOrder.total}}</span>
          </p>
        </Col>
      </Row>
      <Row style="margin-top: 16px;">
        <Col span="24">
          <Form :label-width="48">
            <FormItem label="备注：">
              <Input v-model="ReOrder.remarks" type="textarea" :rows="2" placeholder="请输入退单备注..."/>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="error" size="large" long @click="applyReOrder">申请退单</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    props: ['supplier'],
    data() {
      return {
        total: 0,
        modal2: false,
        loading1: false,
        modal1: false,
        OrderNumber: '',
        ReOrder: {
          dstr: '',  //原单Id
          total: 0,  //退款金额
          remarks: '',  //备注
          freight: 0,  //运费
          prolist: [],
        },
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '商品名称',
            tooltip: true,
            key: 'ProductName',
            minWidth: 120,
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
          {
            title: '退货数量',
            minWidth: 88,
            align: "center",
            key: 'asdadasda',
            render: (h, params) => {
              const _this = this;
              _this.OperBtn[params.index].number = Number(params.row.Num);
              return h('div', [
                h('InputNumber', {
                  props: {
                    value: Number(params.row.Num),
                    size: 'small',
                    min: 1,
                    max: Number(params.row.Num)
                  },
                  style: {
                    width: '60px'
                  },
                  on: {
                    'on-change': (e) => {
                      const _this = this;
                      _this.OperBtn[params.index].number = Number(e);
                      for (let i in _this.ReOrder.prolist) {
                        if (_this.ReOrder.prolist[i].id === params.row.ID) {
                          _this.ReOrder.prolist[i].num = Number(e)
                        }
                      }
                      this.totalPrices();
                    }
                  }
                })
              ])
            }
          },
        ],
        OperBtn: [],
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: 'OMS单号',
            tooltip: true,
            key: 'ErpOrderNumber',
            minWidth: 100,
            align: "center",
          },
          {
            title: '订单编号',
            key: 'OrderNumber',
            minWidth: 100,
            tooltip: true,
            align: "center",
          },
          {
            title: '下单时间',
            key: 'AddTime',
            minWidth: 110,
            tooltip: true,
            align: "center",
            sortable: true
          },
          {
            title: '来源平台',
            key: 'PlatformStr',
            minWidth: 88,
            maxWidth: 120,
            tooltip: true,
            align: "center",
          },
          // {
          //   title: '用户名',
          //   key: 'UserName',
          //   minWidth: 88,
          //   maxWidth: 120,
          //   tooltip: true,
          //   align: "center",
          // },
          {
            title: '订单状态',
            key: 'StateStr',
            maxWidth: 120,
            minWidth: 88,
            tooltip: true,
            align: "center",
          },
          {
            title: '订单金额',
            key: 'Total',
            minWidth: 110,
            maxWidth: 120,
            tooltip: true,
            align: "center",
            sortable: true
          },
          {
            title: '供应商',
            key: 'Supplier',
            minWidth: 88,
            maxWidth: 120,
            tooltip: true,
            align: "center",
          },
          {
            title: '收货人',
            key: 'Consignee',
            minWidth: 88,
            maxWidth: 120,
            tooltip: true,
            align: "center",
          },
          {
            title: '手机号',
            key: 'Phone',
            tooltip: true,
            minWidth: 88,
            maxWidth: 120,
            align: "center",
          },
          {
            title: '操作',
            align: 'center',
            width: 120,
            render: (h, params) => {
              let a;
              if (params.row.State === 1) {
                a = h('a', {
                  style: {
                    height: '12px',
                    marginRight: '5px',
                    paddingRight: '5px',
                    borderRight: '1px solid #e8eaec',
                  },
                  on: {
                    click: () => {
                      const _this = this;
                      _this.modal1 = true;
                      _this.formValidate1 = {
                        idstr: '',
                        statusid: '',
                        Express: '',
                        ExpressNo: '',
                        Description: '',
                      };
                      _this.formValidate1.idstr = params.row.ID;
                      _this.formValidate1.statusid = params.row.State
                    }
                  }
                }, '发货');
              } else if (params.row.State === 0) {
                a = h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '确定审核该订单？',
                  },
                  on: {
                    'on-ok': () => {
                      const _this = this;
                      console.log(params.row.id)
                      _this.Axios.post('/Manage/Order/updateOrder', _this.Qs.stringify({
                        idstr: params.row.ID,
                        statusid: 1,
                        Express: '',
                        ExpressNo: '',
                        Description: '',
                      })).then(res => {
                        if (res.data.error === 0) {
                          _this.$Message.success('审核成功');
                          _this.getOrder();
                          _this.modal1 = false;
                        } else {
                          _this.$Message.error(res.data.errorMsg);
                        }
                      })
                    }
                  }
                }, [
                  h('a', {
                    style: {
                      height: '12px',
                      marginRight: '5px',
                      paddingRight: '5px',
                      borderRight: '1px solid #e8eaec',
                    }
                  }, '审核')
                ]);
              } else if (params.row.State === 2) {
                a = h('a', {
                  style: {
                    height: '12px',
                    marginRight: '5px',
                    paddingRight: '5px',
                    borderRight: '1px solid #e8eaec',
                  },
                  on: {
                    click: () => {
                      const _this = this;
                      _this.modal2 = true;
                      _this.ReOrder.total = 0;
                      _this.ReOrder.idstr = params.row.ID;
                      _this.OrderNumber = params.row.OrderNumber;
                      _this.getDetails(params.row.ID)
                    }
                  }
                }, '申请退单');
              } else if (params.row.State === 5) {
                a = h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '确定同意该退单申请？',
                  },
                  on: {
                    'on-ok': () => {
                      const _this = this;
                      _this.Axios.post('/Manage/Order/comfirmReOrder', _this.Qs.stringify({
                        idstr: params.row.ID
                      })).then(res => {
                        if (res.data.code === 0) {
                          _this.getOrder();
                          _this.$Message.success('退单成功！')
                        } else {
                          _this.$Message.error(res.data.errorMsg)
                        }
                      })
                    }
                  }
                }, [
                  h('a', {
                    style: {
                      height: '12px',
                      marginRight: '5px',
                      paddingRight: '5px',
                      borderRight: '1px solid #e8eaec',
                    }
                  }, '确认退单')
                ]);
              }
              return h('div', [
                a,
                h('a', {
                  on: {
                    click: () => {
                      let href = this.$router.resolve({
                        path: '/orderDetails',
                        query: {
                          idstr: params.row.ID,
                        }
                      });
                      window.open(href.href, '_blank')
                    }
                  }
                }, '详情')
              ])
            }
          }

        ],
        data: [],

        formValidate1: {
          idstr: '',
          statusid: '',
          Express: '',
          ExpressNo: '',
          Description: '',
        },
        ruleValidate1: {
          Express: [
            {required: true, message: '请填写快递公司', trigger: 'blur'}
          ],
          ExpressNo: [
            {required: true, message: '请填写快递单号', trigger: 'blur'}
          ],
        },
        formValidate: {
          state: this.$route.query.id?this.$route.query.id:'0',
          supplierid: '-1',
          ordernumber: '',
          proname: '',
          stockno: '',
          consignee: '',
          phone: '',
          time: ['', ''],
          price1: '',
          price2: '',
        },
        supplierList: [],
        statusList: [],
        start: 1
      }
    },
    methods: {

      //确认发货
      shipments(name) {
        const _this = this;
        _this.$refs[name].validate((valid) => {
          if (valid) {
            _this.Axios.post('/Manage/Order/updateOrder', _this.Qs.stringify({
              idstr: _this.formValidate1.idstr,
              statusid: 2,
              Express: _this.formValidate1.Express,
              ExpressNo: _this.formValidate1.ExpressNo,
              Description: _this.formValidate1.Description
            })).then(res => {
              if (res.data.error === 0) {
                _this.$Message.success('发货成功');
                _this.getOrder();
                _this.modal1 = false;
              } else {
                _this.$Message.error(res.data.errorMsg);
              }
            })
          } else {
            _this.$Message.error('请填写必填项!');
          }
        })
      },

      // 分页
      paging(i) {
        this.start = i;
        this.getOrder();
      },

      //获取订单列表
      getOrder() {
        const _this = this;
        _this.loading1 = true;
        _this.Axios.get('/Manage/Order/pageList', {
          params: {
            sortid:'',
            state: _this.formValidate.state,
            supplierid: _this.formValidate.supplierid,
            ordernumber: _this.formValidate.ordernumber,
            proname: _this.formValidate.proname,
            stockno: _this.formValidate.stockno,
            consignee: _this.formValidate.consignee,
            phone: _this.formValidate.phone,
            price1: _this.formValidate.price1,
            price2: _this.formValidate.price2,
            begintime: _this.formValidate.time[0],
            endtime: _this.formValidate.time[1],
            page: _this.start,
            pagesize: '10',
          }
        }).then(res => {
          if (res.data.error === 0) {
            _this.data = res.data.data;
            _this.total = res.data.total;
          } else {
            _this.data = [];
            _this.total = 0;
            _this.$Message.warning(res.data.errorMsg)
          }
          _this.loading1 = false;
        })
      },

      //获取详情
      getDetails(id) {
        const _this = this;
        _this.Axios.get('/Manage/Order/detail', {
          params: {
            idstr: id
          }
        }).then(res => {
          if (res.data.error === 0) {
            _this.OperBtn = res.data.data;
            _this.ReOrder.freight = res.data.Freight
          } else {
            _this.$Message.error(res.data.errorMsg)
          }
        })
      },

      //查询订单
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.start = 1;
            this.getOrder();
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
        this.formValidate.price2 = '';
        this.getOrder()
      },

      //申请退单
      applyReOrder() {
        const _this = this;
        _this.Axios.post('/Manage/Order/applyReOrder', _this.Qs.stringify({
          idstr: _this.ReOrder.idstr,  //原单Id
          total: _this.ReOrder.total,  //退款金额
          remarks: _this.ReOrder.remarks,  //备注
          freight: _this.ReOrder.freight,  //运费
          prolist: JSON.stringify(_this.ReOrder.prolist),
        })).then(res => {
          if (res.data.code === 0) {
            _this.$Message.success('已提交申请退单');
            _this.modal2 = false;
          } else {
            _this.$Message.warning(res.data.errorMsg)
          }
        })
      },

      //获取状态
      getStatus() {
        const _this = this;
        _this.Axios.get('/Manage/Order/getStateStr').then(res => {
          _this.statusList = res.data.data;
          for (let i = 0; i < _this.statusList.length; i++) {
            _this.Axios.get('/Manage/Order/getOrderNum', {
              params: {
                state: _this.statusList[i].Id
              }
            }).then(res => {
              _this.statusList[i].Name = _this.statusList[i].Name + '(' + res.data.num + ')'
            });
          }
        })
      },

      //获取供应商
      getSupplier() {
        const _this = this;
        _this.Axios.get('/Manage/Supplier/list').then(res => {
          _this.supplierList = res.data.data
        })
      },

      //选择申请退货产品
      operChange(i) {
        const _this = this;
        _this.ReOrder.prolist = [];
        i.forEach(function (item, index) {
          _this.ReOrder.prolist.push({
            id: String(item.ID),
            Price: item.Price,
            num: String(item.number)
          });
        });
        this.totalPrices();
      },

      //计算退款产品总价
      totalPrices() {
        const _this = this;
        _this.ReOrder.total = 0;
        let i = _this.ReOrder.prolist;
        i.forEach(function (item, index) {
          _this.ReOrder.total += item.Price * item.num
        });
      }
    },
    mounted() {
      this.getOrder();
      this.getSupplier();
      this.getStatus();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
