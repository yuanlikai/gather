<style>
  .ivu-table .demo-table-info-row td {
    color: red
  }
  
  .card-warp .ivu-card-body {
    padding: 0;
  }
</style>
<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">客服模式</div>
    </Card>
    <div style="min-height: 32px;">
      <transition name="fade">
        <div v-show="orderNum.error===0">
          <RadioGroup :style="{marginLeft: '20px',}"
                      type="button"
                      v-model="formValidate.state" @on-change="types='',start=1;total=0;getOrder()">
            <Radio style="padding:0 20px" v-for="(item,index) in statusList" :key="index" :label="item.Id">
              {{ item.Name }} ({{orderNum['num'+String(index+1)]}})
            </Radio>
          </RadioGroup>
          <RadioGroup :style="{margin: '0 20px 0 20px', background: '#fff',height:'auto'}"
                      type="button"
                      v-model="formValidate.state" @on-change="types='yc',start=1,getOrder('yc')">
            <Radio style="padding:0 20px" label="9">异常订单 ({{orderNum['num9']}})</Radio>
            <Radio style="padding:0 20px" label="10">超时发货 ({{orderNum['num10']}})</Radio>
          </RadioGroup>
        </div>
      </transition>
    </div>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        筛选查询
      </p>
      <Form ref="formValidate" :model="formValidate" :label-width="80">
        <Row :gutter="30">
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="供应商：" prop="supplierid">
              <Select :disabled="supplier.userType==='SUPPLIER'"
                      v-model="supplier.userType==='SUPPLIER'?supplier.supplierId:formValidate.supplierid"
                      @on-change="start=1,total=0,getOrder()"
                      clearable
                      filterable>
                <!--<Option value="-1">全部</Option>-->
                <Option v-for="(item,index) in supplierList" :value="item.id" :key="index">{{ item.supplierName }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8" v-if="supplier.userType!=='SUPPLIER'">
            <FormItem label="来源平台：" prop="terraceId">
              <Select :disabled="supplier.userType==='SUPPLIER'"
                      v-model="formValidate.terraceId"
                      @on-change="start=1,total=0,getOrder()">
                <Option value="-1">全部</Option>
                <Option v-for="(item,index) in terraceList" :value="item.id" :key="index">{{ item.platformName }}
                </Option>
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
              <Input :maxlength="11" @on-keyup="formValidate.phone=formValidate.phone.replace(/[^\d]/g,'')"
                     v-model="formValidate.phone" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="下单时间：" prop="time">
              <DatePicker @on-change="getTime" style="width: 100%;cursor: pointer;"
                          v-model="formValidate.time"
                          format="yyyy/MM/dd" type="daterange"
                          placement="bottom-start" placeholder="请选择" :editable="false"></DatePicker>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="发货时间：" prop="time1">
              <DatePicker @on-change="getTime1" style="width: 100%;cursor: pointer;"
                          v-model="formValidate.time1"
                          format="yyyy/MM/dd" type="daterange"
                          placement="bottom-start" placeholder="请选择" :editable="false"></DatePicker>
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
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="券号：" prop="ticketnumber">
              <Input v-model="formValidate.ticketnumber" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="礼包编号：" prop="giftcode">
              <Input v-model="formValidate.giftcode" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem>
              <div style="width: 100%;text-align: right">
                <Button type="primary" style="margin-right: 6px" @click="handleSubmit('formValidate')">查询</Button>
                <Button style="margin-right: 6px" @click="handleReset('formValidate')">重置</Button>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card class="card-warp" :style="{margin: '0 20px 20px 20px', background: '#fff',height:'auto',padding:'0'}">
      <p slot="title">
        数据列表 <span style="font-weight: 400">【共 {{total}} 条】</span>
      </p>
      <p slot="extra">
        <transition name="fade">
          <span v-show="formValidate.state==='0'">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll">全选本页
            </Checkbox>
            <Poptip
              v-if="checkAllGroup.length>0"
              confirm
              title="是否确定批量审核订单？"
              @on-ok="batchReview">
              <Button type="text" icon="md-list-box" @click="">批量审核</Button>
            </Poptip>
            <Button v-else type="text" icon="md-list-box" @click="$Message.warning('请选择要审核的订单')">批量审核</Button>
          </span>
        </transition>
        <ButtonGroup v-if="formValidate.state>0">
          <Button type="text" icon="md-cloud-download" @click="dcdd">导出订单</Button>
        </ButtonGroup>
        <!--<span v-if="formValidate.state==='1'">-->
          <!--<Divider type="vertical"/>-->
          <!--<a style="float: right"-->
             <!--href="https://ylcgenterprise.oss-cn-shanghai.aliyuncs.com/moban1.xls" download="muban">-->
            <!--<Button type="text">下载发货模板</Button>-->
          <!--</a>-->
          <!--<Upload style="float: right"></Upload>-->
        <!--</span>-->
      </p>
      <Spin fix v-if="loading1"></Spin>
      <p v-if="data.length<1" style="text-align: center;width: 100%;padding:30px 0 30px 0">暂无数据</p>
      <CheckboxGroup v-else v-model="checkAllGroup" @on-change="checkAllGroupChange">
        <div v-for="(item,index) in data" :key="item.index">
          <Alert>{{item.PlatformStr}} - 【{{item.Supplier}}】 - {{item.ErpOrderNumber}} - 平台订单</Alert>
          <ul class="card-warp-ul">
            <li class="card-warp-li">{{item.AddTime}}</li>
            <li class="card-warp-li">订单编号：{{item.OrderNumber}}</li>
            <li class="card-warp-li">售价总金额：<span style="color: #ed4014;">{{item.Total}}元</span></li>
            <li class="card-warp-li">售后状态：无</li>
          </ul>
          <Row style="padding: 16px 16px 16px 50px;">
            <Col span="11">
              <Row class="row-wrap">
                <Checkbox v-show="formValidate.state==='0'" :label="item.ID" class="row-wrap-checkbox">&nbsp;</Checkbox>
                <div v-for="(itema,indexa) in item.ProList" :key="itema.index">
                  <Col span="24" v-if="item.open?true:indexa<3" style="margin-bottom: 16px">
                    <div v-if="itema.ProductImg" style="float: left;">
                      <Poptip placement="right">
                        <img style="float:left;width: 50px;cursor: pointer;"
                             :src="alterPicture(itema.ProductImg)"
                             alt="">
                        <div slot="content">
                          <img style="float:left;width: 250px"
                               :src="alterPicture(itema.ProductImg)"
                               alt="">
                        </div>
                      </Poptip>
                    </div>
                    <img v-else style="float:left;"
                         src="https://ylcgenterprise.oss-cn-shanghai.aliyuncs.com/618/wutu.png?x-oss-process=image/resize,m_pad,h_50,w_50,color_FFFFFF"
                         alt="">
                    <div style="float: left;width: calc(100% - 60px)">
                      <p>
                        <span style="color: #2db7f5;">{{itema.ProductName}} {{itema.StockNo}}</span>
                        <Icon type="md-close"/>
                        <span>{{itema.Num}}</span>
                      </p>
                      <p>
                        售价：
                        <span style="color: #ed4014;margin-right: 8px">{{itema.Price}}元</span>
                      </p>
                    </div>
                  </Col>
                </div>
                
                <div style="float: left;margin-left: 66px">共 <span style="color: #000000;font-weight: 700">{{item.ProList.length}}</span>
                  个产品
                  <span v-if="item.ProList.length>3">
                    <Button v-if="item.open" type="text" icon="ios-arrow-up" @click="openPro(index)">收起</Button>
                    <Button v-else type="text" icon="ios-arrow-down" @click="openPro(index)">展开</Button>
                  </span>
                </div>
              </Row>
            </Col>
            <Col span="5" class="card-warp-col3">
              <p>应付：<span style="color: #ed4014;">{{item.Total}}元</span></p>
              <p>积分：{{item.YlCoin}}</p>
              <p>运费：{{item.Freight}}</p>
            </Col>
            <Col span="5" class="card-warp-col3">
              <p style="color: #2db7f5;">发货时间：{{item.GetTime}}</p>
              <p>收货人：{{item.Consignee}}</p>
              <p>{{item.Phone}}</p>
              <p>{{item.Address.split(' ')[0]}}</p>
            </Col>
            <Col span="3" class="card-warp-col3">
              <p>{{item.StateStr}}</p>
              <p v-if="item.State===0">
                <Poptip
                  confirm
                  title="是否确定审核该订单？"
                  @on-ok="review(item.ID)">
                  <a>审核</a>
                </Poptip>
              </p>
              <p v-if="item.State===1&&formValidate.state != 9">
                <a @click="ship(item.ID)">发货</a>
              </p>
              <p v-if="item.State===2&&formValidate.state != 9">
                <a @click="chargeback(item.ID,item.OrderNumber)">申请退单</a>
              </p>
              <p v-if="item.State===5&&formValidate.state != 9">
                <Poptip
                  confirm
                  title="是否确认该退单申请？"
                  @on-ok="affirm(item.ID)">
                  <a>确认退单</a>
                </Poptip>
              </p>
              <p>
                <router-link target="_blank" :to="{path:'/orderDetails',query:{
                          idstr: item.ID,
                          abnormal: formValidate.state === 9 ? true : false,
                          vid:1,
            }}">订单详情
                </router-link>
              </p>
            </Col>
          </Row>
        </div>
      </CheckboxGroup>
      <div v-show="!data.length<1" class="Page-wrap">
        <Page @on-change="paging" placement="top" :total="total" @on-page-size-change="showSizer" :page-size="10"
              show-elevator show-total show-sizer/>
      </div>
    </Card>
    <express ref="express" @statusNum="statusNum" @getOrder="getOrder(formValidate.state>8?'yc':'')"></express>
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
    <BackTop :height="30" :bottom="30">
      <div class="ivu-back-top-inner">
        <i class="ivu-icon ivu-icon-ios-arrow-up"></i>
      </div>
    </BackTop>
    
    <Modal v-model="modal" width="460">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>导出订单</span>
      </p>
      <div style="max-height: 400px;overflow: auto">
        <div v-for="(item,index) in tagArr" :key="index" @click="download(index+1,index)" data-v-1af71c2b=""
             class="tag-dow ivu-tag ivu-tag-default ivu-tag-checked"><!---->
          <span class="ivu-tag-text">
          {{item.num1}}-{{item.num2}}条
            <Icon type="md-checkmark" v-if="item.download===true"/>
          </span>
        </div>
      
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="modal=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import express from './express'
  import Upload from './Upload'
  
  export default {
    components: {
      express,
      Upload
    },
    props: ['supplier'],
    data() {
      return {
        pageSize: 10,
        indeterminate: true,
        checkAll: false,
        checkAllGroup: [],
        total: 0,
        modal2: false,
        modal: false,
        tagArr: [],
        loading1: true,
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
                        if (_this.ReOrder.prolist[i].id == params.row.ID) {
                          _this.ReOrder.prolist[i].num = String(e)
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
        data: [],
        formValidate: {
          state: this.$route.params.id ? this.$route.params.id : '0',
          supplierid: '',
          ticketnumber: '',
          terraceId: '-1',
          ordernumber: '',
          proname: '',
          stockno: '',
          consignee: '',
          phone: '',
          giftcode: '',
          time: ['', ''],
          time1: ['', ''],
          price1: '',
          price2: '',
        },
        supplierList: [],
        statusList: [],
        start: 1,
        sortid: '',
        orderNum: {},
        types: '',
        terraceList: [],
      }
    },
    methods: {
      //切换每页条数回调
      showSizer(size) {
        this.pageSize = size;
        this.getOrder();
      },
      //展开更多产品
      openPro(index) {
        if (this.data[index].open) {
          this.$set(this.data[index], 'open', false);
        } else {
          this.$set(this.data[index], 'open', true);
        }
      },
      //确认退单
      affirm(id) {
        const _this = this;
        _this.Axios.post('/Manage/Order/comfirmReOrder', _this.Qs.stringify({
          idstr: id
        })).then(res => {
          if (res.data.code === 0) {
            _this.getOrder();
            _this.statusNum();
            _this.$Message.success('退单成功！')
          } else {
            _this.$Message.error(res.data.errorMsg)
          }
        })
      },
      //申请退单
      chargeback(id, num) {
        this.modal2 = true;
        this.ReOrder.total = 0;
        this.ReOrder.idstr = id;
        this.OrderNumber = num;
        this.getDetails(id)
      },
      //处理http图片打不开
      alterPicture(i) {
        console.log(i.replace(/http:/g, ''))
        if (i.indexOf('http:') === -1) {
          return i
        } else {
          return i.replace(/http:/, '')
        }
      },
      //发货
      ship(i) {
        this.$refs.express.model = true;
        this.$refs.express.formDynamic.idstr = i;
        this.$refs.express.formDynamic.Description = '';
        this.$refs.express.formDynamic.items = [
          {
            Express: '',
            ExpressNo: ''
          }
        ]
      },
      //批量审核
      batchReview() {
        if (this.checkAllGroup.length < 1) {
          this.$Message.warning('请选择要审核的订单')
        } else {
          this.review(this.checkAllGroup.join(','))
        }
      },
      //审核订单
      review(i) {
        this.Axios.post('/Manage/Order/batchAudit', this.Qs.stringify({
          idstr: i
        })).then(res => {
          if (res.data.error === 0) {
            this.$Message.success('审核成功');
            this.getOrder();
            this.statusNum();
          } else {
            this.$Message.error(res.data.errorMsg)
          }
        })
      },
      //订单时间金额升序降序
      sorts(i) {
        switch (i.order) {
          case 'asc':
            i.key === 'AddTime' ? this.sortid = '1' : this.sortid = '3';
            break;
          case 'desc':
            i.key === 'AddTime' ? this.sortid = '2' : this.sortid = '4';
            break;
          default:
            this.sortid = '';
            break
        }
        this.getOrder();
      },
      // 分页
      paging(i) {
        this.start = i;
        this.getOrder();
      },
      //获取订单列表
      getOrder(i) {
        const _this = this;
        _this.loading1 = true;
        _this.tagArr = [];
        _this.Axios.get(_this.types !== 'yc' ? '/Manage/Order/pageList' : '/Manage/Order/getYcOrderList', {
          params: {
            typeid: _this.types === 'yc' ? (_this.formValidate.state === '9' ? '1' : '2') : '',
            sortid: _this.sortid,
            vid: 1,
            ticketnumber: _this.formValidate.ticketnumber,
            state: _this.formValidate.state,
            supplierid: _this.formValidate.supplierid ? _this.formValidate.supplierid : '-1',
            platformid: _this.formValidate.terraceId,
            ordernumber: _this.formValidate.ordernumber,
            proname: _this.formValidate.proname,
            stockno: _this.formValidate.stockno,
            consignee: _this.formValidate.consignee,
            phone: _this.formValidate.phone,
            giftcode: _this.formValidate.giftcode,
            price1: _this.formValidate.price1,
            price2: _this.formValidate.price2,
            begintime: _this.formValidate.time[0],
            endtime: _this.formValidate.time[1],
            begintime2: _this.formValidate.time1[0],
            endtime2: _this.formValidate.time1[1],
            page: _this.start,
            pagesize: _this.pageSize,
          }
        }).then(res => {
          _this.getOrderNum();
          _this.indeterminate = false;
          _this.checkAll = false;
          _this.checkAllGroup = [];
          if (res.data.error === 0) {
            _this.data = res.data.data;
            _this.total = res.data.total;
          } else {
            _this.data = [];
            _this.total = 0;
          }
          _this.loading1 = false;
        })
      },
      //导出订单弹窗
      dcdd() {
        const _this = this;
        _this.modal = true;
        this.tagArr=[];
        let tagArr = parseInt(_this.total / 100);
        let num = 0;
        for (let i = 0; i < tagArr; i++) {
          _this.tagArr.push({
            num1: num + 1,
            num2: num + 100
          });
          num += 100
        }
        if (_this.total % 100 !== 0) {
          _this.tagArr.push({
            num1: num + 1,
            num2: num + _this.total % 100
          });
        }
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
            this.total = 0;
            this.getOrder();
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      //重置搜索条件
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
            _this.getOrder(_this.formValidate.state > 8 ? 'yc' : '');
            _this.statusNum();
            _this.modal2 = false;
          } else {
            _this.$Message.warning(res.data.errorMsg)
          }
        })
      },
      //获取状态
      getStatus() {
        const _this = this;
        _this.statusNum();
        _this.Axios.get('/Manage/Order/getStateStr').then(res => {
          _this.statusList = res.data.data;
        })
      },
      //获取状态数量
      statusNum() {
        const _this = this;
        _this.Axios.get('/Manage/Order/getOrderNum').then(resa => {
          _this.orderNum = resa.data
        });
      },
      //获取状态数量
      getOrderNum() {
        const _this = this;
      },
      //获取供应商
      getSupplier() {
        const _this = this;
        _this.Axios.get('/Manage/Supplier/selectList').then(res => {
          _this.supplierList = res.data.data
        })
      },
      //获取平台
      getTerrace() {
        const _this = this;
        _this.Axios.get('/Manage/Platform/list').then(res => {
          _this.terraceList = res.data.data
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
      },
      //导出订单
      download(page, index) {
        const _this = this;
        let typeid = _this.types === 'yc' ? (_this.formValidate.state === '9' ? '1' : '2') : '';
        let supplierid = _this.formValidate.supplierid ? _this.formValidate.supplierid : '-1';
        window.open('https://jhoms.e6best.com/SupplierAdmin/ExportOrderPage.ashx?typeid=' + typeid +
          '&sortid=' + _this.sortid +
          '&vid=' + 1 +
          '&state=' + _this.formValidate.state +
          '&supplierid=' + supplierid +
          '&platformid=' + _this.formValidate.terraceId +
          '&ordernumber=' + _this.formValidate.ordernumber +
          '&proname=' + _this.formValidate.proname +
          '&stockno=' + _this.formValidate.stockno +
          '&consignee=' + _this.formValidate.consignee +
          '&phone=' + _this.formValidate.phone +
          '&price1=' + _this.formValidate.price1 +
          '&price2=' + _this.formValidate.price2 +
          '&ticketnumber=' + _this.formValidate.ticketnumber +
          '&giftcode=' + _this.formValidate.giftcode +
          '&begintime=' + _this.formValidate.time[0] +
          '&endtime=' + _this.formValidate.time[1] +
          '&begintime2=' + _this.formValidate.time1[0] +
          '&endtime2=' + _this.formValidate.time1[1] +
          '&page=' + page +
          '&pagesize=' + 100
        );
        _this.$set(_this.tagArr[index], 'download', true);
      },
      getTime(i) {
        this.formValidate.time = [i[0], i[1]];
        this.start = 1;
        this.total = 0;
        this.getOrder()
      },
      getTime1(i) {
        this.formValidate.time1 = [i[0], i[1]];
        this.start = 1;
        this.total = 0;
        this.getOrder()
      },
      rowClassName(row, index) {
        return row.IsAbnormal === 1 ? 'demo-table-info-row' : ''
      },
      sup() {
        return this.supplier.userType === 'SUPPLIER' ? this.supplier.supplierId : this.formValidate.supplierid;
      },
      handleCheckAll() {
        if (this.indeterminate) {
          this.checkAll = false;
        } else {
          this.checkAll = !this.checkAll;
        }
        this.indeterminate = false;
        if (this.checkAll) {
          this.checkAllGroup = [];
          for (let i = 0; i < this.data.length; i++) {
            this.checkAllGroup.push(this.data[i].ID)
          }
        } else {
          this.checkAllGroup = [];
        }
      },
      checkAllGroupChange(data) {
        if (data.length === this.data.length) {
          this.indeterminate = false;
          this.checkAll = true;
        } else if (data.length > 0) {
          this.indeterminate = true;
          this.checkAll = false;
        } else {
          this.indeterminate = false;
          this.checkAll = false;
        }
      },
    },
    mounted() {
      this.getOrder();
      this.getSupplier();
      this.getTerrace();
      this.getStatus();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .Page-wrap {
    width: 100%;
    text-align: center;
    padding: 16px 0;
  }
  
  .row-wrap p {
    float: left;
    font-size: 12px;
    width: calc(100% - 55px);
    line-height: 24px;
    padding-left: 16px;
  }
  
  .row-wrap-checkbox {
    margin: auto;
    position: absolute;
    left: -30px;
    bottom: 0;
    top: 0;
    width: 16px;
    height: 32px;
  }
  
  .row-wrap {
    position: relative;
  }
  
  .card-warp-col3 {
    font-size: 12px;
  }
  
  .card-warp-col3 p {
    line-height: 24px;
  }
  
  .card-warp-li {
    flex-direction: column-reverse;
    margin-right: 16px;
  }
  
  .card-warp-ul {
    width: 100%;
    display: flex;
    border-bottom: 1px solid #dcdee2;
    font-size: 12px;
    line-height: 16px;
    padding: 8px 48px 8px 16px;
  }
  
  .ivu-alert {
    font-weight: 700;
    border: none;
    background: #e8eaec;
    margin-bottom: 0;
    -webkit-border-radius: 0px;
    -moz-border-radius: 0px;
    border-radius: 0px;
  }
  
  .ivu-table-wrapper {
    overflow: inherit;
  }
  
  .tag-dow {
    text-align: center;
  }
</style>
