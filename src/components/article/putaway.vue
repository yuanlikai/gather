<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">商品上架</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}" v-show="!$route.query.ids">
      <p slot="title">
        筛选查询
      </p>
      <Form ref="formValidate" :model="formValidate" :label-width="80">
        <Row :gutter="30">
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="商品名称：" prop="skuInfoNameLike">
              <Input v-model="formValidate.skuInfoNameLike" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="商品分类：" prop="classify">
              <Cascader v-model="formValidate.classify" :data="treeData" @on-change="screen"></Cascader>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="品牌：" prop="brandNameLike">
              <Select v-model="formValidate.brandId" @on-change="rePage(),dataList()" clearable>
                <Option v-for="(item,index) in brandList" :value="item.id" :key="index">{{item.brandName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="编号：" prop="skuInfoNoLike">
              <Input v-model="formValidate.skuInfoNoLike" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="24" :lg="8" style="">
            <FormItem>
              <Button type="primary" style="margin-right: 6px" @click="rePage(),dataList()">查询</Button>
              <Button style="margin-right: 6px" @click="rePage(),handleReset('formValidate')">重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title" style="text-align: left">
        选择商品
      </p>
      <div style="margin: 0 auto;max-width: 900px;">
        <Steps v-show="current!==2" :current="current" style="margin: 16px 0 0 0">
          <Step v-show="!$route.query.ids" title="选择商品" style="width: 70%;"></Step>
          <Step v-show="!$route.query.ids" title="填写销售信息" style="width: 30%;"></Step>
        </Steps>

        <Row v-show="current===0">
          <Spin fix v-if="loading"></Spin>
          <Col span="24">
            <Transfer
              :data="data"
              :target-keys="targetKeys"
              :list-style="{
                    width: '380px',
                    height: '400px',
                    textAlign: 'left',
                    marginTop:'32px'
                }"
              :titles="titles"
              :operations="['取消','选择']"
              :render-format="renders"
              @on-change="handleChange"></Transfer>
          </Col>
          <Button @click="fillIn()" :disabled="!targetKeys.length>0" type="primary" style="margin: 32px 0">
            下一步，填写销售信息
          </Button>
        </Row>

        <Row v-show="current===1">
          <Col span="24">
            <Row v-for="(item,index) in fillInList" :key="index">
              <Col span="24" style="margin-top: 32px;font-weight: 700">
                {{item[0].platformName}}
              </Col>
              <Col span="24">
                <Table :columns="columns" :data="item"></Table>
              </Col>
            </Row>
            <Button type="primary" ghost style="margin: 32px 16px 32px 0" @click="current=0" v-show="!$route.query.ids">
              上一步，选择商品平台
            </Button>
            <Button type="primary" v-show="show" style="margin: 32px 0" @click="putaway" :loading="sjLoding">上架</Button>
          </Col>
        </Row>

        <Row v-show="current===2">
          <Col span="24" style="text-align: center">
            <Icon type="ios-checkmark-circle" size="90" color="#19be6b" style="margin: 32px 0 24px 0"/>
            <div class="ivu-result-title">上架成功</div>
            <Alert style="width:80%;margin: 0 auto 32px auto;font-size: 14px;text-align: left;padding: 16px">
              商品上架成功，请到商品列表查看
            </Alert>
            <Button type="primary" @click="current = 0" v-show="!$route.query.ids">继续上架</Button>&nbsp;
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        show: true,
        loading: true,
        formValidate: {
          skuInfoNameLike: '',
          skuInfoNoLike: '',
          classify: [],
          brandId: '',
        },
        titles: ['全部商品', '已选中商品'],
        treeData: [],
        brandList: [],
        current: this.$route.query.ids ? 1 : 0,
        sjLoding: false,
        data: [],
        targetKeys: [],
        fillInList: [],
        start: 1,
        columns: [
          {
            title: '商品名',
            key: 'skuInfoName'
          },
          {
            title: 'SKU编号',
            maxWidth: 100,
            key: 'skuInfoNo'
          },
          {
            title: '市场价 (必填)',
            maxWidth: 170,
            key: 'marketPrice',
            render: (h, params) => {
              return h('input', {
                style: {
                  width: '100px',
                  border: '1px solid #dcdee2',
                  padding: '0 4px'
                },
                attrs: {
                  value: params.row.marketPrice,
                  type: "text",
                  maxlength: '7'
                },
                on: {
                  'input': (event) => {
                    if (event.target.value.length < 1) {
                      event.target.value = 1
                    }
                    event.target.value = event.target.value.match(/\d+(\.\d{0,2})?/) ? event.target.value.match(/\d+(\.\d{0,2})?/)[0] : ''
                  },
                  'blur': (event) => {
                    this.fillInList[params.row.platformName][params.index].marketPrice = event.target.value;
                  }
                }
              })
            }
          },
          {
            title: '售价 (必填)',
            maxWidth: 170,
            key: 'price',
            render: (h, params) => {
              return h('input', {
                style: {
                  width: '100px',
                  border: '1px solid #dcdee2',
                  padding: '0 4px'
                },
                attrs: {
                  value: params.row.price,
                  type: "text",
                  maxlength: '7'
                },
                on: {
                  'input': (event) => {
                    if (event.target.value.length < 1) {
                      event.target.value = 1
                    }
                    event.target.value = event.target.value.match(/\d+(\.\d{0,2})?/) ? event.target.value.match(/\d+(\.\d{0,2})?/)[0] : ''
                  },
                  'blur': (event) => {
                    this.fillInList[params.row.platformName][params.index].price = event.target.value;
                  }
                }
              })
            }
          },
          {
            title: '折扣（0.1~9.9）',
            maxWidth: 170,
            key: 'discount',
            render: (h, params) => {
              return h('input', {
                style: {
                  width: '100px',
                  border: '1px solid #dcdee2',
                  padding: '0 4px'
                },
                attrs: {
                  value: params.row.discount,
                  type: "text",
                  maxlength: '7'
                },
                on: {
                  'input': (event) => {
                    event.target.value = event.target.value.match(/\d+(\.\d{0,1})?/) ? event.target.value.match(/\d+(\.\d{0,1})?/)[0] : ''
                  },
                  'blur': (event) => {
                    this.fillInList[params.row.platformName][params.index].discount = event.target.value;
                  }
                }
              })
            }
          }
        ],
      }
    },
    methods: {
      //筛选
      screen(i) {
        this.rePage();
        this.formValidate.classify = i;
        this.dataList()
      },

      //上架
      putaway() {
        const _this = this;
        _this.sjLoding = true;
        var data = [];
        for (var i in _this.fillInList) {
          data = data.concat(_this.fillInList[i])
        }
        _this.Axios.post('/Manage/SkuInfo/onSale',
          data
        ).then(res => {
          if (res.data.code === 0) {
            _this.current = 2;
            _this.targetKeys = [];
            _this.$Message.success('上架成功！')
          } else {
            _this.$Message.warning(res.data.message)
          }
          _this.sjLoding = false
        })
      },

      //填写销售信息
      fillIn() {
        const _this = this;
        if (_this.targetKeys.length > 20) {
          _this.$Message.warning('最多选择20个商品')

        } else {
          _this.current = 1;
          _this.Axios.post('/Manage/SkuInfo/readyOnsaleList', _this.Qs.stringify({
            ids: _this.$route.query.ids ? _this.$route.query.ids : _this.targetKeys,
          }, {indices: false})).then(res => {
            _this.fillInList = res.data.data;
            if (!res.data.data) {
              _this.show = false;
              _this.$Message.warning('该商品分类未绑定平台')
            }
          })
        }
      },

      renders(item) {
        return item.label;
      },
      handleChange(newTargetKeys, direction, moveKeys) {
        this.targetKeys = newTargetKeys;
      },

      //获取可上架产品列表
      dataList() {
        const _this = this;
        _this.titles[0] = '全部商品'
        _this.Axios.get('/Manage/SkuInfo/readyOnsaleProducts', {
          params: {
            start: _this.start - 1,
            size: 50,
            skuInfoNameLike: _this.formValidate.skuInfoNameLike,    //商品名模糊搜索
            skuInfoNoLike: _this.formValidate.skuInfoNoLike,    //商品编号模糊搜索
            category1: _this.formValidate.classify[0],
            category2: _this.formValidate.classify[1],
            category3: _this.formValidate.classify[2],
            brandId: _this.formValidate.brandId,    //品牌id
            seed: '',    //true为未上架商品
          }
        }).then(res => {
          for (let i in res.data.data.content) {
            _this.data.push({
              "key": res.data.data.content[i].id,
              "label": res.data.data.content[i].abbrPlatformNames ? res.data.data.content[i].skuInfoName + " - " + res.data.data.content[i].abbrPlatformNames : res.data.data.content[i].skuInfoName,
              // "label": '<a>123</a>',
              "disabled": !res.data.data.content[i].abbrPlatformNames,
              render:(h,params)=>{
                console.log(params.row)
                return h('p','123')
              },
            })
          }
          _this.titles[0] = _this.titles[0] + '(' + res.data.data.totalElements + ')';
          _this.loading = false;
        })
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
          _this.brandList = res.data.data.content
        })
      },

      //重置搜索
      handleReset(name) {
        this.$refs[name].resetFields();
        this.formValidate.brandId = '';
        this.dataList()
      },

      rePage() {
        this.start = 1;
        this.data = [];
      }
    },
    watch: {
      '$route'(to, from) {
        this.current = 0;
        this.getTree();
        this.getBrand();
        this.dataList();
      }
    },
    mounted() {
      const _this = this;
      document.getElementsByClassName('ivu-transfer-list-content')[0].onscroll = function () {
        if (document.getElementsByClassName('ivu-transfer-list-content')[0].scrollTop + 365 > document.getElementsByClassName('ivu-transfer-list-content')[0].scrollHeight) {
          _this.start = _this.start + 1;
          _this.dataList();
        }
      };

      if (this.$route.query.ids) {
        this.fillIn()
      } else {
        this.getTree();
        this.getBrand();
        this.dataList();
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .ivu-btn-small {
    padding: 1px 7px 3px;
  }
</style>
