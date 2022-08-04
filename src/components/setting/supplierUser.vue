<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title" @click="abc">供应商用户</div>
    </Card>
    <Card :style="{margin: '0 20px 20px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        基础列表
      </p>
      <p slot="extra">
        <Icon type="ios-loop-strong"></Icon>
        <span class="users" style="margin: 3px 4px 0 0">角色:</span>
        <Select class="users" v-model="roleId" @on-change="start=0;getUser()" style="width:100px;
margin-right: 16px">
          <Option v-for="item in roleList" :value="item.id" :key="item.id">{{item.roleName}}</Option>
        </Select>
        <RadioGroup class="users" v-model="status" @on-change="start=0;getUser()" type="button">
          <Radio label="全部">全部</Radio>
          <Radio label="1">正常</Radio>
          <Radio label="0">禁用</Radio>
        </RadioGroup>
        <Input @on-enter="start=0;getUser()" v-model="value13" placeholder="用户名搜索"
               style="width: 150px;margin-left: 16px;">
          <Icon @click="start=0;getUser()" type="ios-search" slot="suffix" style="cursor: pointer"/>
        </Input>
        <Input @on-enter="start=0;getUser()" v-model="value14" placeholder="供应商搜索"
               style="width: 150px;margin-left: 16px;">
          <Icon @click="start=0;getUser()" type="ios-search" slot="suffix" style="cursor: pointer"/>
        </Input>
      </p>
      <Button @click="addUser()" type="dashed" style="width: 100%;margin-bottom: 16px;">添加</Button>
      <Row v-for="(item,index) in data" :key="index" style="padding: 12px 0;border-bottom: 1px solid #e8eaec;">
        <Col span="24" style="margin-bottom: 16px">
          <Avatar style="margin-right: 8px" src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>
          <span style="font-weight: 700">{{item.username}}</span>
        </Col>
        <Col span="24">状态：
          <Badge :status="item.status === '1' ?'success':'error'"/>
          {{item.status === '1' ? '正常' : '锁定'}}
        </Col>
        <Col span="24">姓名：{{item.name}}</Col>
        <Col span="24" v-if="item.supplierName">供应商：{{item.supplierName}}</Col>
        <Col span="24" style="margin-top: 8px">
          <Tag color="geekblue">{{item.roleNames}}</Tag>
          <Button @click="Handle(item.id)" size="small" icon="md-list" style="margin-left: 16px;">展开操作</Button>
        </Col>
        <Col span="24" style="margin-top: 16px" v-if="handleId===item.id">
          <Button
            @click="amend(item.id,item.userInfoType,item.username,item.name,item.roleIds,item.status,item.allField)"
            size="small" type="primary">修改用户
          </Button>
          <Divider type="vertical"/>
          <Poptip
            confirm
            title="确定删除该用户？"
            @on-ok="delHandle(item.username,item.id)">
            <Button size="small" type="primary">删除用户</Button>
          </Poptip>
          <Divider type="vertical"/>
          <Poptip
            confirm
            title="确定重置该用户密码？"
            @on-ok="resetPass(item.username)">
            <Button size="small" type="primary">重置密码</Button>
          </Poptip>
        </Col>
      </Row>
      <div style="width: 100%;text-align: center;margin-top: 15px">
        <Page @on-change="paging" :total="total" :page-size="5" show-elevator show-total/>
      </div>
    </Card>
    <Modal v-model="addAccount" width="300">
      <p slot="header">
        <Icon type="ios-information-circle"></Icon>
        <span>{{id===''?'添加':'修改'}}用户</span>
      </p>
      <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="70">
          <FormItem v-if="userInfoType!=='SUPPLIER'" label="用户账号" prop="username">
            <Input :disabled="id!==''" :maxlength="36" v-model="formValidate.username" placeholder="请输入账号"></Input>
          </FormItem>
          <FormItem v-if="id===''" label="用户密码" prop="password">
            <Input :maxlength="25" type="password" v-model="formValidate.password" placeholder="请输入密码"></Input>
          </FormItem>
          <FormItem v-if="id===''" label="确认密码" prop="affirmPassword">
            <Input :maxlength="25" type="password" v-model="formValidate.affirmPassword" placeholder="请确认密码"></Input>
          </FormItem>
          <FormItem v-if="id===''" label="供应商" prop="supplierId">
            <Select v-model="formValidate.supplierId" style="width:200px">
              <Option v-for="item in supplierList" :value="String(item.id)" :key="item.id">{{ item.supplierName }}
              </Option>
            </Select>
          </FormItem>
          <FormItem v-if="userInfoType!=='SUPPLIER'" label="角色绑定" prop="roleIds">
            <Select :disabled="userInfoType!=='SUPPLIER'?false:true" v-model="formValidate.roleIds" multiple>
              <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.roleName }}</Option>
            </Select>
          </FormItem>
          <FormItem label="用户姓名" prop="name">
            <Input :maxlength="5" v-model="formValidate.name" placeholder="请输入"></Input>
          </FormItem>
          <!--<FormItem label="是否锁定" prop="statuss">-->
          <!--<i-switch v-model="statuss">-->
          <!--<span slot="open">是</span>-->
          <!--<span slot="close">否</span>-->
          <!--</i-switch>-->
          <!--</FormItem>-->
          <FormItem label="所有字段显示" prop="allField">
            <i-switch v-model="formValidate.allField">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
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
      // 角色选择验证
      const juese = (rule, value, callback) => {
        if (value.length < 1) {
          callback(new Error('请选择角色'))
        } else {
          callback();
        }
      };
      // 检查密码是否一致
      const affirm = (rule, value, callback) => {
        if (value.length < 1) {
          callback(new Error('请输入确认密码'))
        } else if (this.formValidate.password !== value) {
          callback(new Error('两次密码输入不一致'))
        } else {
          callback();
        }
      };
      // 检测用户名是否重复
      const ctionUser = (rule, value, callback) => {
        const _this = this;
        if (value.length < 1) {
          callback(new Error('请填写用户名'))
        } else {
          _this.Axios.post('/Manage/UserInfo/checkUserName', _this.Qs.stringify({
            id: _this.id !== '' ? _this.id : '',
            username: _this.formValidate.username
          })).then(res => {
            if (res.data.code === 0) {
              callback();
            } else {
              callback(new Error(res.data.message))
            }
          })
        }
      };
      return {
        like: '',
        id: '',
        handleId: '',
        total: 0,
        start: 0,
        cityList: [],
        loading: true,
        statuss: false,
        roleId: '全部',
        status: '全部',
        value13: '',
        value14: '',
        userInfoType: '',
        addAccount: false,
        modal_loading: false,
        roleName: '全部',
        roleList: [
          {
            id: '全部',
            roleName: '全部',
          }
        ],
        formValidate: {
          roleIds: [],       //角色权限
          username: '',      //账号
          password: '',       //密码
          affirmPassword: '',
          name: '',            //用户姓名
          supplierId: '',    //供应商id
          allField: true
        },
        supplierList: '',
        ruleValidate: {
          username: [
            {validator: ctionUser, required: true, trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入', trigger: 'blur'}
          ],
          affirmPassword: [
            {validator: affirm, required: true, trigger: 'blur'}
          ],
          roleIds: [
            {validator: juese, required: true, trigger: 'change'}
          ],
          name: [
            {required: true, message: '请输入', trigger: 'blur'}
          ],
          supplierId: [
            {required: true, message: '请输入', trigger: 'change'}
          ],
        },
        data: []
      }
    },
    methods: {
      //重置用户密码
      resetPass(username) {
        const _this = this;
        _this.Axios.post('/Manage/UserInfo/resetPassword', _this.Qs.stringify({
          username: username
        })).then(res => {
          if (res.data.code === 0) {
            _this.$Message.success('成功')
          } else {
            _this.$Message.warning(res.data.message)
          }
        })
      },

      //获取供应商下拉
      getSupplier() {
        const _this = this;
        _this.Axios.get('/Manage/Supplier/selectList').then(res => {
          if (res.data.code === 0) {
            _this.supplierList = res.data.data
          } else {
            _this.$Message.error(res.data.message)
          }
        })
      },

      //删除用户
      delHandle(username, id) {
        const _this = this;
        _this.Axios.post('/Manage/UserInfo/deleteUsers', _this.Qs.stringify({
          usernames: [username], // 用户账号数组
          ids: [id],//用户id数组
        }, {indices: false})).then(res => {
          if (res.data.code === 0) {
            _this.getUser();
            _this.$Message.success('删除成功')
          } else {
            _this.$Message.error(res.data.message)
          }
        })
      },

      //修改用户信息
      amend(id, userInfoType, username, name, roleIds, status, allField) {
        this.id = id;
        this.addAccount = true;
        this.userInfoType = userInfoType;
        this.formValidate.username = username;
        this.formValidate.name = name;
        this.formValidate.roleIds = roleIds;
        this.formValidate.allField = allField;
        this.statuss = status === '0' ? true : false;
      },

      // 获取角色下拉列表
      getRole() {
        const _this = this;
        _this.Axios.get('/Manage/Role/list', {
          params: {
            excludeSuper: true,
            supplierExclusive: true
          }
        }).then(res => {
          _this.roleList = _this.roleList.concat(res.data.data);
        })
      },

      // 获取角色列表
      cityRole() {
        const _this = this;
        _this.Axios.get('/Manage/Role/supplierRoleList', {
          params: {
            excludeSuper: true,
            supplierExclusive: false
          }
        }).then(res => {
          _this.cityList = res.data.data;
        })
      },

      // 用户分页
      paging(i) {
        this.start = i - 1;
        this.getUser();
      },

      // 添加用户
      addUser() {
        this.id = '';
        this.userInfoType = '';
        this.handleReset('formValidate');
        this.statuss = false;
        this.addAccount = true
      },

      //用户显示隐藏操作
      Handle(name) {
        if (this.handleId === name) {
          this.handleId = ''
        } else {
          this.handleId = name
        }
      },

      // 获取用户列表
      getUser() {
        const _this = this;
        _this.loading = true;
        _this.Axios.post('/Manage/UserInfo/supplierUsers', _this.Qs.stringify({
          start: _this.start,
          size: 5,
          usernameLike: _this.value13,         //账号模糊查询
          supplierNameLike: _this.value14,     //供应商名称模糊查询
          status: _this.status === '全部' ? '' : _this.status,               //是否锁定 "1"为正常 “0”为锁定
          roleId: _this.roleId === '全部' ? '' : _this.roleId,               //角色id
          userInfoType: '',         //用户类型 ADMIN("普通管理员"), SUPPLIER("供应商管理员"),
        })).then(res => {
          if (res.data.code === 0) {
            _this.data = res.data.data.content;
          } else {
            _this.$Message.error(res.data.message)
          }
          _this.loading = false;
          _this.total = Number(res.data.data.totalElements);
        })
      },

      // 添加用户
      handleSubmit(name) {
        const _this = this;
        _this.$refs[name].validate((valid) => {
          if (valid) {
            _this.modal_loading = true;
            if (_this.id === '') {
              // 添加用户
              _this.Axios.post('/Manage/UserInfo/addSupplierUser', _this.Qs.stringify({
                username: _this.formValidate.username,  //账号
                password: _this.formValidate.affirmPassword,  //密码
                name: _this.formValidate.name,   //用户姓名
                roleIdSet: _this.formValidate.roleIds,  //角色id素组
                supplierId: _this.formValidate.supplierId,
                allField: _this.formValidate.allField,
                sex: 'MALE'
              }, {indices: false})).then(res => {
                if (res.data.code === 0) {
                  _this.addAccount = false;
                  _this.getUser();
                  _this.$Message.success('success')
                } else {
                  _this.$Message.error(res.data.message)
                }
                _this.modal_loading = false;
              })
            } else {
              // 更新用户
              _this.Axios.post('/Manage/UserInfo/updateSupplierUser', _this.Qs.stringify({
                id: _this.id,
                username: _this.formValidate.username,  //账号
                name: _this.formValidate.name,   //用户姓名
                roleIdSet: _this.formValidate.roleIds,  //角色id素组
                supplierId: _this.formValidate.supplierId,
                allField: _this.formValidate.allField,
                sex: 'MALE'
              }, {indices: false})).then(res => {
                if (res.data.code === 0) {
                  _this.addAccount = false;
                  _this.getUser();
                  _this.$Message.success('success')
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
      abc(event) {
        console.log(event.target.parentElement)
      }
    },
    mounted() {
      this.getUser();
      this.cityRole();
      this.getRole();
      this.getSupplier();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .ivu-btn-small {
    padding: 0 7px 2px;
  }
</style>
