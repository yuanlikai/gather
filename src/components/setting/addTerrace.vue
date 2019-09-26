<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">添加平台</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <Row>
        <Col :md="{span:18,offset:3}" :lg="{span:10,offset:6}">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="70">
            <FormItem label="名称" prop="platformName">
              <Input :maxlength="20" v-model="formValidate.platformName" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="简称" prop="abbrPlatformName">
              <Input :maxlength="5" v-model="formValidate.abbrPlatformName" placeholder="请输入"></Input>
            </FormItem>

            <FormItem v-if="!$route.query.id" label="编号" prop="platformNo">
              <Input :maxlength="3" v-model="formValidate.platformNo" placeholder="请输入"></Input>
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
      return {
        detail: {},
        formValidate: {
          id: '',
          platformName: '',
          abbrPlatformName: '',
          logoUrl: '',
          platformNo:'',
          domian: '',
          description: '',
        },
        ruleValidate: {
          platformName: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          abbrPlatformName: [
            {required: true, message: '请输入简称', trigger: 'blur'}
          ],
          platformNo:[
            {required: true, message: '请输入编号', trigger: 'blur'}
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
