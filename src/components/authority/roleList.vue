<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">角色管理</div>
    </Card>
    <!--<div style="padding: 0 20px 16px 20px">-->
      <!--<Card>-->
        <!--<Row style="text-align: center;">-->
          <!--<Col style="padding: 16px 0;" :xs="24" :md="8">-->
            <!--已添加的角色-->
            <!--<p style="font-size: 24px">10 个角色</p>-->
          <!--</Col>-->
          <!--<Col style="padding: 16px 0;" :xs="24" :md="8">-->
            <!--剩余任务-->
            <!--<p style="font-size: 24px">3 个任务</p>-->
          <!--</Col>-->
          <!--<Col style="padding: 16px 0;" :xs="24" :md="8">-->
            <!--任务总耗时-->
            <!--<p style="font-size: 24px">120 个小时</p>-->
          <!--</Col>-->
        <!--</Row>-->
      <!--</Card>-->
    <!--</div>-->

    <Card :style="{margin: '0 20px 20px 20px', background: '#fff',height:'auto'}">
      <Spin fix v-if="loading"></Spin>
      <p slot="title">
        基础列表
      </p>
      <Button @click="addRole() "type="dashed" style="width: 100%;margin-bottom: 16px;">添加</Button>
      <Table :show-header="true" :columns="columns" :data="data"></Table>
      <div style="width: 100%;height: 2px;background: #ffffff;margin-top: -1px;z-index: 3;position: relative"></div>
    </Card>
    <Modal v-model="addAccount" width="300">
      <p slot="header">
        <Icon type="ios-information-circle"></Icon>
        <span>{{id===''?'添加':'修改'}}角色</span>
      </p>
      <div>
        <Spin size="large" fix v-if="spinShow"></Spin>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="70">
          <FormItem label="角色名称" prop="roleName">
            <Input :maxlength="10" v-model="formValidate.roleName" placeholder="请输入角色名称"></Input>
          </FormItem>
          <FormItem label="角色编号" prop="roleCode">
            <Input :disabled="id!==''?true:false" :maxlength="10" v-model="formValidate.roleCode"
                   placeholder="请输入角色编号"></Input>
          </FormItem>
          <FormItem label="角色说明" prop="remark">
            <Input type="textarea" :maxlength="50" v-model="formValidate.remark" placeholder="请输入角色说明"></Input>
          </FormItem>
          <FormItem :label-width="100" label="供应商是否专属" prop="supplierExclusive">
            <i-switch :disabled="id!==''?true:false" v-model="formValidate.supplierExclusive">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="关联菜单" prop="menuIds">
            <Card>
              <Tree @on-check-change="checkTree" ref="tree" :data="roleTree" show-checkbox></Tree>
            </Card>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="success" size="large" long :loading="modal_loading" @click="handleSubmit('formValidate')">
          {{id===''?'添加':'修改'}}
        </Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data() {
      // 角色名称验证
      const roleName = (rule, value, callback) => {
        const _this = this;
        if (value.length < 1) {
          callback(new Error('请选择角色'))
        } else {
          _this.Axios.get('/Manage/Role/checkRoleName', {
            params: {
              id: _this.id !== '' ? _this.id : '',
              roleName: value //角色名
            }
          }).then(res => {
            if (res.data.code === 0) {
              callback()
            } else {
              callback(new Error(res.data.message))
            }
          })
        }
      };
      // 角色编号验证
      const roleCode = (rule, value, callback) => {
        const _this = this;
        if (value.length < 1) {
          callback(new Error('请选择角色'))
        } else {
          _this.Axios.get('/Manage/Role/checkRoleCode', {
            params: {
              id: _this.id !== '' ? _this.id : '',
              roleCode: value //角色名
            }
          }).then(res => {
            if (res.data.code === 0) {
              callback()
            } else {
              callback(new Error(res.data.message))
            }
          })
        }
      };
      // 角色菜单验证
      const roleMenu = (rule, value, callback) => {
        if (this.cheTree.length < 1) {
          callback(new Error('请关联菜单'))
        } else {
          callback()
        }
      };
      return {
        spinShow: false,
        roleTree: [],
        cheTree: [],
        formValidate: {
          roleName: '',       //角色名称，
          roleCode: '',        //角色编号，
          remark: '',           //角色说明
          supplierExclusive: false,  //是否供应商专属,
          menuIds: false,
        },
        data1: [],
        like: '',
        ruleValidate: {
          roleName: [
            {validator: roleName, required: true, trigger: 'blur'}
          ],
          roleCode: [
            {validator: roleCode, required: true, trigger: 'blur'}
          ],
          menuIds: [
            {validator: roleMenu, required: true, trigger: 'change'}
          ],
        },
        id: '',
        addAccount: false,
        total: 0,
        loading: true,
        modal_loading: false,
        columns: [
          {
            type: 'index',
            width: 50,
            align: 'center'
          },
          {
            title: '角色名称',
            minWidth: 88,
            key: 'roleName',
            align: 'center'
          },
          {
            title: '角色备注',
            minWidth: 88,
            key: 'remark',
            align: 'center'
          },
          {
            title: '供应商是否专属',
            minWidth: 88,
            key: 'status',
            align: 'center',
            render: (h, params) => {
              return h('p', params.row.supplierExclusive === true ? '是' : '否')
            }
          },
          {
            title: '最后修改时间',
            minWidth: 88,
            key: 'timeModified',
            align: 'center',
            render: (h, params) => {
              return h('p', this.riqi(params.row.timeModified))
            }
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 100,
            maxWidth: 180,
            render: (h, params) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      const _this = this;
                      _this.spinShow = true;
                      _this.addAccount = true;
                      _this.id = params.row.id;
                      _this.handleReset('formValidate');
                      _this.formValidate.remark = params.row.remark;
                      _this.formValidate.roleName = params.row.roleName;
                      _this.formValidate.roleCode = params.row.roleCode;
                      _this.formValidate.supplierExclusive = params.row.supplierExclusive;
                      _this.Axios.get('/Manage/Role/getRole', {
                        params: {
                          id: params.row.id
                        }
                      }).then(res => {
                        if (res.data.code === 0) {
                          let menu = res.data.data.menuTreeList,
                            menuList = [];
                          for (let i = 0; i < menu.length; i++) {
                            menu[i].expand = menu[i].checked === true ? true : false;
                            menu[i].checked = false;
                            menuList.push(menu[i])
                          }
                          console.log(menu);
                          _this.roleTree = menuList;
                          setTimeout(() => {
                            _this.cheTree = _this.$refs.tree.getCheckedNodes()
                          }, 1)
                        } else {
                          _this.$Message.error(res.data.message)
                        }
                        _this.spinShow = false;
                      })
                    }
                  }
                },'编辑'),
                h('Divider',{
                  props:{
                    type:'vertical'
                  }
                }),
                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    placement: "top-end",
                    offset: 13,
                    title: '确定删除该角色？',
                  },
                  on: {
                    'on-ok': () => {
                      const _this = this;
                      _this.Axios.post('/Manage/Role/deleteRole', _this.Qs.stringify({
                        ids: [params.row.id]
                      }, {indices: false})).then(res => {
                        if (res.data.code === 0) {
                          _this.getTreeList();
                          _this.$Message.success('删除成功')
                        } else {
                          _this.$Message.error(res.data.message)
                        }
                      })
                    }
                  }
                }, [
                  h('a','删除')
                ])
              ])
            }
          }
        ],
        data: []
      }
    },
    methods: {
      // 获取菜单树形结构
      getTree() {
        const _this = this;
        _this.Axios.get('/Manage/Menu/tree').then(res => {
          _this.roleTree = res.data.data;
          console.log(_this.roleTree)
        })
      },

      // 新增角色
      addRole() {
        this.getTree();
        this.id = '';
        this.handleReset('formValidate')
        this.addAccount = true
      },

      // 获取角色列表
      getTreeList() {
        const _this = this;
        _this.loading = true;
        _this.Axios.get('/Manage/Role/pageList', {
          params: {
            start: _this.start,
            size: 14,
            roleNameLike: '',
          }
        }).then(res => {
          if (res.data.code === 0) {
            _this.data = res.data.data.content
          } else {
            _this.$Message.error(res.data.message)
          }
          _this.loading = false;
          _this.total = res.data.data.totalElements;
        })
      },

      // 添加角色
      handleSubmit(name) {
        const _this = this;
        _this.$refs[name].validate((valid) => {
          if (valid) {
            _this.modal_loading = true;
            const menuIds = [];
            for (let i in _this.cheTree) {
              menuIds.push(_this.cheTree[i].id)
            }
            console.log(menuIds)
            if (_this.id === '') {
              _this.Axios.post('/Manage/Role/addRole', _this.Qs.stringify({
                roleName: _this.formValidate.roleName,        //角色名称
                roleCode: _this.formValidate.roleCode,        //角色编号
                remark: _this.formValidate.remark,            //备注
                menuIds: menuIds,             //菜单id集合
                supplierExclusive: _this.formValidate.supplierExclusive,   //是否供应商专属 true为是 需要传
              }, {indices: false})).then(res => {
                if (res.data.code === 0) {
                  _this.addAccount = false;
                  _this.getTreeList();
                  _this.$Message.success('添加成功')
                } else {
                  _this.$Message.error(res.data.message)
                }
                _this.modal_loading = false;
              })
            } else {
              _this.Axios.post('/Manage/Role/updateRole', _this.Qs.stringify({
                id: _this.id,
                roleName: _this.formValidate.roleName,        //角色名称
                roleCode: _this.formValidate.roleCode,        //角色编号
                remark: _this.formValidate.remark,            //备注
                menuIds: menuIds,                             //菜单id集合
                supplierExclusive: _this.formValidate.supplierExclusive,   //是否供应商专属 true为是 需要传
              }, {indices: false})).then(res => {
                if (res.data.code === 0) {
                  _this.addAccount = false;
                  _this.getTreeList();
                  _this.$Message.success('修改成功')
                } else {
                  _this.$Message.error(res.data.message)
                }
                _this.modal_loading = false;
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

      // 获取选中半选中树形结构
      checkTree(i) {
        console.log(this.$refs.tree.getCheckedAndIndeterminateNodes())
        this.cheTree = this.$refs.tree.getCheckedAndIndeterminateNodes();
      },

    },
    mounted() {
      this.getTreeList();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
