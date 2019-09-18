
<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">添加平台</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="70" style="width: 500px">
        <FormItem label="名称" prop="platformName" style="width: 500px">
          <Input :maxlength="10" v-model="formValidate.platformName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="简称" prop="abbrPlatformName" style="width: 500px">
          <Input :maxlength="5" v-model="formValidate.abbrPlatformName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="logo" prop="logoUrl" style="width: 500px">
          <upImg ref="logo"></upImg>
        </FormItem>
        <FormItem label="域名" prop="domian" style="width: 500px">
          <Input :maxlength="100" v-model="formValidate.domian" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="描述" prop="description" style="width: 500px">
          <Input :maxlength="80" type="textarea" v-model="formValidate.description" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="description" style="width: 500px">
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>
<script>
  import upImg from '../upImg'
  export default {
    components:{
      upImg
    },
    data() {
      return {
        detail:{},
        formValidate: {
          id: '',
          platformName:'',
          abbrPlatformName:'',
          logoUrl: '',
          domian: '',
          description: '',
        },
        ruleValidate: {
          platformName: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          abbrPlatformName: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          logoUrl: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请输入名称', trigger: 'blur'}
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
            _this.Axios.post('/Manage/Category/saveCategory',_this.Qs.stringify({
              id: _this.formValidate.id,                      //分类id 传入就是新增
              sortsNum:_this.formValidate.sortsNum,          //排序
              parentId: _this.$route.query.parentId?_this.$route.query.parentId:'',         //上级分类id
              imgUrl: _this.$refs.classify.uploadList.length>0?_this.$refs.classify.uploadList[0].filename:'',              //图标
              name: _this.formValidate.name,                  //分类名称
              description: _this.formValidate.description,     //隔开 最大长度30
            })).then(res=>{
              if(res.data.code===0){
                _this.$Message.success('添加成功！')
              }else {
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
      getDetail(){
        const _this = this;
        _this.Axios.get('/Manage/Category/detail',{
          params:{
            id:_this.$route.query.id
          }
        }).then(res=>{
          _this.formValidate= {
            id: res.data.data.id,              //分类id 传入就是新增
            sortsNum:res.data.data.sortsNum,          //排序
            parentId: this.$route.query.name,         //上级分类id
            name: res.data.data.name,           //分类名称
            description: res.data.data.description,     //隔开 最大长度30
          };
          if(res.data.data.imgUrl){
            _this.$refs.classify.defaultList.push({
              filename:res.data.data.imgUrl
            });
          }
          console.log(res.data.data)
        })

      }
    },
    mounted() {
      this.$route.query.id?this.getDetail():'';
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
