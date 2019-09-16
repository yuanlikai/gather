<style lang="less">
  .ivu-tree li ul {
    padding: 0 0 0 60px;
  }

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
      <Button type="dashed" style="width: 100%;margin-bottom: 16px;">添加</Button>
      <Table :loading="loading1" :show-header="true" :columns="columns" :data="data"></Table>
      <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      <div style="width: 100%;text-align: center;margin-top: 15px">
        <Page @on-change="paging" :total="total" :page-size="10" show-elevator show-total/>
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
        loading1:true,
        total:0,
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
            align: "center"
          },
          {
            title: '设置',
            tooltip: true,
            key: 'ProductName',
            width: 210,
            align: "center", render: (h, params) => {
              return h('div', [
                h('a', {
                  style: {
                    height: '12px',
                    marginRight: '5px',
                    paddingRight: '5px',
                    borderRight: '1px solid #e8eaec'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '新增下级'),
                h('a', {
                  style: {
                    height: '12px',
                    marginRight: '5px',
                    paddingRight: '5px',
                    borderRight: '1px solid #e8eaec'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '查看下级'),
                h('a', {
                  on: {
                    click: () => {

                    }
                  }
                }, '转移商品'),
              ])
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
                  style: {
                    height: '12px',
                    marginRight: '5px',
                    paddingRight: '5px',
                    borderRight: '1px solid #e8eaec'
                  },
                  on: {
                    click: () => {
                      this.status = '修改';
                      this.addAccount = true;
                      this.id = params.row.id;
                      this.formValidate.menuUrl = '';
                      this.formValidate.numb = params.row.numb;
                      this.formValidate.menuName = params.row.menuName;
                      this.module = '《' + params.row.menuName + '》';
                    }
                  }
                }, '编辑'),

                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '确定删除该品牌？',
                  },
                  on: {
                    'on-ok': () => {
                      const _this = this;
                      _this.Axios.post('/Manage/Menu/deleteMenus', _this.Qs.stringify({
                        id: params.row.id
                      }, {indices: false})).then(res => {
                        if (res.data.code === 0) {
                          _this.getMenuList();
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
      }
    },
    methods: {

      //获取分类列表
      getClassify() {
        const _this = this;
        _this.Axios.get('/Manage/Category/pageList', {
          params: {
            treeLevel: '1',   //层级
            parentId: '',    //上级分类id
          }
        }).then(res => {
          _this.data = res.data.data.content
          console.log(res.data.data.content)
          _this.loading1 = false;
          _this.total = Number(res.data.data.totalElements)
        })
      },

      // 分页
      paging(i) {
        this.start = i;
      },

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
