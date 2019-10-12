<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">{{$route.query.id?'编辑':'添加'}}分类</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">

      <Row v-show="current===0">
        <Col :md="{span:18,offset:3}" :lg="{span:10,offset:6}">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="70">
            <FormItem label="分类名称" prop="name">
              <Input :maxlength="50" v-model="formValidate.name" placeholder="请输入"></Input>
            </FormItem>
            <FormItem v-show="$route.query.name" label="上级分类" prop="parentId">
              <Input v-model="formValidate.parentId" disabled="disabled" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="排序" prop="sortsNum">
              <Input :maxlength="3" @on-keyup="formValidate.sortsNum=formValidate.sortsNum.replace(/[^\d]/g,'')"
                     v-model="formValidate.sortsNum" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="分类图标" prop="sortsNum">
              <upImg ref="classify"></upImg>
            </FormItem>
            <FormItem label="分类描述" prop="description">
              <Input :maxlength="30" type="textarea" v-model="formValidate.description" placeholder="请输入"></Input>
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
            分类{{$route.query.id?'修改':'添加'}}成功，请到分类列表查看
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
      return {
        current:0,
        detail: {},
        formValidate: {
          id: '',              //分类id 传入就是新增
          sortsNum: '',          //排序
          parentId: this.$route.query.name,         //上级分类id
          name: '',           //分类名称
          description: '',     //隔开 最大长度30
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ]
        },
      }
    },
    methods: {

      //提交分类
      handleSubmit(name) {
        const _this = this;
        _this.$refs[name].validate((valid) => {
          if (valid) {
            _this.Axios.post('/Manage/Category/saveCategory', _this.Qs.stringify({
              id: _this.formValidate.id,                      //分类id 传入就是新增
              sortsNum: _this.formValidate.sortsNum,          //排序
              parentId: _this.$route.query.parentId ? _this.$route.query.parentId : '',         //上级分类id
              imgUrl: _this.$refs.classify.uploadList.length > 0 ? _this.$refs.classify.uploadList[0].filename : '',              //图标
              name: _this.formValidate.name,                  //分类名称
              description: _this.formValidate.description,     //隔开 最大长度30
            })).then(res => {
              if (res.data.code === 0) {
                _this.$Message.success('添加成功！');
                _this.handleReset('formValidate');
                _this.$refs.classify.uploadList=[];
                _this.current=1
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
        _this.Axios.get('/Manage/Category/detail', {
          params: {
            id: _this.$route.query.id
          }
        }).then(res => {
          _this.formValidate = {
            id: res.data.data.id,              //分类id 传入就是新增
            sortsNum: res.data.data.sortsNum,          //排序
            parentId: this.$route.query.name,         //上级分类id
            name: res.data.data.name,           //分类名称
            description: res.data.data.description,     //隔开 最大长度30
          };
          if (res.data.data.imgUrl) {
            _this.$refs.classify.defaultList.push({
              filename: res.data.data.imgUrl
            });
          }
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
