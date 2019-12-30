<template>
  <Modal v-model="model" width="360">
    <p slot="header" style="text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>修改配送地址</span>
    </p>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="收件人" prop="consignee">
        <Input v-model="formValidate.consignee" placeholder="请填写"></Input>
      </FormItem>
      <FormItem label="手机号" prop="phone">
        <Input v-model="formValidate.phone" placeholder="请填写"></Input>
      </FormItem>
      <FormItem label="选择地区" prop="ssq">
        <Cascader @on-change="dzjhs" :data="dataSite" v-model="formValidate.ssq"></Cascader>
        <!--<Input v-model="formValidate.ssq" placeholder="请填写"></Input>-->
      </FormItem>
      <FormItem label="详细地址" prop="address">
        <Input type="textarea" v-model="formValidate.address" placeholder="请填写"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
    </div>
  </Modal>
</template>
<script>
  export default {
    data() {
      const validate1 = (rule, value, callback) => {
        if(!(/^1[3456789]\d{9}$/.test(this.formValidate.phone))){
          callback(new Error('请填写正确手机号'))
        }else {
          callback()
        }
      };
      return {
        model: false,
        dataSite: [],
        ssq:[],
        formValidate: {
          consignee: '',
          phone: '',
          ssq: [],
          address: '',
        },
        ruleValidate: {
          consignee: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
          ssq: [
            {required: true, type: 'array', min: 3, message: '请选择', trigger: 'change'}
          ],
          phone: [
            {validator: validate1,required: true, trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请填写', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      dzjhs(i,b){
        this.ssq=b

      },
      handleSubmit(name) {
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            _this.Axios.post('/Manage/Order/updateOrderAddress', _this.Qs.stringify({
              id: _this.$route.query.idstr,  //订单id
              consignee: _this.formValidate.consignee,   // 收件人姓名
              phone: _this.formValidate.phone,   // 手机号
              province: _this.ssq[0].label,   // 省
              city: _this.ssq[1].label,   // 市
              area: _this.ssq[2].label,   // 区
              address: _this.formValidate.address,   // 详细地址
            })).then(res => {
              if(res.data.error===0){
                _this.model=false;
                _this.$emit('getOrder');
                this.$Message.success('成功!');
              }else {
                this.$Message.warning(res.data.errorMsg);
              }
            });
          } else {
            this.$Message.error('请填写必填项!');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      getSsq() {
        const _this = this;
        _this.Axios.get('/Manage/Region/region').then(res => {
          _this.dataSite = res.data.RegionList;
        })

      }
    },
    mounted() {
      this.getSsq();
    }
  }
</script>

