<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">供应商设置</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        筛选查询
      </p>
      <Form ref="formValidate" :model="formValidate" :label-width="80">
        <Row :gutter="30">
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="企业名：" prop="supplierNameLike">
              <Input v-model="formValidate.supplierNameLike" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="简称：" prop="abbrSupplierNameLike">
              <Input v-model="formValidate.abbrSupplierNameLike" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="代号：" prop="supplierNoLike">
              <Input v-model="formValidate.supplierNoLike" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="状态：" prop="locked">
              <Select v-model="formValidate.locked" @on-change="resetPage();getList()" clearable>
                <Option value="false">启用</Option>
                <Option value="true">停用</Option>
              </Select>
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
      <router-link target="_blank" :to="{
        path:'/addSupplier',
        query:{
        parentId:$route.query.parentId,
        name:$route.query.name
        }
      }">
        <Button type="dashed" style="width:100%;margin-bottom: 16px;">添加</Button>
      </router-link>
      <Table  :loading="loading1" @on-sort-change="sortData" :show-header="true"
             :columns="columns"
             :data="data"></Table>
      <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      <div style="width: 100%;text-align: center;margin-top: 15px">
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
          locked: '',
          supplierNameLike: '',   //名称模糊搜索
          abbrSupplierNameLike: '',   //简称模糊搜索
          supplierNoLike: '',   //代码模糊搜索
          productCountAsc: 'normal',   //关联产品数量 true为升序
          productLimAsc: 'normal',   //产品限制 true为升序lidate.brandId,
          brandCountAsc:'normal'
        },
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '企业名',
            tooltip: true,
            align: "center",
            key: 'supplierName',
          },
          {
            title: '简称',
            tooltip: true,
            align: "center",
            key: 'abbrSupplierName',
          },
          {
            title: '字母编号',
            tooltip: true,
            key: 'supplierNo',
            align: "center",
          },
          {
            title: '商品数',
            align: "center",
            key: 'productCount',
            sortable: "custom"
          },
          {
            title: '关联平台',
            tooltip: true,
            key: 'abbrPlatformNames',
            align: "center",
          },
          {
            title: 'SKU数量限制',
            tooltip: true,
            key: 'productLim',
            align: "center",
            sortable: "custom"
          },
          {
            title: '关联品牌',
            tooltip: true,
            key: 'brandCount',
            align: "center",
            sortable: "custom"
          },
          {
            title: '状态',
            tooltip: true,
            key: 'locked',
            align: "center",
            render: (h, params) => {
              return h('i-switch', {
                  props: {
                    value: !params.row.locked,
                    size: 'small'
                  },
                  on: {
                    'on-change': (i) => {
                      this.Axios.post('/Manage/Supplier/updateLock', this.Qs.stringify({
                        id: params.row.id,   //品牌id
                        lock: !params.row.locked,   //是否显示 true为显示 false为隐藏
                      })).then(res => {
                        if (res.data.code === 0) {
                          this.getList()
                        } else {
                          this.$Message.warning(res.data.message)
                        }
                      });
                    }
                  }
                },

                //   [
                //   h('span', {
                //     slot: "open"
                //   }, '是'),
                //   h('span', {
                //     slot: "close"
                //   }, '否')
                // ]

              )
            }
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
                  // h('a', {
                  //   on: {
                  //     click: () => {
                  //       let href = this.$router.resolve({
                  //         path: '/addSupplier',
                  //         query: {
                  //           id: params.row.id,
                  //           disabled:true
                  //         }
                  //       });
                  //       window.open(href.href, '_blank')
                  //     }
                  //   }
                  // }, '查看'),
                  // h('Divider', {
                  //   props: {
                  //     type: 'vertical'
                  //   }
                  // }),
                  h('a', {
                    on: {
                      click: () => {
                        let href = this.$router.resolve({
                          path: '/addSupplier',
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
                          path: '/relevance',
                          query: {
                            id: params.row.id
                          }
                        });
                        window.open(href.href, '_blank')
                      }
                    }
                  }, '关联'),
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
      }
    },
    methods: {
      //赛选
      screen(i) {
        this.resetPage();
        this.getList()
      },

      //获取品牌列表
      getList() {
        const _this = this;
        _this.loading1 = true;
        _this.Axios.get('/Manage/Supplier/pageList', {
          params: {
            start: _this.start - 1,
            size: 10,
            supplierNameLike: _this.formValidate.supplierNameLike,   //名称模糊搜索
            abbrSupplierNameLike: _this.formValidate.abbrSupplierNameLike,   //简称模糊搜索
            supplierNoLike: _this.formValidate.supplierNoLike,   //代码模糊搜索
            locked: _this.formValidate.locked,                    //状态 true为停用 false为正常
            productCountAsc: _this.formValidate.productCountAsc==='normal'?'':(_this.formValidate.productCountAsc==='asc'?'true':'false'),   //关联产品数量 true为升序
            productLimAsc: _this.formValidate.productLimAsc==='normal'?'':(_this.formValidate.productLimAsc==='asc'?'true':'false'),   //产品限制 true为升序lidate.brandId,
            brandCountAsc: _this.formValidate.brandCountAsc==='normal'?'':(_this.formValidate.brandCountAsc==='asc'?'true':'false'),   //品牌
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

      //排序
      sortData(i) {
        const _this = this;
        _this.loading1 = true;
        _this.formValidate.productCountAsc='normal';
        _this.formValidate.productLimAsc='normal';
        _this.formValidate.brandCountAsc='normal';
        _this.formValidate.productCountAsc= 'normal';
        switch (i.key) {
          case "productCount":
            _this.formValidate.productCountAsc = i.order;
            break;
          case "productLim":
            _this.formValidate.productLimAsc = i.order;
            break;
          case "brandCount":
            _this.formValidate.brandCountAsc = i.order;
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
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
