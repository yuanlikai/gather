<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">{{$route.query.id?'编辑':'添加'}}平台</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <Row v-show="current===0">
        <Col :md="{span:18,offset:3}" :lg="{span:10,offset:6}">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="70">
            <FormItem label="名称" prop="platformName">
              <Input :maxlength="20" v-model="formValidate.platformName" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="简称" prop="abbrPlatformName">
              <Input :maxlength="5" v-model="formValidate.abbrPlatformName" placeholder="请输入"></Input>
            </FormItem>

            <FormItem label="编号" prop="platformNo">
              <Input :disabled="$route.query.id" :maxlength="3" v-model="formValidate.platformNo"
                     @on-keyup="formValidate.platformNo = formValidate.platformNo.replace(/[^a-zA-Z]/g,'').toUpperCase()"
                     placeholder="请输入"></Input>
            </FormItem>

            <FormItem label="logo" prop="logoUrl">
              <upImg ref="logo"></upImg>
            </FormItem>
            <FormItem label="域名" prop="domian">
              <Input :maxlength="100" v-model="formValidate.domian" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="描述" prop="description">
              <Input :maxlength="80" type="textarea" v-model="formValidate.description" placeholder="请输入"></Input>
            </FormItem>
            <FormItem prop="description">
              <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Row v-show="current===1">
        <Col span="24" style="text-align: center">
          <Icon type="ios-checkmark-circle" size="90" color="#19be6b" style="margin: 32px 0 24px 0"/>
          <div class="ivu-result-title">{{$route.query.id?'修改':'添加'}}成功</div>
          <Alert style="width:50%;margin: 0 auto 32px auto;font-size: 14px;text-align: left;padding: 16px">
            平台{{$route.query.id?'修改':'添加'}}成功，请到平台列表查看
          </Alert>
          <Button v-show="!$route.query.id" type="primary" @click="current = 0">继续添加</Button>&nbsp;
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
        if (this.$refs.logo.uploadList < 1) {
          callback(new Error('请上传logo'));
        } else {
          callback();
        }
      };
      const validate1 = (rule, value, callback) => {
        const _this = this;
        if (value) {
          _this.Axios.get('/Manage/Platform/valid/platformName', {
            params: {
              id: _this.$route.query.id ? _this.$route.query.id : '',
              value: value
            }
          }).then(res => {
            if (res.data.code === 0) {
              callback();
            } else {
              callback(new Error('平台名称重复'))
            }
          });
        } else {
          callback(new Error('请输入平台名称'))
        }
      };
      const validate2 = (rule, value, callback) => {
        const _this = this;
        if (value) {
          _this.Axios.get('/Manage/Platform/valid/abbrPlatformName', {
            params: {
              id: _this.$route.query.id ? _this.$route.query.id : '',
              value: value
            }
          }).then(res => {
            if (res.data.code === 0) {
              callback();
            } else {
              callback(new Error('平台简称重复'))
            }
          });
        } else {
          callback(new Error('请输入平台简称'))
        }
      };
      const validate3 = (rule, value, callback) => {
        const _this = this;
        if (value) {
          _this.Axios.get('/Manage/Platform/valid/platformNo', {
            params: {
              id: _this.$route.query.id ? _this.$route.query.id : '',
              value: value
            }
          }).then(res => {
            if (res.data.code === 0) {
              callback();
            } else {
              callback(new Error('平台编号重复'))
            }
          });
        } else {
          callback(new Error('请输入平台编号'))
        }
      };

      return {
        current: 0,
        detail: {},
        formValidate: {
          id: '',
          platformName: '',
          abbrPlatformName: '',
          logoUrl: '',
          platformNo: '',
          domian: '',
          description: '',
        },
        ruleValidate: {
          platformName: [
            {validator: validate1, required: true,  trigger: 'blur'}
          ],
          abbrPlatformName: [
            {validator: validate2, required: true,  trigger: 'blur'}
          ],
          platformNo: [
            {validator: validate3,required: true, mtrigger: 'blur'}
          ],
          logoUrl: [
            {validator: validate, required: true, trigger: 'change'}
          ],
          domian: [
            {required: true, message: '请输入域名', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {

      //提交分类
      handleSubmit(name) {
        const _this = this;
        _this.$refs[name].validate((valid) => {
          if (valid) {
            _this.Axios.post('/Manage/Platform/save', _this.Qs.stringify({
              id: _this.formValidate.id,
              platformName: _this.formValidate.platformName,
              abbrPlatformName: _this.formValidate.abbrPlatformName,
              logoUrl: _this.$refs.logo.uploadList[0].filename,
              domian: _this.formValidate.domian,
              platformNo: _this.formValidate.platformNo,
              description: _this.formValidate.description,
            })).then(res => {
              if (res.data.code === 0) {
                _this.current = 1;
                _this.handleReset('formValidate');
                _this.$refs.logo.uploadList = [];
                _this.$Message.success(_this.$route.query.id ? '修改成功！' : '添加成功！')
              } else {
                _this.$Message.warning(res.data.message)
              }
            })
          } else {
            _this.$Message.error('有必填项未填写!');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },

      //获取分类详情
      getDetail() {
        const _this = this;
        _this.Axios.get('/Manage/Platform/detail', {
          params: {
            id: _this.$route.query.id
          }
        }).then(res => {
          _this.formValidate = {
            id: res.data.data.id,
            platformName: res.data.data.platformName,
            abbrPlatformName: res.data.data.abbrPlatformName,
            domian: res.data.data.domian,
            platformNo: res.data.data.platformNo,
            description: res.data.data.description,
          };
          _this.$refs.logo.defaultList.push({
            filename: res.data.data.logoUrl
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
