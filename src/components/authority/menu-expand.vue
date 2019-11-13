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

    <Modal v-model="addAccount" width="300">
      <p slot="header">
        <Icon type="ios-information-circle"></Icon>
        <span>{{module}} {{id===''?status+'模块':status+'菜单'}}</span>
      </p>
      <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="70">
          <FormItem label="菜单名称" prop="menuName">
            <Input :maxlength="10" v-model="formValidate.menuName" placeholder="请输入菜单名称"></Input>
          </FormItem>
          <FormItem v-if="formValidate.menuUrl===''?(id!==''&&status!=='修改'):true" label="菜单路径" prop="menuUrl">
            <Input :maxlength="30" v-model="formValidate.menuUrl" placeholder="请输入菜单路径"></Input>
          </FormItem>
          <FormItem label="唯一标识" prop="numb">
            <Input :maxlength="10" :loading="modal_loading" v-model="formValidate.numb" placeholder="请输入唯一标识"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long @click="handleSubmit('formValidate')">
          {{status}}
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import expandRow from './menu-expand1.vue';
  export default {
    components: {expandRow},
    props: ['row', 'getMenu', 'getChild','getMenuList'],
    data() {
      return {
        id:'',
        status:'',
        module:'',
        addAccount:false,
        modal_loading:false,
        formValidate: {
          menuName: '',       //角色名称
          menuUrl: '',       //角色名称
          numb: '',       //角色名称
        },
        ruleValidate: {
          menuName: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          menuUrl: [
            {required: true, message: '请输入路径', trigger: 'blur'}
          ],
          numb: [
            {required: true, message: '请输入唯一标识', trigger: 'blur'}
          ]
        },
        columns1: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row.children,
                  getMenu: this.getMenu,
                  getChild: this.getChild,
                  getMenuList: this.getMenuList,
                }
              })
            }
          },
          {
            title: '菜单名称',
            key: 'menuName',
            align: 'center',
            minWidth: 88,
          },
          {
            title: '菜单类型',
            key: 'numb',
            align: 'center',
            minWidth: 88,
            render: (h, params) => {
              return h('p', params.row.menuType.name)
            }
          },
          {
            title: '唯一标识',
            key: 'numb',
            align: 'center',
            minWidth: 88,
          },
          {
            title: '操作',
            minWidth: 88,
            align: 'center',
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
                      this.status = '添加';
                      this.handleReset('formValidate');
                      this.addAccount = true;
                      this.id = params.row.id;
                      this.module = '《' + params.row.menuName + '》';
                    }
                  }
                }, '添加'),
                h('a', {
                  props: {
                    type: 'ios-create',
                    size: '20'
                  },
                  style: {
                    height: '12px',
                    marginRight: '5px',
                    paddingRight: '5px',
                    borderRight: '1px solid #e8eaec'
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
                },'修改'),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    placement: "top",
                    title: '确定删除该菜单？',
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
                  h('a', {
                    props: {
                      type: 'md-trash',
                      size: '20'
                    },
                    style: {
                      cursor: 'pointer',
                    }
                  },'刪除')
                ])
              ])

            }
          }
        ],
        data1: this.row.reverse()
      }
    },
    methods: {
      // 添加菜单
      handleSubmit(name) {
        const _this = this;
        _this.$refs[name].validate((valid) => {
          if (valid) {
            _this.modal_loading = true;
            if (_this.status === '修改') {
              _this.Axios.post('/Manage/Menu/updateMenu', _this.Qs.stringify({
                id: _this.id,  //上级id 如果为模块级 不需要传入
                menuName: _this.formValidate.menuName,  //菜单名称,
                menuUrl:_this.formValidate.menuUrl,
                numb: _this.formValidate.numb,  //前端用
              })).then(res => {
                if (res.data.code === 0) {
                  _this.addAccount = false;
                } else {
                  _this.$Message.error(res.data.message)
                }
                _this.modal_loading = false
              })

            } else {
              _this.Axios.post('/Manage/Menu/addMenu', _this.Qs.stringify({
                parentId: _this.id !== '' ? this.id : '',  //上级id 如果为模块级 不需要传入
                menuName: _this.formValidate.menuName,  //菜单名称
                menuUrl: _this.formValidate.menuUrl,  //菜单路径
                numb: _this.formValidate.numb,  //前端用
              })).then(res => {
                if (res.data.code === 0) {
                  _this.getMenuList();
                  _this.addAccount = false;
                } else {
                  _this.$Message.error(res.data.message)
                }
                _this.modal_loading = false
              })
            }
          } else {
            _this.$Message.error('有必填项未填写!');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
    },
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
