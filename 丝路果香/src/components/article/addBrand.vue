<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">{{$route.query.id?'编辑':'添加'}}品牌</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <Row v-show="current===0">
        <Col :md="{span:18,offset:3}" :lg="{span:10,offset:6}">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="品牌名称" prop="brandName">
              <Input :maxlength="30" v-model="formValidate.brandName" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="品牌简称" prop="abbrBrandName">
              <Input :maxlength="6" v-model="formValidate.abbrBrandName" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="品牌logo" prop="logoUrl">
              <upImg ref="logoUrl"></upImg>
            </FormItem>
            <FormItem label="专区大图">
              <upImg ref="brandImg"></upImg>
            </FormItem>
            <FormItem label="题图">
              <upImg ref="mainPic"></upImg>
            </FormItem>
            <FormItem label="详情图">
              <upImg ref="detailPics" :num="6"></upImg>
            </FormItem>
            <FormItem label="品牌故事" prop="brandStory">
              <Input :maxlength="100" type="textarea" v-model="formValidate.brandStory" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="排序" prop="sortsNum">
              <Input :maxlength="3" @on-keyup="formValidate.sortsNum=formValidate.sortsNum.replace(/[^\d]/g,'')"
                     v-model="formValidate.sortsNum" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="是否显示" prop="display">
              <RadioGroup v-model="formValidate.display">
                <Radio label="true">是</Radio>
                <Radio label="false">否</Radio>
              </RadioGroup>
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
            品牌{{$route.query.id?'修改':'添加'}}成功，请到品牌列表查看
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
        if (this.$refs.logoUrl.uploadList < 1) {
          callback(new Error('请上传品牌logo'));
        } else {
          callback();
        }
      };
      const validate1 = (rule, value, callback) => {
        const _this = this;
        if(value){
          _this.Axios.get('/Manage/Brand/validBrandName', {
            params: {
              id: _this.$route.query.id ? _this.$route.query.id : '',
              brandName: value
            }
          }).then(res => {
            if (res.data.code === 0) {
              callback();
            } else {
              callback(new Error('品牌名称重复'))
            }
          });
        }else {
          callback(new Error('请输入品牌名称'))
        }
      };
      return {
        current:0,
        detail: {},
        formValidate: {
          id: '',  //更新时传id
          brandName: '',  //品牌名称30
          abbrBrandName: '',  //品牌简写6
          brandStory: '',  //品牌故事100
          logoUrl: '',  //品牌LOGO路径160
          sortsNum: '50',  //排序编号 3
          display: 'true',  //是否显示 true为显示 false为不显示
          detailPics: [],
        },
        ruleValidate: {
          brandName: [
            {validator: validate1,min: 6,required: true, trigger: 'blur'}
          ],
          abbrBrandName:[
            {required: true, message: '请填写品牌简称', trigger: 'blur'}
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
        _this.formValidate.detailPics = [];
        let pics1 = _this.$refs.detailPics.uploadList;
        for (let i = 0; i < pics1.length; i++) {
          _this.formValidate.detailPics.push(pics1[i].filename)
        }
        _this.$refs[name].validate((valid) => {
          if (valid) {
            _this.Axios.post('/Manage/Brand/save', _this.Qs.stringify({
              id: _this.formValidate.id,  //更新时传id
              brandName: _this.formValidate.brandName,  //品牌名称30
              abbrBrandName: _this.formValidate.abbrBrandName,  //品牌简写6
              brandStory: _this.formValidate.brandStory,  //品牌故事100
              sortsNum: _this.formValidate.sortsNum,  //排序编号 3
              logoUrl: _this.$refs.logoUrl.uploadList[0].filename,  //品牌LOGO路径160
              brandImg: _this.$refs.brandImg.uploadList.length > 0 ? _this.$refs.brandImg.uploadList[0].filename : '',  //品牌大图路径160
              display: _this.formValidate.display,  //是否显示 true为显示 false为不显示
              mainPic: _this.$refs.mainPic.uploadList.length > 0 ? _this.$refs.mainPic.uploadList[0].filename : '',    //题图  一张 150
              detailPics: _this.formValidate.detailPics.join(','),    //详情图  逗号隔开1500
            })).then(res => {
              if (res.data.code === 0) {
                _this.current=1;
                _this.handleReset('formValidate');
                _this.$refs.logoUrl.uploadList=[];
                _this.$refs.brandImg.uploadList=[];
                _this.$refs.mainPic.uploadList=[];
                _this.$refs.detailPics.uploadList=[];

                _this.$Message.success(_this.$route.query.id ? '修改成功' : '添加成功');
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

      //获取品牌详情
      getDetail() {
        const _this = this;
        _this.Axios.get('/Manage/Brand/detail', {
          params: {
            id: _this.$route.query.id
          }
        }).then(res => {
          _this.formValidate = {
            id: res.data.data.id,  //更新时传id
            brandName: res.data.data.brandName,  //品牌名称30
            abbrBrandName: res.data.data.abbrBrandName,  //品牌简写6
            brandStory: res.data.data.brandStory,  //品牌故事100
            logoUrl: res.data.data.logoUrl,  //品牌LOGO路径160
            sortsNum: res.data.data.sortsNum,  //排序编号 3
            display: String(res.data.data.display),  //是否显示 true为显示 false为不显示
          };
          _this.$refs.logoUrl.defaultList.push({
            filename: res.data.data.logoUrl
          });
          if (res.data.data.brandImg) {
            _this.$refs.brandImg.defaultList.push({
              filename: res.data.data.brandImg
            });
          }
          if (res.data.data.mainPic) {
            _this.$refs.mainPic.defaultList.push({
              filename: res.data.data.mainPic
            });
          }
          if (res.data.data.detailPics) {
            let data = res.data.data.detailPics.split(',')
            for (let i = 0; i < data.length; i++) {
              _this.$refs.detailPics.defaultList.push({
                filename: data[i]
              });
            }
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
