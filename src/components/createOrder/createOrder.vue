<template>
  <div class="app-container">

    <Form ref="formValidate" :model="formValidate" :label-width="110">
      <Row :gutter="30" style="width: 1000px;margin:40px 0 0 40px">
        <Col span="12">
          <FormItem label="来源平台：" prop="platformid">
            <Select v-model="formValidate.platformid"
                    clearable>
              <Option v-for="(item,index) in terraceList" :value="item.id" :key="index">{{ item.platformName }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="用户名：" prop="UserName">
            <Input v-model="formValidate.UserName" placeholder="请输入"/>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="30" style="width: 1000px;margin:0 0 0 40px">
        <Col span="12">
          <FormItem label="联系人：" prop="Consignee">
            <Input v-model="formValidate.Consignee" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="电话：" prop="Phone">
            <Input v-model="formValidate.Phone" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="省市区：" prop="ssq">
            <Cascader @on-change="dzjhs" v-model="formValidate.ssq" :data="dataSite"></Cascader>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="地址：" prop="Address">
            <Input v-model="formValidate.Address" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="运费：" prop="Freight">
            <Input v-model="formValidate.Freight" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="平台订单ID：" prop="Ordernumber">
            <Input v-model="formValidate.Ordernumber" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="客户备注：" prop="Remarks">
            <Input v-model="formValidate.Remarks" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="管理员备注：" prop="RemarksHt">
            <Input v-model="formValidate.RemarksHt" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="订单总金额：" prop="Total">
            <Input v-model="formValidate.Total" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="优惠券抵扣金额：" prop="DisMoney">
            <Input v-model="formValidate.DisMoney" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="客户公司名称：" prop="CustomerName">
            <Input v-model="formValidate.CustomerName" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="客户公司编号：" prop="CustomerNo">
            <Input v-model="formValidate.CustomerNo" placeholder="请输入"/>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="供应商：" prop="supplierid">
            <Select v-model="formValidate.supplierid"
                    clearable
                    filterable>
              <!--<Option value="-1">全部</Option>-->
              <Option v-for="(item,index) in supplierList" :value="item.id" :key="index">{{ item.supplierName }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="发货时间：" prop="GetTime">
            <DatePicker :editable="false" @on-change="getTime" type="date" format="yyyy-MM-dd" placeholder="请选择" style="width: 100%"></DatePicker>

          </FormItem>
        </Col>
        <Col span="24">
          <FormItem label="商品列表：" prop="Prolist">
            <Button @click="selectPro">选择商品</Button>
            <Row v-if="formValidate.Prolist" v-for="(item,index) in formValidate.Prolist" :key="index">
              <Col span="5" style="font-size: 13px;">
                <span style="font-weight: 700;">名称：</span>{{item.ProductName}}
              </Col>
              <Col span="3" style="font-size: 13px;">
                <span style="font-weight: 700;">货号：</span>{{item.ProductStockNo}}
              </Col>
              <Col span="3" style="font-size: 13px;">
                <span style="font-weight: 700;">成本：</span>{{item.CostPrice}}
              </Col>
              <Col span="3" style="font-size: 13px;">
                <span style="font-weight: 700;">单价：</span>{{item.ProductPrice}}
              </Col>
              <Col span="4" style="font-size: 13px;display: flex;align-items: center">
                <span style="font-weight: 700;">数量：</span>
                <InputNumber :max="100" :min="1" size="small" v-model="item.ProductNum"></InputNumber>
              </Col>
              <Col span="3" style="font-size: 13px;">
                <span style="font-weight: 700;">小计：</span>{{item.ProductNum*item.TotalPrice}}
              </Col>
              <Col span="3">
                <a @click="delProlist(index)">删除</a>
              </Col>
            </Row>
          </FormItem>
        </Col>
        <Col span="24">
          <FormItem>
            <div style="width: 100%;">
              <Button type="primary" style="margin-right: 6px" @click="handleSubmit('formValidate')">新增</Button>
            </div>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Modal
      v-model="modal1"
      title="选择商品"
      @on-ok="selectOk"
      width="700px">
      <div>
        <Form ref="formValidate1" :rules="ruleValidate1" :model="formValidate1" :label-width="80">
          <Row>
            <Col span="12">
              <FormItem label="关键字：" prop="KeyWords">
                <Input v-model="formValidate1.KeyWords" placeholder="请输入"/>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem>
                <div style="width: 100%;">
                  <Button type="primary" style="margin-right: 6px" @click="handleSubmit1('formValidate1')">搜索</Button>
                </div>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table :columns="columns1" :data="dataList" @on-selection-change="selectionChange"
               style="max-height:281px;overflow-y: auto;overflow-x: hidden"></Table>

      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        supplierList:[],
        dataSite: [],
        terraceList: [],
        selectList: [],
        modal1: false,
        formValidate: {
          platformid: '',
          ssq:[],
          Province: '',// – 省
          City: '',// – 市
          Area: '',// – 区
          UserName:'',
          Consignee:'',
          Address:'',
          Phone:'',
          Freight:'',
          Ordernumber:'',
          Remarks:'',
          RemarksHt:'',
          DisMoney:'',
          Total:'',
          CustomerName:'',
          CustomerNo:'',
          supplierid:'',
          GetTime:'',
          Prolist: []
        },
        formValidate1: {
          KeyWords: ''
        },
        dataList: [],
        ruleValidate1: {
          KeyWords: [
            {required: true, message: '请输入关键字', trigger: 'blur'}
          ],
        },
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '名称',
            align: 'center',
            key: 'Name'
          },
          {
            title: '货号',
            align: 'center',
            key: 'StockNo'
          },
        ],
      }
    },
    methods: {
      //日期选择器回调
      getTime(i) {
        this.formValidate.GetTime = i
      },

      dzjhs(i, b) {
        this.formValidate.Province = b[0].label;
        this.formValidate.City = b[1].label;
        this.formValidate.Area = b[2].label;
      },

      //新增商品
      handleSubmit(name) {
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            let Prolist = this.formValidate.Prolist;
            console.log('1111111111')
            console.log(Prolist)
            console.log('2222222222')
            let formValidate = this.formValidate;
            for(let i = 0;i<Prolist.length;i++){
              Prolist[i].CostPrice = String(Prolist[i].CostPrice);
              Prolist[i].ProductNum = String(Prolist[i].ProductNum);
              Prolist[i].ProductPrice = String(Prolist[i].ProductPrice);
              Prolist[i].TotalPrice = String(Prolist[i].TotalPrice)
            }
            formValidate.Prolist = Prolist;
            _this.Axios.post('/ActCreateOrder.ashx', formValidate).then(res => {
              console.log(res.data)
              if(res.data.error===0){
                _this.$Message.success('创建成功')
                _this.handleReset('formValidate')
              }else {
                _this.$Message.error(res.data.errorMsg)
              }
            })
          } else {
            this.$Message.error('Fail!');
          }
        })
      },

      //删除勾选商品
      delProlist(i) {
        this.formValidate.Prolist.splice(i, 1)
      },


      //勾选完成
      selectOk() {
        if (this.selectList.length < 1) {
          this.$Message.error('请选择商品')
        } else {
          let arr = [];
          for (let i = 0; i < this.selectList.length; i++) {
            arr.push({
              ProductId: this.selectList[i].Id,// – 商品id
              ProductName: this.selectList[i].Name,// – 商品名称
              ProductStockNo: this.selectList[i].StockNo,// – 货号
              ProductNum: 1,// – 数量
              ProductPrice: this.selectList[i].Price,// – 单价
              TotalPrice: this.selectList[i].Price,// – 小计
              CostPrice: this.selectList[i].CostPrice,// – 成本
              ProductPic: this.selectList[i].Pic,// – 图片
            })
          }
          this.formValidate.Prolist = arr
        }
      },

      //勾选商品
      selectionChange(select) {
        this.selectList = select
      },
      selectPro() {
        this.modal1 = true;
        this.selectList = [];
        this.dataList = []
      },
      //查询商品
      handleSubmit1(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            const _this = this;
            _this.loading = true;
            _this.Axios.post('/youke/ManagerSc/GetProListSearch.ashx', _this.formValidate1).then(res => {
              _this.dataList = res.data.datalist;
              console.log(res.data.datalist)
            })
          }
        })
      },
      //获取平台
      getTerrace() {
        const _this = this;
        _this.Axios.get('/GetPlaList.ashx').then(res => {
          _this.terraceList = res.data.data
        })
      },
      //获取省市区
      getSsq() {
        const _this = this;
        _this.Axios.post('/GetRegional.ashx').then(res => {
          _this.dataSite = res.data.data;
        })
      },

      //获取供应商
      getSupplier() {
        const _this = this;
        _this.Axios.get('/GetSupList.ashx').then(res => {
          _this.supplierList = res.data.data
        })
      },
      //重置搜索条件
      handleReset(name) {
        this.$refs[name].resetFields();
      },
    },
    mounted() {
      this.getTerrace();
      this.getSupplier();
      this.getSsq()

    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
