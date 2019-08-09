<style scoped>
  .expand-row {
    margin-bottom: 16px;
  }

  .ivu-table-border td, .ivu-table-border th{
    border-right: none;
  }
</style>
<template>
  <div>
    <Table border :columns="columns1" :data="data1"></Table>
    <div style="width: 100%;height: 1px;background: #ffffff;margin-top: -1px;z-index: 3;position: relative"></div>
  </div>
</template>
<script>
  export default {
    props: ['row', 'getMenu', 'getChild'],
    data() {
      return {
        columns1: [
          {
            type: 'index',
            align: 'center',
            width: 50,
          },
          {
            title: '菜单名称',
            key: 'menuName',
            minWidth: 88,
          },
          {
            title: '菜单类型',
            key: 'numb',
            minWidth: 88,
            render: (h, params) => {
              return h('p', params.row.menuType.name)
            }
          },
          {
            title: '地址',
            key: 'menuUrl',
          minWidth: 88,
          },
          {
            title: '唯一标识',
            key: 'numb',
            minWidth: 88,
          },
          {
            title: '操作',
            minWidth: 88,
            align: 'center',
            render: (h, params) => {
              return h('div', [

                h('Icon', {
                  props: {
                    type: 'ios-create',
                    size: '20'
                  },
                  style: {
                    cursor: 'pointer',
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.getChild({
                        id: params.row.id,
                        numb: params.row.numb,
                        menuUrl: params.row.menuUrl,
                        menuName: params.row.menuName
                      })

                    }
                  }
                }),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    placement: "top",
                    title: '确定删除该角色？',
                  },
                  on: {
                    'on-ok': () => {
                      const _this = this;
                      _this.Axios.post('/Manage/Menu/deleteMenus', _this.Qs.stringify({
                        id: params.row.id
                      }, {indices: false})).then(res => {
                        if (res.data.code === 0) {
                          _this.data1.splice(params.row._index, 1);
                          _this.$Message.success('删除成功')
                        } else {
                          _this.$Message.error(res.data.message)
                        }
                      })
                    }
                  }
                }, [
                  h('Icon', {
                    props: {
                      type: 'md-trash',
                      size: '20'
                    },
                    style: {
                      cursor: 'pointer',
                    }
                  })
                ])
              ])

            }
          }
        ],
        data1: this.row.reverse()
      }
    },
    methods: {},
    mounted() {
    }
  };
</script>
<style scoped>
  .expand-row {
    margin-bottom: 16px;
  }

  .ivu-table-border td, .ivu-table-border th{
    border-right: none;
  }
</style>
