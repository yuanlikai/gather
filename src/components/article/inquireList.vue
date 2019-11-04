<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">商品查询</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
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
              <Select v-model="formValidate.brandId" @on-change="getList()" clearable>
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
              <Button type="primary" style="margin-right: 6px" @click="resetPage();getList()">查询</Button>
              <Button style="margin-right: 6px" @click="handleReset('formValidate')">重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        数据列表
      </p>
      <Table @on-selection-change="choice" :loading="loading1" :show-header="true"
             :columns="columns"
             :data="data"></Table>
      <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      <div style="width: 100%;text-align: right;margin-top: 15px">
        <Dropdown style="float: left;margin-left: 22px;text-align: left" trigger="click" @on-click="batch()">
          <Button>
            批量操作
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem @click="getList()" name="1">加入回收站</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Page @on-change="paging" :total="Number(total)" :page-size="10" show-elevator show-total/>
      </div>
    </Card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading1: true,
        formValidate: {
          skuInfoNameLike: '',
          skuInfoNoLike:'',
          classify: [],
          brandId: '',
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '商品图片',
            tooltip: true,
            width: 120,
            align: "center",
            key: 'skuInfoPicUrl',
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  trigger: 'hover',
                  placement: 'right'
                }
              }, [
                h('img', {
                  style: {
                    cursor: 'pointer',
                    height: '30px'
                  },
                  attrs: {
                    src: params.row.skuInfoPicUrl
                  }
                }),
                h('div', {
                  attrs: {
                    class: 'api'
                  },
                  slot: 'content'
                }, [
                  h('img', {
                    style: {
                      height: '200px'
                    },
                    attrs: {
                      src: params.row.skuInfoPicUrl
                    }
                  }),
                ])
              ])
            }
          },
          {
            title: '商品名称',
            tooltip: true,
            key: 'skuInfoName',
            render: (h, params) => {
              return h('div', [
                h('a', {
                  style: {
                    float: 'left',
                    width: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  },
                  on: {
                    click: () => {
                      let href = this.$router.resolve({
                        path: '/examine',
                        query: {
                          examineId: params.row.id
                        }
                      });
                      window.open(href.href, '_blank')
                    }
                  }
                }, params.row.skuInfoName),
                h('div', {
                  style: {
                    color: '#888888'
                  }
                }, `品牌：${params.row.brandName ? params.row.brandName : '未绑定'}`)
              ])
            }
          },
          {
            title: '编号',
            tooltip: true,
            key: 'skuInfoNo',
            align: "center",
          },
          {
            title: '商品分类',
            align: "center",
            render: (h, params) => {
              return h('p', `${params.row.category1Name} > ${params.row.category2Name} > ${params.row.category3Name}`)
            }
          },
          {
            title: '仓位',
            tooltip: true,
            key: 'stockType',
            align: "center",
            render:(h,params)=>{
              if(params.row.stockType==="DF"){
                return h('p','代发')
              }else if(params.row.stockType==="NHJ"){
                return h('p','南华街')
              }else if(params.row.stockType==="JS"){
                return h('p','嘉善')
              }else if(params.row.stockType==="GYS"){
                return h('p','供应商')
              }
            }
          },
          {
            title: '维护方式',
            tooltip: true,
            key: 'updMethod',
            align: "center",
            render:(h,params)=>{
              if(params.row.updMethod==="MANUAL"){
                return h('p','手动')
              }else if(params.row.updMethod==="AUTO"){
                return h('p','自动')
              }else if(params.row.updMethod==="BATCH"){
                return h('p','回滚')
              }
            }
          },
          {
            title: '供应商',
            tooltip: true,
            key: 'supplierName',
            align: "center",
          },
          {
            title: '操作',
            tooltip: true,
            key: 'ProductName',
            width: 120,
            align: "center",
            render: (h, params) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      let href = this.$router.resolve({
                        path: '/addArticle',
                        query: {
                          id: params.row.id
                        }
                      });
                      window.open(href.href, '_blank')
                    }
                  }
                }, '编辑'),
                h('Divider', {
                  props: {
                    type: 'vertical'
                  }
                }),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '确定加入回收站？',
                  },
                  on: {
                    'on-ok': () => {
                      this.Axios.post('/Manage/SkuInfo/recycleBin', this.Qs.stringify({
                        skuInfoIds: [params.row.id]
                      }, {indices: false})).then(res => {
                        if (res.data.code === 0) {
                          this.getList();
                          this.$Message.success('成功加入回收站')
                        } else {
                          this.$Message.warning(res.data.message)
                        }
                      })
                    }
                  }
                }, [
                  h('a', '删除')
                ])
              ])
            }
          }
        ],
        data: [],
        total: 0,
        start: 1,
        treeData: [],
        brandList: [],
        selection: [],
      }
    },
    methods: {
      //赛选
      screen(i) {
        this.formValidate.classify = i;
        this.resetPage();
        this.getList()
      },

      //获取品牌列表
      getList() {
        const _this = this;
        _this.loading1 = true;
        _this.Axios.get('/Manage/SkuInfo/supplierSkuPageList', {
          params: {
            start: _this.start - 1,
            size: 10,
            skuInfoNameLike: _this.formValidate.skuInfoNameLike,
            skuInfoNoLike: _this.formValidate.skuInfoNoLike,
            category1: _this.formValidate.classify[0],
            category2: _this.formValidate.classify[1],
            category3: _this.formValidate.classify[2],
            brandId: _this.formValidate.brandId,
            recycleBin: false
          }
        }).then(res => {
          if (res.data.code === 0) {
            _this.data = res.data.data.content;
            _this.total = res.data.data.totalElements
          } else {
            _this.$Message.warning(res.data.message)
          }
          _this.loading1 = false;
        })
      },

      // 分页
      paging(i) {
        this.start = i;
        this.getList()
      },

      //重置搜索
      handleReset(name) {
        this.$refs[name].resetFields();
        this.resetPage();
        this.formValidate.brandId = '';
        this.getList()
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

      //多选
      choice(selection) {
        this.selection = [];
        for (let i in selection) {
          this.selection.push(selection[i].id)
        }
      },

      //批量显示隐藏
      batch(i) {
        const _this = this;
        if (_this.selection.length > 0) {
          _this.Axios.post('/Manage/SkuInfo/delete', this.Qs.stringify({
            skuInfoIds: _this.selection
          }, {indices: false})).then(res => {
            if (res.data.code === 0) {
              _this.getList();
              _this.$Message.success('成功加入回收站')
            } else {
              _this.$Message.warning(res.data.message)
            }
          })
        } else {
          _this.$Message.warning('至少选择一个商品')
        }
      },

      resetPage() {
        this.start = 1;
        this.total = 0;
      }
    },
    mounted() {
      this.getList();
      this.getTree();
      this.getBrand();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
