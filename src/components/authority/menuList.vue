<template>
  <div class="content">
    <Card style="border:none;margin-bottom: 16px;">
      <div class="ivu-page-header-title">菜单管理</div>
      <div class="ivu-page-header-content">标准的列表，包含增删改查等基础操作。</div>
    </Card>
    <div style="padding: 0 20px 16px 20px">
      <Card>
        <Row style="text-align: center;">
          <Col style="padding: 16px 0;" :xs="24" :md="8">
            进行中的任务
            <p style="font-size: 24px">10 个任务</p>
          </Col>
          <Col style="padding: 16px 0;" :xs="24" :md="8">
            剩余任务
            <p style="font-size: 24px">3 个任务</p>
          </Col>
          <Col style="padding: 16px 0;" :xs="24" :md="8">
            任务总耗时
            <p style="font-size: 24px">120 个小时</p>
          </Col>
        </Row>
      </Card>
    </div>
    <Card :style="{margin: '0 20px 20px 20px', background: '#fff',height:'auto'}">
      <Spin fix v-if="loading"></Spin>
      <p slot="title">
        基础列表
      </p>
      <a href="#" slot="extra" @click.prevent="changeLimit">
        <Icon type="ios-loop-strong"></Icon>
        Change
      </a>
      <Button @click="addMenu" type="dashed" style="width: 100%;margin-bottom: 16px;">添加</Button>
      <Table :show-header="true" :columns="columns" :data="data"></Table>
      <div style="width: 100%;height: 2px;background: #ffffff;margin-top: -1px;z-index: 3;position: relative"></div>
    </Card>
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
  import expandRow from './menu-expand.vue';
  export default {
    components: {expandRow},
    data() {
      return {
        modal_loading:false,
        id: '',
        status: '添加',
        module: '',
        addAccount: false,
        loading: true,
        columns: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row.children,
                  getMenu: this.getMenu,
                  getChild: this.getChild,
                }
              })
            }
          },
          {
            title: '菜单名称',
            key: 'menuName',
            minWidth: 88,
            align: "center",
          },
          {
            title: '菜单类型',
            key: 'age',
            minWidth: 88,
            align: "center",
            render: (h, params) => {
              return h('div', params.row.menuType.name)
            }
          },
          {
            title: '唯一标识',
            key: 'numb',
            minWidth: 88,
            align: "center",
          },
          {
            title: '操作',
            align: "center",
            maxWidth: 200,
            minWidth: 134,
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
                    title: '确定删除该菜单？',
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
          }
        ],
        data: [],
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
                  _this.getMenuList();
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

      //添加菜单
      addMenu() {
        this.id = '';
        this.status = '添加';
        this.handleReset('formValidate');
        this.formValidate.menuUrl = '';
        this.addAccount = true;
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },

      //获取菜单列表
      getMenuList() {
        const _this = this;
        _this.loading = true;
        _this.Axios.get('/Manage/Menu/tree').then(res => {
          if (res.data.code === 0) {
            _this.data = res.data.data;
          } else {
            _this.$Message.error(res.data.message)
          }
          _this.loading = false;
        })
      }
    },
    mounted() {
      this.getMenuList()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .swiper-container {
    width: 100%;
  }
</style>
