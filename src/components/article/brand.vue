<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">品牌管理</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        筛选查询
      </p>
      <Form ref="formValidate" :model="formValidate" :label-width="80">
        <Row :gutter="30">
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="品牌名称：" prop="brandNameLike">
              <Input v-model="formValidate.brandNameLike" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="24" :lg="8" style="">
            <FormItem>
              <Button type="primary" style="margin-right: 6px" @click="handleSubmit('formValidate')">查询</Button>
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
      <Button to="/#/addBrand" target="_blank" type="dashed" style="width: 100%;margin-bottom: 16px;">添加</Button>
      <Table @on-selection-change="choice" @on-sort-change="sorts" :loading="loading1" :show-header="true"
             :columns="columns"
             :data="data"></Table>
      <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      <div style="width: 100%;text-align: right;margin-top: 15px">
        <ButtonGroup style="float: left">
          <Button type="dashed" @click="batch('true')">批量显示</Button>
          <Button type="dashed" @click="batch('false')">批量隐藏</Button>
        </ButtonGroup>
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
        data1: [],
        total: 0,
        formValidate: {
          brandNameLike: ''
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '品牌名称',
            tooltip: true,
            key: 'brandName',
            minWidth: 120,
            align: "center",
          },
          {
            title: '品牌简称',
            tooltip: true,
            key: 'abbrBrandName',
            minWidth: 120,
            align: "center",
          },
          {
            title: '排序ID',
            tooltip: true,
            key: 'sortsNum',
            minWidth: 120,
            align: "center",
            sortable: "custom"
          },
          {
            title: '关联供应商',
            tooltip: true,
            key: 'supplierCount',
            minWidth: 120,
            align: "center",
            sortable: "custom"
          },
          {
            title: '是否显示',
            tooltip: true,
            key: 'display',
            minWidth: 120,
            align: "center",
            render: (h, params) => {
              return h('i-switch', {
                props: {
                  value: params.row.display,
                  size:'small'
                },
                on: {
                  'on-change': (i) => {
                    this.Axios.post('/Manage/Brand/updateDisplay', this.Qs.stringify({
                      id: params.row.id,   //品牌id
                      display: !params.row.display,   //是否显示 true为显示 false为隐藏
                    })).then(res => {
                      if(res.data.code===0){
                        this.getBrand()
                      }else {
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
            width: 160,
            align: "center",
            render: (h, params) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      let href = this.$router.resolve({
                        path: '/addBrand',
                        query: {
                          id: params.row.id
                        }
                      });
                      window.open(href.href, '_blank')
                    }
                  }
                }, '编辑'),
                h('Divider',{
                  props:{
                    type:'vertical'
                  }
                }),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '确定删除该品牌？',
                  },
                  on: {
                    'on-ok': () => {
                      const _this = this;
                      _this.Axios.post('/Manage/Brand/deleteBrand', _this.Qs.stringify({
                        id: params.row.id
                      })).then(res => {
                        if (res.data.code === 0) {
                          _this.getBrand();
                          _this.$Message.success('删除成功')
                        } else {
                          _this.$Message.error(res.data.message)
                        }
                      })
                    }
                  }
                }, [
                  h('a', '删除')
                ]),
              ])
            }
          },
        ],
        data: [],
        start: 1,
        selection: [],
        sortsNum:'normal',
        supplierCount:'normal'
      }
    },
    methods: {
      //获取品牌列表
      getBrand() {
        const _this = this;
        _this.loading1 = true;
        _this.Axios.get('/Manage/Brand/pageList', {
          params: {
            start: _this.start - 1,
            size: 10,
            brandNameLike: _this.formValidate.brandNameLike,  //品牌名称模糊搜搜
            sortsNumAsc: _this.sortsNum==='normal'?'':(_this.sortsNum==='asc'?true:false),                //排序编号true升序 false为降序
            supplierCountAsc: _this.sortsNum==='normal'?'':(_this.sortsNum==='asc'?true:false),           //供应商关联排序 true为升序
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
          _this.Axios.post('/Manage/Brand/batchUpdateDisplay', _this.Qs.stringify({
            brandIds: _this.selection,   //品牌id
            display: i,    //是否显示 true为显示 false为隐藏
          }, {indices: false})).then(res => {
            _this.selection = [];
            if (res.data.code === 0) {
              _this.getBrand();
              _this.$Message.success('批量操作成功')
            } else {
              _this.$Message.warning(res.data.message)
            }
          })
        } else {
          _this.$Message.warning('至少选择一个平台')
        }
      },

      //排序
      sorts(i) {
        const _this = this;
        _this.loading1 = true;
        _this.sortsNum = 'normal';
        _this.supplierCount = 'normal';
        switch (i.key) {
          case "sortsNum":
            _this.sortsNum = i.order;
            break;
          case "supplierCount":
            _this.supplierCount = i.order;
            break;
        }
        _this.getBrand();
      },

      // 分页
      paging(i) {
        this.start = i;
        this.getBrand()
      },

      //搜索品牌
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          this.resetPage();
          this.getBrand()
        })
      },

      //重置搜索
      handleReset(name) {
        this.$refs[name].resetFields();
        this.resetPage();
        this.getBrand()
      },

      resetPage() {
        this.start = 1;
        this.total = 0;
      }
    },
    mounted() {
      this.getBrand();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
