<style lang="less">
  .ivu-radio {
    line-height: normal;
  }
</style>
<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">商品分类</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        数据列表
      </p>
      <router-link target="_blank" :to="{
        path:'/addClassify',
        query:{
        parentId:$route.query.parentId,
        name:$route.query.name
        }
      }">
        <Button type="dashed" style="width:100%;margin-bottom: 16px;">添加</Button>
      </router-link>
      <Table @on-sort-change="sorts" :loading="loading1" :show-header="true" :columns="columns" :data="data"></Table>
      <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      <div style="width: 100%;text-align: center;margin-top: 15px">
        <Page @on-change="paging" :total="Number(total)" :page-size="10" show-elevator show-total/>
      </div>
    </Card>

  </div>
</template>
<script>
  import upImg from '../upImg'

  export default {
    components: {
      upImg: upImg,
    },
    data() {
      return {
        loading1: true,
        total: 0,
        start: 1,
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '分类',
            tooltip: true,
            key: 'name',
            minWidth: 120,
            align: "center",
          },
          {
            title: '级别',
            tooltip: true,
            key: 'treeLevel',
            minWidth: 120,
            align: "center",
          },
          {
            title: '商品数量',
            tooltip: true,
            key: 'productCount',
            minWidth: 120,
            align: "center"
          },
          {
            title: '排序',
            tooltip: true,
            key: 'sortsNum',
            minWidth: 120,
            align: "center",
            sortable: "custom"
          },
          {
            title: '设置',
            tooltip: true,
            key: 'ProductName',
            width: 180,
            align: "center", render: (h, params) => {
              if (this.$route.query.treeLevel === '3') {
                return h('a','暂无功能')
              } else {

                return h('div', [
                  h('a', {
                    on: {
                      click: () => {
                        let href = this.$router.resolve({
                          path: '/addClassify',
                          query: {
                            parentId: params.row.id,
                            name: params.row.name
                          }
                        });
                        window.open(href.href, '_blank')

                      }
                    }
                  }, '新增下级'),
                  h('Divider', {
                    props: {
                      type: 'vertical'
                    }
                  }),
                  h('a', {
                    on: {
                      click: () => {
                        let href = this.$router.resolve({
                          path: '/classify',
                          query: {
                            treeLevel: params.row.treeLevel + 1,   //层级
                            parentId: params.row.id,    //上级分类id
                            name: params.row.name,    //上级分类id
                          }
                        });
                        window.open(href.href, '_blank')
                      }
                    }
                  }, '查看下级'),
                ])
              }
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
                        path: '/addClassify',
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
                    title: '确定删除该分类？',
                  },
                  on: {
                    'on-ok': () => {
                      const _this = this;
                      _this.Axios.post('/Manage/Category/deleteCategory', _this.Qs.stringify({
                        id: params.row.id
                      }, {indices: false})).then(res => {
                        if (res.data.code === 0) {
                          _this.getClassify();
                          _this.$Message.success('删除成功')
                        } else {
                          _this.$Message.warning(res.data.message)
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
        sortsNum: 'normal',
      }
    },
    methods: {
      //获取分类列表
      getClassify() {
        const _this = this;
        _this.loading1 = true;
        _this.Axios.get('/Manage/Category/pageList', {
          params: {
            start: _this.start - 1,
            size: 10,
            treeLevel: _this.$route.query.treeLevel ? _this.$route.query.treeLevel : '1',   //层级
            parentId: _this.$route.query.parentId ? _this.$route.query.parentId : '',    //上级分类id
            sortsNumAsc: _this.sortsNum === 'normal' ? '' : (_this.sortsNum === 'asc' ? true : false),     //true 升序  false 降序
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
        this.getClassify()
      },

      //排序
      sorts(i) {
        const _this = this;
        switch (i.key) {
          case "sortsNum":
            _this.sortsNum = i.order;
            break;
        }
        _this.getClassify();
      }
    },
    mounted() {
      this.getClassify()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .ivu-tree li ul {
    padding: 0 0 0 60px;
  }
</style>
