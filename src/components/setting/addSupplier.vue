<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">{{$route.query.id?'修改':'添加'}}供应商</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <Row v-show="status">
        <Col :md="{span:18,offset:3}" :lg="{span:10,offset:6}">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="95">
            <FormItem label="企业名称" prop="supplierName">
              <Input :disabled="$route.query.id" :maxlength="40" v-model="formValidate.supplierName"
                     placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="简称" prop="abbrSupplierName">
              <Input :disabled="$route.query.id" :maxlength="10" v-model="formValidate.abbrSupplierName"
                     placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="ERP编号" prop="erpSupplierNo">
              <Input :maxlength="40" v-model="formValidate.erpSupplierNo"
                     placeholder="请输入"></Input>
            </FormItem>


            <FormItem label="字母编号" prop="supplierNo">
              <Input :disabled="$route.query.id" :maxlength="5" v-model="formValidate.supplierNo"
                     placeholder="请输入"
                     @on-keyup="formValidate.supplierNo = formValidate.supplierNo.replace(/[^a-zA-Z]/g,'').toUpperCase()"></Input>
            </FormItem>
            <!--<FormItem label="logo" prop="logoUrl">-->
            <!--<upImg ref="logoUrl"></upImg>-->
            <!--</FormItem>-->
<!--            <FormItem label="SKU数量限制" prop="productLim">-->
<!--              <Input :disabled="$route.query.disabled" :maxlength="4" v-model="formValidate.productLim"-->
<!--                     @on-keyup="formValidate.productLim=formValidate.productLim.replace(/[^\d]/g,'');"-->
<!--                     placeholder="请输入"></Input>-->
<!--            </FormItem>-->
            <FormItem v-show="!$route.query.disabled">
              <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Row v-show="!status">
        <Col span="24" style="text-align: center">
          <Icon type="ios-checkmark-circle" size="90" color="#19be6b" style="margin: 32px 0 24px 0"/>
          <div class="ivu-result-title">{{$route.query.id ? '修改成功' : '添加成功'}}</div>
          <Alert style="width:50%;margin: 0 auto 32px auto;font-size: 14px;text-align: left;padding: 16px">
            供应商{{$route.query.id?'修改':'添加'}}成功，请到供应商列表查看
          </Alert>
          <Button type="primary" @click="handleReset('formValidate');status=true" v-show="!$route.query.id">继续添加
          </Button>&nbsp;
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
  import upImg from '../upImg'

  export default {
    components: {
      upImg
    },
    data() {
      const validate = (rule, value, callback) => {
        if (this.$refs.logoUrl.uploadList < 1) {
          callback(new Error('请上传品牌logo'));
        } else {
          callback();
        }
      };
      const validate1 = (rule, value, callback) => {
        const _this = this;
        if (value) {
          _this.Axios.get('/Manage/Supplier/valid/supplierName', {
            params: {
              id: _this.$route.query.id ? _this.$route.query.id : '',
              value: value
            }
          }).then(res => {
            if (res.data.code === 0) {
              callback();
            } else {
              callback(new Error('企业名称重复'))
            }
          });
        } else {
          callback(new Error('请输入企业名称'))
        }
      };
      const validate2 = (rule, value, callback) => {
        const _this = this;
        if (value) {
          _this.Axios.get('/Manage/Supplier/valid/abbrSupplierName', {
            params: {
              id: _this.$route.query.id ? _this.$route.query.id : '',
              value: value
            }
          }).then(res => {
            if (res.data.code === 0) {
              callback();
            } else {
              callback(new Error('企业简称重复'))
            }
          });
        } else {
          callback(new Error('请输入企业简称'))
        }
      };
      const validate3 = (rule, value, callback) => {
        const _this = this;
        _this.Axios.get('/Manage/Supplier/valid/supplierNo', {
          params: {
            id: _this.$route.query.id ? _this.$route.query.id : '',
            value: value
          }
        }).then(res => {
          if (res.data.code === 0) {
            callback();
          } else {
            callback(new Error('编号重复'))
          }
        });
      };
      const validate4 = (rule, value, callback) => {
        const _this = this;
        _this.Axios.get('/Manage/Supplier/valid/erpSupplierNo', {
          params: {
            id: _this.$route.query.id ? _this.$route.query.id : '',
            value: value
          }
        }).then(res => {
          if (res.data.code === 0) {
            callback();
          } else {
            callback(new Error('ERP编号重复'))
          }
        });
      };
      return {
        status: true,
        detail: {},
        formValidate: {
          id: -1,              //分类id 传入就是新增
          supplierName: '',   //名称40
          abbrSupplierName: '',   //简称10
          supplierNo: '',   //代码5
          logoUrl: '',
          erpSupplierNo: '',
        },
        ruleValidate: {
          supplierName: [
            { message: '请输入企业名称', required: true, trigger: 'blur'}
          ],
          abbrSupplierName: [
            { message: '请输入简称', required: true, trigger: 'blur'}
          ],
          supplierNo: [
            { message: '请输入字母编号', required: true, trigger: 'blur'}
          ],
          // logoUrl: [
          //   {validator: validate, required: true, trigger: 'change'}
          // ],
          erpSupplierNo: [
            {message: '请输入ERP编号', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {

      //提交供应商
      handleSubmit(name) {
        const _this = this;
        _this.$refs[name].validate((valid) => {
          if (valid) {
            console.log(1221312312)
            _this.Axios.post('/EditSupplier.ashx', {
              id: _this.formValidate.id,              //分类id 传入就是新增
              supplierName: _this.formValidate.supplierName,   //名称40
              abbrSupplierName: _this.formValidate.abbrSupplierName,   //简称10
              supplierNo: _this.formValidate.supplierNo,   //代/EditSupplier.ashx码5
              erpSupplierNo: _this.formValidate.erpSupplierNo,
              supplierLogo: "https://ylmanager.oss-cn-shanghai.aliyuncs.com/Image/20201230/eef12de4-ccaa-4dae-9988-a58917167e51"
              // supplierLogo: _this.$refs.logoUrl.uploadList.length>0?_this.$refs.logoUrl.uploadList[0].filename:'',  //品牌LOGO路径160
            }).then(res => {
              if (res.data.error === 0) {
                _this.status = false;
                _this.$refs.logoUrl.uploadList = [];
                _this.$Message.success(_this.$route.query.id ? '修改成功！' : '添加成功！')
              } else {
                _this.$Message.warning(res.data.errorMsg)
              }
            })
          } else {
            _this.$Message.error('有必填项未填写!');
          }
        })
      },
      handleReset(name) {
        this.$route.query.id ? '' : this.$refs[name].resetFields();

      },

      //获取供应商详情
      getDetail() {
        const _this = this;
        _this.Axios.post('/GetSupModel.ashx', {
          id: Number(_this.$route.query.id)
        }).then(res => {
          _this.formValidate = {
            id: res.data.data.id,              //分类id 传入就是新增
            supplierName: res.data.data.supplierName,   //名称40
            abbrSupplierName: res.data.data.abbrSupplierName,   //简称10
            supplierNo: res.data.data.supplierNo,   //代码5
            erpSupplierNo: res.data.data.erpSupplierNo,
          };
          if (res.data.data.imgUrl) {
            _this.$refs.classify.defaultList.push({
              filename: res.data.data.imgUrl
            });
          }
          _this.$refs.logoUrl.defaultList.push({
            filename: res.data.data.supplierLogo
          });
        })

      }
    },
    mounted() {
      this.$route.query.id ? this.getDetail() : '';
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
