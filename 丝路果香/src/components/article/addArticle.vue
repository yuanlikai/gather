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
                  <Input :maxlength="200" v-model="formValidate1.skuInfoName" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="副标题" prop="subTitle">
                  <Input :maxlength="60" v-model="formValidate1.subTitle" placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="商品品牌" prop="brandId">
                  <Select v-model="formValidate1.brandId" :clearable="true">
                    <Option v-for="(item,index) in brandList" :value="item.id" :key="index">{{item.brandName}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="维护" prop="updMethod" v-if="supplier.supplierId==='1'">
                  <Select :disabled="$route.query.id?true:false" v-model="formValidate1.updMethod" :clearable="true">
                    <Option value="AUTO">自动更新</Option>
                    <Option value="MANUAL">手动维护</Option>
                    <Option value="BATCH">自动回滚</Option>
                  </Select>
                </FormItem>
                <FormItem label="仓位" prop="stockType" v-if="supplier.supplierId==='1'&&formValidate1.updMethod">
                  <Select :disabled="$route.query.id?true:false" v-model="formValidate1.stockType" :clearable="true">
                    <Option value="DF" v-if="formValidate1.updMethod==='MANUAL'">代发</Option>
                    <Option value="NHJ" v-if="formValidate1.updMethod==='BATCH'">南华街</Option>
                    <Option value="JS" v-if="formValidate1.updMethod==='AUTO'">嘉善</Option>
                  </Select>
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
                <FormItem label="题图 (大小1MB)" prop="pics1">
                  <upImg ref="pics1" :num="6"></upImg>
                </FormItem>
                <FormItem label="详情图 (大小1MB)" prop="pics2">
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
                         @on-keyup="formValidate2.marketPrice= formValidate2.marketPrice.match(/\d+(\.\d{0,2})?/) ? formValidate2.marketPrice.match(/\d+(\.\d{0,2})?/)[0] : ''"
                         placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="售价" prop="price">
                  <Input :maxlength="7" v-model="formValidate2.price"
                         @on-keyup="formValidate2.price= formValidate2.price.match(/\d+(\.\d{0,2})?/) ? formValidate2.price.match(/\d+(\.\d{0,2})?/)[0] : ''"
                         placeholder="请输入"></Input>
                </FormItem>

                <FormItem label="折扣" prop="discount">
                  <Input
                    @on-keyup="formValidate2.discount= formValidate2.discount.match(/\d+(\.\d{0,1})?/) ? formValidate2.discount.match(/\d+(\.\d{0,1})?/)[0] : ''"
                    :maxlength="15" v-model="formValidate2.discount" placeholder="折扣为（0.1~9.9）之间"></Input>
                </FormItem>

                <FormItem label="SKU编号" prop="skuInfoNo">
                  <Input :disabled="$route.query.id?true:false" :maxlength="10" v-model="formValidate2.skuInfoNo"
                         @on-keyup="formValidate2.skuInfoNo=formValidate2.skuInfoNo.replace(/[^\w\.\/]/ig,'')"
                         placeholder="请输入"></Input>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="current=1" ghost style="margin-right: 16px">上一步，填写商品信息</Button>
                  <Poptip
                    v-if="$route.query.id"
                    confirm
                    title="修改后将会在所有平台下架，是否确定？"
                    @on-ok="handleSubmit('formValidate2')">
                    <Button type="primary">提交修改</Button>
                  </Poptip>
                  <template v-else>
                    <!--<Button type="primary" @click="approvalStatusStr='UNCOMMIT';handleSubmit('formValidate2')" style="margin-right: 10px">保存</Button>-->
                    <Button type="primary" @click="approvalStatusStr='AUDITING';handleSubmit('formValidate2')">保存，并提交审核</Button>
                  </template>
                </FormItem>
              </Col>
            </Form>
          </Row>
        </Col>
      </Row>
      <Row v-show="current===3">
        <Col span="24" style="text-align: center">
          <Icon type="ios-checkmark-circle" size="90" color="#19be6b" style="margin: 32px 0 24px 0"/>
          <div class="ivu-result-title">{{$route.query.id ? '修改成功' : '添加成功'}}</div>
          <Alert style="width:50%;margin: 0 auto 32px auto;font-size: 14px;text-align: left;padding: 16px">
            {{!$route.query.id?'已提交申请，等待审核':'商品修改成功！'}}
          </Alert>
          <Button type="primary" @click="current = 0" v-show="!$route.query.id">继续新建</Button>
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
    props: ['supplier'],
    data() {
      const validate1 = (rule, value, callback) => {
        this.$refs.pics1.uploadList < 1 ? callback(new Error('请上传商品题图')) : callback();
      };
      const validate2 = (rule, value, callback) => {
        this.$refs.pics2.uploadList < 1 ? callback(new Error('请上传商品详情图')) : callback();
      };
      const validate3 = (rule, value, callback) => {
        const _this = this;
        if (value) {
          _this.Axios.get('/Manage/SkuInfo/validSkuInfoNo', {
            params: {
              id: _this.$route.query.id ? _this.$route.query.id : '',
              skuInfoNo: value
            }
          }).then(res => {
            if (res.data.code === 0) {
              callback();
            } else {
              callback(new Error('商品编号重复'))
            }
          });

        } else {
          callback(new Error('请输入商品编号'))
        }
      };
      return {
        approvalStatusStr:'',
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
          stockType: '',     //仓位
          updMethod: '',      //维护方式
          keyWords: '',     //关键词50
          pics: [],         //图片集合
        },
        formValidate2: {
          marketPrice: '',    //市场价
          price: '',          //售价
          skuInfoNo: '',      //SKU编号
          discount: '',     //折扣 15
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
          updMethod: [
            {required: true, message: '请选择维护方式', trigger: 'change'}
          ],
          stockType: [
            {required: true, message: '请选择仓位', trigger: 'change'}
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
            {validator: validate3, required: true, trigger: 'blur'}
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


              _this.Axios.post(_this.$route.query.id ? '/Manage/SkuInfo/update' : '/Manage/SkuInfo/insert', {
                id: _this.$route.query.id ? _this.$route.query.id : '',    //修改时传入
                approvalStatusStr: _this.approvalStatusStr,    //UNCOMMIT为保存AUDITING为保存并提交审核

                categoryId: _this.formValidate.classify[2],   //第三季分类id
                category1: _this.formValidate.classify[0],   //第一级分类id
                category2: _this.formValidate.classify[1],   //第二级分类id
                category3: _this.formValidate.classify[2],   //第三级分类id

                skuInfoName: _this.formValidate1.skuInfoName,    //商品名称60
                subTitle: _this.formValidate1.subTitle,         //副标题60
                skuInfoPicUrl: _this.$refs.pics1.uploadList[0].filename,   //sku主图第一张150
                brandId: _this.formValidate1.brandId,           //品牌id
                keyWords: _this.tag.join(' '),                  //关键词50
                description: _this.formValidate1.description,   //描述80
                pics: _this.formValidate1.pics,   //图片集合
                stockType: _this.supplier.supplierId === '1' ? _this.formValidate1.stockType : 'GYS',  //仓位
                updMethod: _this.supplier.supplierId === '1' ? _this.formValidate1.updMethod : 'MANUAL', //维护方式

                marketPrice: _this.formValidate2.marketPrice,   //市场价整数7位小数2位
                discount: _this.formValidate2.discount,         //折扣 15
                price: _this.formValidate2.price,               //实付价格整数7位小数2位
                skuInfoNo: _this.formValidate2.skuInfoNo,       //sku编号10

                fullSkuInfoNo: _this.supplier.supplierNo + _this.formValidate2.skuInfoNo,
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
          console.log(res.data)
          _this.formValidate = {
            classify: [res.data.data.category1, res.data.data.category2, res.data.data.category3],  //分类数组
          };
          _this.formValidate1 = {
            skuInfoName: res.data.data.skuInfoName,  //商品名称
            subTitle: res.data.data.subTitle,     //副标题
            brandId: res.data.data.brandId,      //品牌ID
            description: res.data.data.description,  //描述
            stockType: res.data.data.stockType,  //仓位
            updMethod: res.data.data.updMethod
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
            discount: res.data.data.discount,     //折扣 15
            skuInfoNo: res.data.data.skuInfoNo,      //SKU编号
          };
          _this.tag = res.data.data.keyWords.split(' ')     //关键词50

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
