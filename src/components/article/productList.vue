<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">商品列表</div>
    </Card>
    <RadioGroup :style="{margin: '0 0 0 20px', background: '#fff',height:'auto'}" size="large" type="button"
                v-model="state" @on-change="resetPage();getList()">
      <Radio style="padding:0 20px" label="all">
        全部商品 ({{countList.totle}})
      </Radio>
      <Radio style="padding:0 20px" label="true">
        上架 ({{countList.onSaleCount}})
      </Radio>
      <Radio style="padding:0 20px" label="false">
        下架 ({{countList.notSaleCount}})
      </Radio>
    </RadioGroup>
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
            <FormItem label="商品分类" prop="classify">
              <Cascader v-model="formValidate.classify" :data="treeData" @on-change="screen"></Cascader>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="商品品牌：" prop="brandNameLike">
              <Select v-model="formValidate.brandId" :clearable="true" @on-change="resetPage();getList()" clearable>
                <Option v-for="(item,index) in brandList" :value="item.id" :key="index">{{item.brandName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <!--<Col :xs="24" :md="12" :lg="8">-->
          <!--<FormItem label="供应商：" prop="brandNameLike">-->
          <!--<Select v-model="formValidate.supplierId" :clearable="true" @on-change="resetPage();getList()" clearable>-->
          <!--<Option v-for="(item,index) in supplierList" :value="item.id" :key="index">{{item.supplierName}}-->
          <!--</Option>-->
          <!--</Select>-->
          <!--</FormItem>-->
          <!--</Col>-->
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
        数据列表{{state}}
      </p>
      <Table @on-selection-change="choice" @on-sort-change="sorts" :loading="loading1" :show-header="true"
             :columns="columns"
             :data="data"></Table>
      <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      <div style="width: 100%;text-align: right;margin-top: 15px">
        <Button style="float: left;margin-left: 22px;text-align: left" v-show="state==='true'" @click="batch">批量下架
        </Button>
        <Button style="float: left;margin-left: 22px;text-align: left" v-show="state==='false'" @click="putaway">批量上架
        </Button>
        <Page @on-change="paging" :total="Number(total)" :page-size="10" show-elevator show-total/>
      </div>
    </Card>
    <editorProduct ref="editor"></editorProduct>
    <repertory @getList="getList" ref="repertory"></repertory>
  </div>
</template>
<script>
  import editorProduct from './editorProduct'
  import repertory from './repertory'

  export default {
    components: {
      editorProduct,
      repertory
    },
    data() {
      return {
        state: 'all',
        loading1: true,
        countList: {},
        formValidate: {
          skuInfoNameLike: '',
          classify: [],
          brandId: '',
          supplierId: '',
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
                  placement: 'right'
                }
              }, [
                h('img', {
                  style: {
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
            minWidth: 70,
            key: 'skuInfoName',
            render: (h, params) => {
              return h('div', [
                h('div', params.row.skuInfoName),
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
            title: '价格',
            tooltip: true,
            key: 'price',
            sortable: "custom",
            align: "center",
            render: (h, params) => {
              return h('div', [
                h('span', {
                  style: {
                    marginTop: '2px'
                  }
                }, params.row.price),
                h('Icon', {
                  style: {
                    display: params.row.onSale === true ? 'inner-block' : 'none',
                    cursor: 'pointer',
                    marginLeft: '4px',
                    color: '#2b85e4'
                  },
                  props: {
                    type: 'ios-create-outline',
                    size: 22
                  },
                  on: {
                    click: () => {
                      this.$refs.editor.getList(params.row.id);
                      this.$refs.editor.modal = true;
                    }
                  }
                })
              ])
            }
          },
          {
            title: '平台',
            tooltip: true,
            key: 'onsalePlatformNames',
            align: "center",
          },
          {
            title: '供应商',
            tooltip: true,
            key: 'supplierName',
            align: "center",
          },
          {
            title: 'SKU库存',
            tooltip: true,
            align: "center",
            render: (h, params) => {
              return h('div', [
                h('span', params.row.stock),
                h('Icon', {
                  style: {
                    cursor: 'pointer',
                    marginLeft: '4px',
                    color: '#2b85e4'
                  },
                  props: {
                    type: 'ios-create-outline',
                    size: 22
                  },
                  on: {
                    click: () => {
                      console.log(params.row)
                      this.$refs.repertory.formValidate.supplierKey = params.row.supplierKey;
                      this.$refs.repertory.formValidate.stock = String(params.row.stock);
                      this.$refs.repertory.formValidate.skuInfoNo = params.row.skuInfoNo;
                      this.$refs.repertory.formValidate.skuInfoName = params.row.skuInfoName;
                      this.$refs.repertory.modal = true;
                    }
                  }
                })
              ])
            }
          },
          {
            title: '状态',
            tooltip: true,
            align: "center",
            render: (h, params) => {
              return h('div', [
                h('Badge', {
                  props: {
                    status: params.row.onSale === true ? 'success' : 'error'
                  }
                }),
                h('span', params.row.onSale === true ? '上架' : '下架')
              ])
            },
            filters: [
              {
                label: '上架',
                value: 'true'
              },
              {
                label: '下架',
                value: 'false'
              }
            ],
            filterMultiple: false,
            filterRemote(value){
              this.$parent.resetPage();
              this.$parent.state=value.length>0?value[0]:'all';
              this.$parent.getList()
            },
          },
          {
            title: '操作',
            tooltip: true,
            key: 'ProductName',
            width: 150,
            align: "center",
            render: (h, params) => {
              return h('div', [
                h('div', [
                  h('a', {
                    on: {
                      click: () => {
                        let href = this.$router.resolve({
                          path: '/examine',
                          query: {
                            id: params.row.id
                          }
                        });
                        window.open(href.href, '_blank')
                      }
                    }
                  }, '查看'),
                  h('Divider', {
                    props: {
                      type: 'vertical'
                    }
                  }),
                  h('Poptip', {
                    props: {
                      confirm: true,
                      transfer: true,
                      title: '确定下架该商品？',
                    },
                    on: {
                      'on-ok': () => {
                        const _this = this;
                        _this.Axios.post('/Manage/SkuInfo/batchUnSold', _this.Qs.stringify({
                          skuInfoIds: [params.row.id]
                        }, {indices: false})).then(res => {
                          if (res.data.code === 0) {
                            this.getList();
                            _this.$Message.success('下架成功！')
                          } else {
                            _this.$Message.warning(res.data.message)
                          }
                        })
                      }
                    }
                  }, [
                    h('a', {
                      style: {
                        display: params.row.onSale !== false ? 'inner-block' : 'none',
                        color: '#19be6b'
                      }
                    }, '下架')
                  ]),

                  h('a', {
                    style: {
                      display: params.row.onSale !== true ? 'inner-block' : 'none',
                      color: '#ed4014'
                    },
                    on: {
                      click: () => {
                        let href = this.$router.resolve({
                          path: '/putaway',
                          query: {
                            ids: [params.row.id]
                          }
                        });
                        window.open(href.href, '_blank')
                      }
                    }
                  }, '上架'),
                  h('Divider', {
                    props: {
                      type: 'vertical'
                    }
                  }),
                  h('Poptip', {
                    props: {
                      confirm: true,
                      transfer: true,
                      title: '确定删除该商品？',
                    },
                    on: {
                      'on-ok': () => {
                        if (params.row.onSale === true) {
                          this.$Message.warning('不能删除已上架产品')
                        } else {
                          this.Axios.post('/Manage/SkuInfo/delete', this.Qs.stringify({
                            id: params.row.id
                          })).then(res => {
                            if (res.data.code === 0) {
                              this.getList();
                              this.$Message.success('删除成功！')
                            } else {
                              this.$Message.warning(res.data.message)
                            }
                          })
                        }
                      }
                    }
                  }, [
                    h('a', '删除')
                  ]),
                ]),
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
        supplierList: [],
        priceAsc:'normal'
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
            approvalStatus: 'PASS',
            supplierId: _this.formValidate.supplierId,
            skuInfoNameLike: _this.formValidate.skuInfoNameLike,
            category1: _this.formValidate.classify[0],
            category2: _this.formValidate.classify[1],
            category3: _this.formValidate.classify[2],
            brandId: _this.formValidate.brandId,
            recycleBin: false,
            priceAsc: _this.priceAsc==='normal'?'':(_this.priceAsc==='asc'?true:false),
            onSale: _this.state === 'all' ? '' : _this.state,
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
        this.formValidate.supplierId = '';
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

      //批量下架
      batch(i) {
        const _this = this;
        if (_this.selection.length > 0) {
          _this.Axios.post('/Manage/SkuInfo/batchUnSold', _this.Qs.stringify({
            skuInfoIds: _this.selection
          }, {indices: false})).then(res => {
            if (res.data.code === 0) {
              this.getList();
              _this.$Message.success('批量下架成功！')
            } else {
              _this.$Message.warning(res.data.message)
            }
          })
        } else {
          _this.$Message.warning('至少选择一个商品')
        }
      },

      //批量上架
      putaway() {
        console.log(this.selection)
        let href = this.$router.resolve({
          path: '/putaway',
          query: {
            ids: this.selection
          }
        });
        window.open(href.href, '_blank')
      },

      //获取供应商下拉
      selectList() {
        const _this = this;
        _this.Axios.get('/Manage/Supplier/selectList').then(res => {
          console.log(res.data)
          _this.supplierList = res.data.data
        })
      },

      //统计数目
      count() {
        const _this = this;
        _this.Axios.get('/Manage/SkuInfo/count1', {
          params: {
            supplierId: '1'
          }
        }).then(res => {
          _this.countList = res.data.data
        })
      },

      //排序
      sorts(i) {
        const _this = this;
        _this.priceAsc = 'normal';
        switch (i.key) {
          case "price":
            _this.priceAsc = i.order;
            break;
        }
        _this.getList();
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
      // this.selectList();
      this.count()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
