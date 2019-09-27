<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">{{$route.query.id?'编辑商品':'新建商品'}}</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto',minHeight:'300px'}">
      <Row>
        <Col :md="{span:18,offset:3}" :lg="{span:10,offset:6}">
          <Steps v-if="current!==3" :current="current" style="margin: 16px 0 32px 0">
            <Step title="选择商品分类"></Step>
            <Step title="填写商品信息"></Step>
            <Step title="填写商品属性"></Step>
          </Steps>
          <Row v-show="current===0">
            <Col span="24">
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="70">
                <FormItem label="商品分类" prop="classify">
                  <Cascader v-model="formValidate.classify" :data="treeData"></Cascader>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="handleSubmit('formValidate')" style="margin-top: 16px">下一步，填写商品信息
                  </Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
          <Row v-show="current===1">
            <Form ref="formValidate1" :model="formValidate1" :rules="ruleValidate1" :label-width="70">
              <Col span="24">
                <FormItem label="商品名称" prop="skuInfoName">
                  <Input :maxlength="60" v-model="formValidate1.skuInfoName" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="副标题" prop="subTitle">
                  <Input :maxlength="60" v-model="formValidate1.subTitle" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="商品品牌" prop="brandId">
                  <Select v-model="formValidate1.brandId" :clearable="true">
                    <Option v-for="(item,index) in brandList" :value="item.id" :key="index">{{item.brandName}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="折扣" prop="discount">
                  <Input :maxlength="15" v-model="formValidate1.discount" placeholder="请输入"></Input>
                </FormItem>

                <FormItem label="商品介绍" prop="description">
                  <Input :rows="3" :maxlength="80" type="textarea" v-model="formValidate1.description"
                         placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="运费" prop="brandStory">
                  包邮
                </FormItem>
                <FormItem label="关键词" prop="keyWords">
                  <Input search enter-button="添加" :maxlength="5" v-model="formValidate1.keyWords" placeholder="请输入"
                         style="width: 150px;" @on-search="addTag"/>
                  <Row style="margin-top: 8px">
                    <Col span="24">
                      <Tag v-for="(item,index) in tag" :key="index" type="border" closable
                           @on-close="handleClose(index)">
                        {{item}}
                      </Tag>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="题图" prop="pics1">
                  <upImg ref="pics1" :num="6"></upImg>
                </FormItem>
                <FormItem label="详情图" prop="pics2">
                  <upImg ref="pics2" :num="6"></upImg>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="current=0" ghost style="margin-right: 16px">上一步，选择商品分类</Button>
                  <Button type="primary" @click="handleSubmit('formValidate1')">下一步，填写商品属性</Button>
                </FormItem>
              </Col>
            </Form>
          </Row>
          <Row v-show="current===2">
            <Form ref="formValidate2" :model="formValidate2" :rules="ruleValidate2" :label-width="70">
              <Col span="24">
                <FormItem label="市场价" prop="marketPrice">
                  <Input :maxlength="7" v-model="formValidate2.marketPrice"
                         @on-keyup="formValidate2.marketPrice=formValidate2.marketPrice.replace(/[^\d\.]/g,'')"
                         placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="售价" prop="price">
                  <Input :maxlength="7" v-model="formValidate2.price"
                         @on-keyup="formValidate2.price=formValidate2.price.replace(/[^\d\.]/g,'')"
                         placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="SKU编号" prop="skuInfoNo">
                  <Input :maxlength="10" v-model="formValidate2.skuInfoNo"
                         @on-keyup="formValidate2.skuInfoNo=formValidate2.skuInfoNo.replace(/[^\w\.\/]/ig,'')"
                         placeholder="请输入"></Input>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="current=1" ghost style="margin-right: 16px">上一步，填写商品信息</Button>
                  <Button type="primary" @click="handleSubmit('formValidate2')">提交审核</Button>
                </FormItem>
              </Col>
            </Form>
          </Row>
        </Col>
      </Row>
      <Row v-if="current===3">
        <Col span="24" style="text-align: center">
          <Icon type="ios-checkmark-circle" size="90" color="#19be6b" style="margin: 32px 0 24px 0"/>
          <div class="ivu-result-title">{{$route.query.id ? '修改成功' : '添加成功'}}</div>
          <Alert style="width:50%;margin: 0 auto 32px auto;font-size: 14px;text-align: left;padding: 16px">已提交申请，等待审核
          </Alert>
          <Button type="primary" @click="current = 0">继续新建</Button>&nbsp;
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
          classify: [],  //分类数组
        },
        formValidate1: {
          skuInfoName: '',  //商品名称
          subTitle: '',     //副标题
          brandId: '',      //品牌ID
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
          subTitle: [
            {required: true, message: '请填写副标题', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请填写商品介绍', trigger: 'blur'}
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
      }
    },
    methods: {

      //新建编辑商品
      handleSubmit(name) {
        const _this = this;
        _this.formValidate1.pics = [];
        let pics1 = _this.$refs.pics1.uploadList;
        let pics2 = _this.$refs.pics2.uploadList;
        for (let i = 0; i < pics1.length; i++) {
          _this.formValidate1.pics.push({
            "filePath": pics1[i].filename,
            "fileType": 'PICTURE',
            "albumsSeq": i,
            "detailPic": false
          })
        }
        for (let i = 0; i < pics2.length; i++) {
          _this.formValidate1.pics.push({
            "filePath": pics2[i].filename,
            "fileType": 'PICTURE',
            "albumsSeq": i,
            "detailPic": true
          })
        }
        _this.$refs[name].validate((valid) => {
          if (valid) {
            if (name === 'formValidate') {
              _this.current = 1
            } else if (name === 'formValidate1') {
              _this.current = 2
            } else {
              _this.Axios.post('/Manage/SkuInfo/insert', {
                id: '',    //修改时传入

                categoryId: _this.formValidate.classify[2],   //第三季分类id
                category1: _this.formValidate.classify[0],   //第一级分类id
                category2: _this.formValidate.classify[1],   //第二级分类id
                category3: _this.formValidate.classify[2],   //第三级分类id

                skuInfoName: _this.formValidate1.skuInfoName,    //商品名称60
                subTitle: _this.formValidate1.subTitle,         //副标题60
                skuInfoPicUrl: _this.$refs.pics1.uploadList[0].filename,   //sku主图第一张150
                discount: _this.formValidate1.discount,         //折扣 15
                brandId: _this.formValidate1.brandId,           //品牌id
                keyWords: _this.tag.join(' '),                  //关键词50
                description: _this.formValidate1.description,   //描述80
                pics: _this.formValidate1.pics,   //图片集合

                marketPrice: _this.formValidate2.marketPrice,   //市场价整数7位小数2位
                price: _this.formValidate2.price,               //实付价格整数7位小数2位
                skuInfoNo: _this.formValidate2.skuInfoNo,       //sku编号10
              }).then(res => {
                if (res.data.code === 0) {
                  _this.current = 3;
                  _this.handleReset('formValidate');
                  _this.handleReset('formValidate1');
                  _this.handleReset('formValidate2');
                } else {
                  _this.$Message.warning(res.data.message)
                }
              })
            }
          } else {
            _this.$Message.error('有必填项未填写!');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
        this.tag = [];
        this.$refs.pics1.handleRemove1(0);
        this.$refs.pics2.handleRemove1(0);
      },

      //获取分类详情
      getDetail() {
        const _this = this;
        _this.Axios.get('/Manage/SkuInfo/detail', {
          params: {
            id: _this.$route.query.id
          }
        }).then(res => {
          console.log(res.data.data)
          _this.formValidate = {
            classify: [res.data.data.category1, res.data.data.category2, res.data.data.category3],  //分类数组
          };
          _this.formValidate1 = {
            skuInfoName: res.data.data.skuInfoName,  //商品名称
            subTitle: res.data.data.subTitle,     //副标题
            brandId: res.data.data.brandId,      //品牌ID
            description: res.data.data.description,  //描述
            discount: res.data.data.discount,     //折扣 15
          };
          _this.tag = res.data.data.keyWords.split(' ')     //关键词50


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
            marketPrice: res.data.data.marketPrice,    //市场价
            price: res.data.data.price,          //售价
            skuInfoNo: res.data.data.skuInfoNo,      //SKU编号
          };

          console.log(res.data.data)
          console.log(res.data.data.mianPics)
          // _this.formValidate = {
          //   id: res.data.data.id,  //更新时传id
          //   brandName: res.data.data.brandName,  //品牌名称30
          //   abbrBrandName: res.data.data.abbrBrandName,  //品牌简写6
          //   brandStory: res.data.data.brandStory,  //品牌故事100
          //   logoUrl: res.data.data.logoUrl,  //品牌LOGO路径160
          //   sortsNum: res.data.data.sortsNum,  //排序编号 3
          //   display: String(res.data.data.display),  //是否显示 true为显示 false为不显示
          // };
          // _this.$refs.logoUrl.defaultList.push({
          //   filename: res.data.data.logoUrl
          // });
          // if (res.data.data.brandImg) {
          //   _this.$refs.brandImg.defaultList.push({
          //     filename: res.data.data.brandImg
          //   });
          // }
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
      this.$route.query.id ? this.getDetail() : '';
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
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
