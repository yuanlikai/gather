<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">商品详情</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto',minHeight:'300px'}">

      <Spin fix v-if="loading"></Spin>
      <Row>
        <Col :md="{span:18,offset:3}" :lg="{span:10,offset:6}">
          <Row>
            <Col span="24">
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width=88>
                <FormItem label="商品分类：" prop="classify">
                  <span style="color: #000;">{{formValidate.namePath}}</span>
                </FormItem>
              </Form>
            </Col>
          </Row>
          <Row>
            <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="88">
              <Col span="24">
                <FormItem label="商品名称：" prop="skuInfoName">
                  <span style="color: #000;">{{formValidate1.skuInfoName}}</span>
                </FormItem>
                <FormItem label="副标题：" prop="subTitle">
                  <span style="color: #000;">{{formValidate1.subTitle}}</span>
                </FormItem>
                <FormItem label="商品品牌：" prop="brandId">
                  <span style="color: #000;">{{formValidate1.brandName}}</span>
                </FormItem>
                <FormItem label="折扣：" prop="discount">
                  <span style="color: #000;">{{formValidate1.discount}}</span>
                </FormItem>
                <FormItem label="商品介绍：" prop="description">
                  <span style="color: #000;">{{formValidate1.description}}</span>
                </FormItem>
                <FormItem label="运费：" prop="brandStory">
                  <span style="color: #000;">包邮</span>
                </FormItem>
                <FormItem label="关键词：" prop="keyWords">
                  <span style="color: #000;">{{tag.length>0?tag:''}}</span>
                </FormItem>
                <FormItem label="题图：" prop="pics1">
                  <upImg ref="pics1" :num="6"></upImg>
                </FormItem>
                <FormItem label="详情图：" prop="pics2">
                  <upImg ref="pics2" :num="6"></upImg>
                </FormItem>
              </Col>
            </Form>
          </Row>
          <Row>
            <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="88">
              <Col span="24">
                <FormItem label="市场价：" prop="marketPrice">
                  <span style="color: #000;">{{formValidate2.marketPrice}}</span>
                </FormItem>
                <FormItem label="售价：" prop="price">
                  <span style="color: #000;">{{formValidate2.price}}</span>
                </FormItem>
                <FormItem label="SKU编号：" prop="skuInfoNo">
                  <span style="color: #000;">{{formValidate2.skuInfoNo}}</span>
                </FormItem>
              </Col>
            </Form>
          </Row>
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
    watch: {
      '$route'() {
        this.current = 0;
        this.handleReset('formValidate');
        this.handleReset('formValidate1');
        this.handleReset('formValidate2');
      }
    },
    data() {
      const validate1 = (rule, value, callback) => {
        this.$refs.pics1.uploadList < 1 ? callback(new Error('请上传商品题图')) : callback();
      };
      const validate2 = (rule, value, callback) => {
        this.$refs.pics2.uploadList < 1 ? callback(new Error('请上传商品详情图')) : callback();
      };
      return {
        detail: {},
        current: 0,
        formValidate: {
          namePath: '',
        },
        formValidate1: {
          skuInfoName: '',  //商品名称
          subTitle: '',     //副标题
          brandName: '',      //品牌ID
          description: '',  //描述
          discount: '',     //折扣 15
          keyWords: '',     //关键词50
          pics: [],         //图片集合
        },
        formValidate2: {
          marketPrice: '',    //市场价
          price: '',          //售价
          skuInfoNo: '',      //SKU编号
        },
        ruleValidate: {
          classify: [
            {required: true, type: 'array', min: 3, message: '请选择三级分类', trigger: 'change'}
          ]
        },
        ruleValidate1: {
          skuInfoName: [
            {required: true, message: '请填写名称', trigger: 'blur'}
          ],
          pics1: [
            {validator: validate1, required: true, trigger: 'change'}
          ],
          pics2: [
            {validator: validate2, required: true, trigger: 'change'}
          ],
        },
        ruleValidate2: {
          marketPrice: [
            {required: true, message: '请填写市场价', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请填写售价', trigger: 'blur'}
          ],
          skuInfoNo: [
            {required: true, message: '请填写SKU编号', trigger: 'blur'}
          ],
        },
        treeData: [],
        brandList: [],
        tag: [],
        loading: true,
      }
    },
    methods: {

      handleReset(name) {
        this.$refs[name].resetFields();
        this.tag = [];
        this.$refs.pics1.handleRemove1(0);
        this.$refs.pics2.handleRemove1(0);
      },

      //获取详情
      getDetail() {
        const _this = this;
        _this.Axios.get('/Manage/SkuInfo/detail', {
          params: {
            id: _this.$route.query.examineId
          }
        }).then(res => {
          _this.formValidate = {
            namePath: res.data.data.namePath,  //分类数组
          };
          _this.formValidate1 = {
            skuInfoName: res.data.data.skuInfoName,  //商品名称
            subTitle: res.data.data.subTitle,     //副标题
            brandName: res.data.data.brandName,           //品牌id
            description: res.data.data.description,  //描述
            discount: res.data.data.discount,     //折扣 15
          };

          for (let i in res.data.data.mianPics) {
            _this.$refs.pics1.defaultList.push({
              filename: res.data.data.mianPics[i].filePath
            })
          }
          for (let i in res.data.data.detailPics) {
            _this.$refs.pics2.defaultList.push({
              filename: res.data.data.detailPics[i].filePath
            })
          }
          _this.formValidate2 = {
            marketPrice: String(res.data.data.marketPrice),    //市场价
            price: String(res.data.data.price),          //售价
            skuInfoNo: res.data.data.skuInfoNo,      //SKU编号
          };
          if(res.data.data.keyWords){
            _this.tag = res.data.data.keyWords.split(' ')     //关键词50
          }
          _this.loading = false
        })
      },

      //添加标签
      addTag() {
        if (this.tag.length < 10 && this.formValidate1.keyWords !== '') {
          this.tag.push(this.formValidate1.keyWords);
          this.formValidate1.keyWords = ''
        }
      },

      //删除标签
      handleClose(i) {
        this.tag.splice(i, 1)
      },

      //获取分类
      getTree() {
        const _this = this;
        _this.Axios.get('/Manage/Category/treeList').then(res => {
          _this.treeData = res.data.data;
        })
      },

      //获取品牌列表
      getBrand() {
        const _this = this;
        _this.Axios.get('/Manage/Brand/selectBrand').then(res => {
          _this.brandList = res.data.data
        })
      },
    },
    mounted() {
      this.getTree();
      this.getBrand();
      this.getDetail()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .pics1{
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .pics2{
    position: absolute;
    width: 100%;
    height: 100%;
    background: #ffffff;
    left: 65px;
    z-index: 10;
  }
  .ivu-tag-border {
    line-height: 22px;
  }

  .ivu-result-title {
    margin-bottom: 16px;
    color: #17233d;
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }
</style>
