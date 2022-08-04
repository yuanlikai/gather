<template>
  <div class="app-container">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">电商平台导单</div>
    </Card>
    <div style="min-height: 32px;">
      <transition name="fade">
        <div v-show="orderNumList.num1">
          <RadioGroup v-model="formValidate.state" @on-change="stateChange" :style="{margin: '0 20px 0 20px', background: '#fff',height:'auto'}"
                      type="button">
            <Radio style="padding:0 20px" label="-1">全部 ({{orderNumList.num1}})</Radio>
            <Radio style="padding:0 20px" label="0">待导入 ({{orderNumList.num2}})</Radio>
            <Radio style="padding:0 20px" label="1">已导入 ({{orderNumList.num3}})</Radio>
            <Radio style="padding:0 20px" label="2">导入异常 ({{orderNumList.num4}})</Radio>
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
            <FormItem label="来源平台：" prop="platformid">
              <Select v-model="formValidate.platformid"
                      clearable>
                <Option value="-1">全部</Option>
                <Option v-for="(item,index) in terraceList" :value="item.id" :key="index">{{ item.platformName }}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="供应商：" prop="supplierid">
              <Select v-model="formValidate.supplierid"
                      clearable
                      filterable>
                <!--<Option value="-1">全部</Option>-->
                <Option v-for="(item,index) in supplierList" :value="item.id" :key="index">{{ item.supplierName }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="订单编号：" prop="ordernumber">
              <Input v-model="formValidate.ordernumber" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="下单时间：" prop="begTime">
              <DatePicker v-model="formValidate.time" :editable="false" @on-change="getTime" type="daterange" format="yyyy-MM-dd" placeholder="请选择" style="width: 100%"></DatePicker>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem v-model="formValidate.time1" label="发货时间：" prop="GetTime">
              <DatePicker :editable="false" @on-change="getTime1" type="daterange" format="yyyy-MM-dd" placeholder="请选择" style="width: 100%"></DatePicker>

            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="结算金额：" prop="price1">
              <div class="price-inp">
                <Input v-model="formValidate.price1"
                       @on-keyup="formValidate.price1=formValidate.price1.replace(/[^\d]/g,'');"
                       placeholder="请输入"/>
                <span>-</span>
                <Input v-model="formValidate.price2"
                       @on-keyup="formValidate.price2=formValidate.price2.replace(/[^\d]/g,'');"
                       placeholder="请输入"/>
              </div>
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
  
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        筛选查询
      </p>
      <p slot="extra">
  
        <Poptip
          confirm
          placement="left"
          title="是否确认导入ERP?"
          @on-ok="importC">
          <Button v-if="formValidate.state==='0'" type="text" icon="ios-cloud-upload">导入ERP ({{selectList.length}}条)</Button>
        </Poptip>
      </p>
      <Table @on-sort-change="sortChange" @on-selection-change="selectChange" @on-select-cancel="selectCancel" @on-select-all-cancel="allCancel" :columns="columns1" :loading="loading" :data="dataList"></Table>
      <div style="width: 100%;text-align: center;margin-top: 15px">
        <Page @on-change="paging" :total="Number(total)" :page-size="10" show-elevator show-total/>
      </div>
    </Card>
    <Modal v-model="importAlert" width="460" :closable="false" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>导入ERP</span>
      </p>
      <div class="percent">
        <i-circle :percent="parseInt(((importOrder.num1+importOrder.num3)/selectList.length)*100)">
          <span class="demo-Circle-inner" style="font-size:24px">{{parseInt(((importOrder.num1+importOrder.num3)/selectList.length)*100)}}%</span>
        </i-circle>
        <div class="percent-ul">
          <p style="font-weight: 700;">应导入：{{selectList.length}}单</p>
          <p>已导入：{{importOrder.num1}}单</p>
          <p>待导入：{{selectList.length - importOrder.num1 - importOrder.num3}}单</p>
          <p>导入异常：<span style="color:#ed4014;font-weight: 700;">{{importOrder.num3}}</span>单</p>
        </div>
        
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :disabled="importOrder.num1+importOrder.num3!=selectList.length" @click="importAlert=false;selectList=[];reset();GetOrderNum()">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        importOrder:{
          num1:0,
          num3:0
        },
        importAlert:false,
        selectList:[],
        orderNumList:{},
        total:0,
        loading:false,
        dataList:[],
        formValidate: {
          state:'0',
          page:1,
          pagesize:10,
          sortid:'',
          platformid:'',
          supplierid:'',
          ordernumber:'',
          begintime:'',
          endtime:'',
          begintime2:'',
          endtime2:'',
          price1:'',
          price2:''
        },
        terraceList:[],
        supplierList:[],
        columns1: [
          {
            type: 'selection',
            width: 60,
            _disabled: true,
            align: 'center'
          },
          {
            title: '平台订单号',
            align: 'center',
            key: 'OrderNumber'
          },
          {
            title: 'ERT订单号',
            align: 'center',
            key: 'ErpOrderNumber'
          },
          {
            title: '结算金额',
            align: 'center',
            width:'100px',
            key: 'Total'
          },
          {
            title: '下单日期',
            align: 'center',
            key: 'AddTime',
            sortable: 'custom'
          },
          {
            title: '发货日期',
            align: 'center',
            key: 'SendTime',
            sortable: 'custom'
          },
          {
            title: '导入日期',
            align: 'center',
            key: 'ImportTime',
            sortable: 'custom'
          },
          {
            title: '操作人',
            align: 'center',
            width:'100px',
            key: 'Importer'
          },
          {
            title: '来源平台',
            align: 'center',
            key: 'PlatformStr'
          },
          {
            title: '供应商',
            align: 'center',
            key: 'Supplier'
          },
          {
            title: '单据状态',
            align: 'center',
            key: 'ImportStr',
            width:'100px',
            render: (h, params) => {
              let color = '#515a6e';
              if (params.row.ImportStr === '已导入') {
                color = '#19be6b'
              } else if (params.row.ImportStr === '已导入') {
                color = '#ed4014'
              }
              return h('div', [
                h('p', {
                  style: {
                    color: color
                  }
                }, params.row.ImportStr)
              ])
            }
          },
          {
            title: '操作',
            width: 88,
            align:'center',
            render:(h,params)=>{
              return h('div',[
                h('router-link',{
                  attrs:{
                    target:'_blank'
                  },
                  props:{
                    to:{
                      path:'/orderDetails',
                      query:{
                        idstr:params.row.ID,
                        vid:1
                      }
                    }
                  }
                },'订单详情')
              ])
            }
          }
        ],
      }
    },
    methods: {
  
      //导入ERP弹窗
      importC(){
        if(this.selectList.length<1){
          this.$Message.error('请选择要导入订单')
        }else {
          this.importAlert = true;
          this.importOrder.num1 = 0;
          this.importOrder.num3 = 0;
          for(let i = 0;i<this.selectList.length;i++){
            setTimeout(()=>{
              this.ImportToErp(this.selectList[i])
            },i*100)
          }
        }
      },

      //导入ERP
      ImportToErp(id){
        const _this = this;
        _this.Axios.post('/Upload/SupplierAdmin/ScOrder/ImportToErp.ashx',{
          id:id,
          username:localStorage.getItem('user'),
        }).then(res => {
          if(res.data.error===0){
            this.importOrder.num1 = this.importOrder.num1+1
          }else {
            this.importOrder.num3 = this.importOrder.num3+1
          }
        })
      },
      
      //切换状态
      stateChange(i){
        if(i!=='0'&&this.columns1[0].type==='selection'){
          this.columns1.splice(0,1);
          this.selectList = []
        }else if(i==='0'&&this.columns1[0].type!=='selection') {
          this.columns1.splice(0,0,{
            type: 'selection',
            width: 60,
            _disabled: true,
            align: 'center'
          })
        }
        this.reset()
      },
      
      //全选取消
      allCancel(){
        const _this = this;
        let selectList = _this.selectList;
        for(let i = 0;i<_this.dataList.length;i++){
          if(selectList.indexOf(_this.dataList[i].ID)!==-1){
            selectList.splice(selectList.indexOf(_this.dataList[i].ID),1)
          }
        }
        _this.selectList = selectList
      },
      //取消勾选数据
      selectCancel(selection,row){
        this.selectList.splice(this.selectList.indexOf(row.ID),1)
      },
      
      //过滤已勾选数据
      selectChange(select) {
        let arr = this.selectList;
        for (let i = 0; i < select.length; i++) {
          if(this.selectList.indexOf(select[i].ID)===-1){
            arr.push(select[i].ID)
          }
        }
        this.selectList = arr;
      },
      
      //查询订单
      handleSubmit(name) {
        console.log(this.formValidate)
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.reset()
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      
      //获取列表
      getList(){
        const _this = this;
        _this.loading = true;
        _this.Axios.post('/Upload/SupplierAdmin/ScOrder/GetOrderList.ashx',_this.formValidate).then(res => {
          console.log(res.data.data);
          _this.dataList = res.data.data;
          _this.total = res.data.total;
          _this.loading = false;
          for(let i = 0;i<_this.dataList.length;i++){
            if(_this.selectList.indexOf(_this.dataList[i].ID)!==-1){
              _this.$set(_this.dataList[i],"_checked",true)
            }
          }
        })
      },
      
      //重置搜索条件
      handleReset(name) {
        this.$refs[name].resetFields();
        this.formValidate.time = [];
        this.formValidate.time1 = [];
        this.formValidate.price2 = '';
        this.reset()
      },
      
      //获取平台
      getTerrace() {
        const _this = this;
        _this.Axios.get('/Manage/Platform/list').then(res => {
          _this.terraceList = res.data.data
        })
      },
      
      //获取供应商
      getSupplier() {
        const _this = this;
        _this.Axios.get('/Manage/Supplier/selectList').then(res => {
          _this.supplierList = res.data.data
        })
      },
  
      //获取订单状态数量接口
      GetOrderNum() {
        const _this = this;
        _this.Axios.get('/Upload/SupplierAdmin/ScOrder/GetOrderNum.ashx').then(res => {
          _this.orderNumList = res.data
        })
      },
      
      reset(){
        this.formValidate.page = 1;
        this.total = 0;
        this.getList();
      },
      
      sortChange(i){
        this.formValidate.sortid = '';
        if(i.key==="AddTime"&&i.order==="asc"){
          this.formValidate.sortid = '1'
        } else if(i.key==="AddTime"&&i.order==="desc"){
          this.formValidate.sortid = '2'
        } else if(i.key==="SendTime"&&i.order==="asc"){
          this.formValidate.sortid = '3'
        } else if(i.key==="SendTime"&&i.order==="desc"){
          this.formValidate.sortid = '4'
        } else if(i.key==="ImportTime"&&i.order==="asc"){
          this.formValidate.sortid = '5'
        } else if(i.key==="ImportTime"&&i.order==="desc"){
          this.formValidate.sortid = '6'
        }
        this.reset()
      },
  
      // 分页
      paging(i) {
        this.formValidate.page = i;
        this.getList();
      },
  
      getTime(i) {
        console.log(i)
        this.formValidate.begintime = i[0];// – 下单开始时间
        this.formValidate.endtime = i[1];// – 下单结束时间
      },
  
      getTime1(i) {
        console.log(i)
        this.formValidate.begintime2 = i[0];// – 发货时间开始时间
        this.formValidate.endtime2 = i[1];// – 发货时间结束时间
      },
    },
    mounted() {
      this.GetOrderNum()
      this.getList();
      this.getTerrace();
      this.getSupplier()
    
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .price-inp{
    display: flex;
  }
  .percent{
    display: flex;
    justify-content: space-around;
  }

  .price-inp > span {
    margin: 0 10px;
  }
  .percent{
    display: flex;
  }
  .percent-ul{
    display: flex;
    flex-direction: column;
    height: 120px;
    justify-content: space-between;
    font-size: 14px;
  }
  
</style>
