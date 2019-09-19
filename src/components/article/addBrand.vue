<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">添加品牌</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="70" style="width: 500px">
        <FormItem label="品牌名称" prop="brandName" style="width: 500px">
          <Input :maxlength="30" v-model="formValidate.brandName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="品牌简称" prop="abbrBrandName" style="width: 500px">
          <Input :maxlength="6" v-model="formValidate.abbrBrandName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="品牌logo" prop="logoUrl" style="width: 500px">
          <upImg ref="logoUrl"></upImg>
        </FormItem>
        <FormItem label="专区大图" style="width: 500px">
          <upImg ref="brandImg"></upImg>
        </FormItem>
        <FormItem label="品牌故事" prop="brandStory" style="width: 500px">
          <Input :maxlength="100" type="textarea" v-model="formValidate.brandStory" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="排序" prop="sortsNum" style="width: 500px">
          <Input :maxlength="3" @on-keyup="formValidate.sortsNum=formValidate.sortsNum.replace(/[^\d]/g,'')"
                 v-model="formValidate.sortsNum" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="是否显示" prop="display" style="width: 500px">
          <RadioGroup v-model="formValidate.display">
            <Radio label="true">是</Radio>
            <Radio label="false">否</Radio>
          </RadioGroup>
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
      return {
        detail: {},
        formValidate: {
          id:'',  //更新时传id
          brandName:'',  //品牌名称30
          abbrBrandName:'',  //品牌简写6
          brandStory:'',  //品牌故事100
          logoUrl:'',  //品牌LOGO路径160
          sortsNum:'',  //排序编号 3
          display:'true',  //是否显示 true为显示 false为不显示
        },
        ruleValidate: {
          brandName: [
            {required: true, message: '请输入品牌名称', trigger: 'blur'}
          ],
          logoUrl: [
            {validator: validate, required: true, trigger: 'change'}
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
            console.log(_this.$refs.logoUrl.uploadList[0].filename)
            _this.Axios.post('/Manage/Brand/save', _this.Qs.stringify({
              id:'',  //更新时传id
              brandName: _this.formValidate.brandName,  //品牌名称30
              abbrBrandName: _this.formValidate.abbrBrandName,  //品牌简写6
              brandStory: _this.formValidate.brandStory,  //品牌故事100
              sortsNum: _this.formValidate.sortsNum,  //排序编号 3
              logoUrl: _this.$refs.logoUrl.uploadList[0].filename,  //品牌LOGO路径160
              brandImg: _this.$refs.brandImg.uploadList.length>0?_this.$refs.brandImg.uploadList[0].filename:'',  //品牌大图路径160
              display: _this.formValidate.display,  //是否显示 true为显示 false为不显示
            })).then(res => {
              if (res.data.code === 0) {
                _this.$Message.success('添加成功！')
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
          console.log(res.data.data)
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
