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
            <FormItem label="商品分类：" prop="classify">
              <Cascader v-model="formValidate.classify" :data="treeData" @on-change="screen"></Cascader>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="商品品牌：" prop="brandNameLike">
              <Select v-model="formValidate.brandId" @on-change="resetPage();getList()" clearable>
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
    <Modal v-model="modal" width="500">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>上架平台</span>
      </p>
      <div>
        <Row style="background:#eee;padding:10px">
          <Col span="11">
            <Card :bordered="false">
              <p slot="title">已上架平台</p>
              <p v-for="(item,index) in onsalePlatform.onsalePlatforms" :key="index">{{item}}</p>
            </Card>
          </Col>
          <Col span="11" offset="2">
            <Card shadow>
              <p slot="title">可上架平台</p>
              <p v-for="(item,index) in onsalePlatform.canOnsalePlatforms" :key="index">{{item}}</p>
            </Card>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="modal=false">确定</Button>
      </div>
    </Modal>
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
        modal: false,
        state: 'all',
        loading1: true,
        countList: {},
        onsalePlatform: {},
        formValidate: {
          skuInfoNameLike: '',
          skuInfoNoLike: '',
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
            minWidth: 150,
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
            title: 'SKU编号',
            tooltip: true,
            minWidth: 70,
            key: 'skuInfoNo',
            align: "center",
          },
          {
            title: '价格',
            tooltip: true,
            key: 'price',
            minWidth: 70,
            sortable: "custom",
            align: "center",
            render: (h, params) => {
              return h('div', [
                h(params.row.onSale ? 'a' : 'p', {
                  style: {
                    marginTop: '2px'
                  },
                  on: {
                    click: () => {
                      if (params.row.onSale) {
                        this.$refs.editor.getList(params.row.id);
                        this.$refs.editor.modal = true;
                      }
                    }
                  }
                }, params.row.price),
              ])
            }
          },
          {
            title: '上架平台',
            minWidth: 70,
            tooltip: true,
            key: 'onsalePCount',
            align: "center",
            render: (h, params) => {
              return h('a', {
                on: {
                  'click': () => {
                    this.Axios.get('/Manage/SkuInfo/onsalePlatform', {
                      params: {
                        id: params.row.id
                      }
                    }).then(res => {
                      this.onsalePlatform = res.data.data;
                      this.modal = true
                    });
                  }
                }
              }, params.row.onsalePCount + ' / ' + params.row.canOnsalePCount)
            }
          },
          {
            title: '供应商',
            minWidth: 70,
            tooltip: true,
            key: 'supplierName',
            align: "center",
          },
          {
            title: '发货',
            tooltip: true,
            minWidth: 70,
            key: 'stockType',
            align: "center",
            render: (h, params) => {
              if (params.row.stockType === "DF") {
                return h('p', '代发')
              } else if (params.row.stockType === "NHJ") {
                return h('p', '南华街')
              } else if (params.row.stockType === "JS") {
                return h('p', '嘉善')
              } else if (params.row.stockType === "GYS") {
                return h('p', '供应商')
              } else {
                return h('p', '其他')
              }
            },
            filters: [
              {
                label: '代发',
                value: 'DF'
              },
              {
                label: '供应商',
                value: 'GYS'
              },
              {
                label: '南华街',
                value: 'NHJ'
              },
              {
                label: '嘉善',
                value: 'JS'
              },
              {
                label: '其他',
                value: 'OTHER'
              }
            ],
            filterMultiple: false,
            filterRemote(value) {
              this.$parent.resetPage();
              this.$parent.stockType = value.length > 0 ? value[0] : '';
              this.$parent.getList()
            },
          },
          {
            title: '维护方式',
            tooltip: true,
            minWidth: 70,
            key: 'updMethod',
            align: "center",
            render: (h, params) => {
              if (params.row.updMethod === "MANUAL") {
                return h('p', '手动')
              } else if (params.row.updMethod === "AUTO") {
                return h('p', '自动')
              } else if (params.row.updMethod === "BATCH") {
                return h('p', '回滚')
              }
            }
          },
          {
            title: 'SKU库存',
            tooltip: true,
            minWidth: 70,
            align: "center",
            render: (h, params) => {
              return h('div', [
                h('a', {
                  style: {
                    width: '100%',
                    display: 'block'
                  },
                  on: {
                    click: () => {
                      this.$refs.repertory.formValidate.supplierKey = params.row.supplierKey;
                      this.$refs.repertory.formValidate.stock = String(params.row.stock);
                      this.$refs.repertory.formValidate.skuInfoNo = params.row.skuInfoNo;
                      this.$refs.repertory.formValidate.skuInfoName = params.row.skuInfoName;
                      this.$refs.repertory.modal = true;
                    }
                  }
                }, params.row.stock),
              ])
            }
          },
          {
            title: '状态',
            tooltip: true,
            minWidth: 70,
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
            filterRemote(value) {
              this.$parent.resetPage();
              this.$parent.state = value.length > 0 ? value[0] : 'all';
              this.$parent.getList()
            },
          },
          {
            title: '操作',
            tooltip: true,
            key: 'ProductName',
            width: 188,
            align: "center",
            render: (h, params) => {
              let a;
              if (params.row.onSale === true) {
                a = h('Poptip', {
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
                          _this.getList();
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
                      color: '#ed4014'
                    }
                  }, '下架')
                ])
              } else {
                a = h('a', {
                  style: {
                    color: '#19be6b',
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
                }, '上架')
              }
              return h('div', [
                h('div', [
                  a,
                  h('Divider', {
                    props: {
                      type: 'vertical'
                    }
                  }),
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
                  h('a', {
                    on: {
                      click: () => {
                        let href = this.$router.resolve({
                          path: '/productLog',
                          query: {
                            id: params.row.id
                          }
                        });
                        window.open(href.href, '_blank')
                      }
                    }
                  }, '日志'),
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
        priceAsc: 'normal',
        stockType: ''
      }
    },
    methods: {

      //赛选
      screen(i) {
        this.formValidate.classify = i;
        this.resetPage();
        this.getList()
      },

      //获取商品列表
      getList() {
        const _this = this;
        _this.loading1 = true;
        _this.Axios.get('/Manage/SkuInfo/supplierSkuPageList', {
          params: {
            start: _this.start - 1,
            size: 10,
            approvalStatus: 'PASS',
            stockType: _this.stockType,
            supplierId: _this.formValidate.supplierId,
            skuInfoNameLike: _this.formValidate.skuInfoNameLike,
            skuInfoNoLike: _this.formValidate.skuInfoNoLike,
            category1: _this.formValidate.classify[0],
            category2: _this.formValidate.classify[1],
            category3: _this.formValidate.classify[2],
            brandId: _this.formValidate.brandId,
            recycleBin: false,
            haveOnsaleCount: true,
            priceAsc: _this.priceAsc === 'normal' ? '' : (_this.priceAsc === 'asc' ? true : false),
            onSale: _this.state === 'all' ? '' : _this.state,
          }
        }).then(res => {
          console.log(res.data)
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
        _this.Axios.get('/GetSupList.ashx').then(res => {
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
