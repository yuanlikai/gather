
<template>
  <div class="layout">
    <Layout class="">
      <Sider breakpoint="xs" class="Sider2" ref="side1" hide-trigger collapsible :collapsed-width="0" :width="256"
             v-model="isCollapsed"
             style="overflow-x: auto;height: 100vh;">
        <Menu v-if="isMenu" @on-select="selectMenu" :theme="'dark'" :active-name="menu"
              width="256px">
          <div class="i-layout-sider-logo i-layout-sider-logo-dark">
            <a @click="operateMuen('1','1-1-2')" class="i-link i-link-color">
              <img src="../assets/img/logo-wat.png">
            </a>
          </div>
          <div v-for="(item,index) in menuList" :key="index" v-show="item.numb===menu1">
            <MenuGroup v-for="(itema,indexa) in item.children" :key="indexa" :title="itema.name">
              <MenuItem v-for="(itemb,indexb) in itema.children" :key="indexb" :to="itemb.to" :name="itemb.numb">
                <Icon type="ios-analytics"/>
                {{itemb.name}}
              </MenuItem>
            </MenuGroup>
          </div>
        </Menu>
      </Sider>
      <Layout :class="isCollapsed?'menucls':'menucla'">
        <Header :style="{padding: 10}" class="layout-header-bar">
          <Icon @click.native="collapsedSider" :class="rotateIcon"
                :style="{margin: '0 24px','line-height':'64px',cursor:'pointer',float:'left'}"
                type="md-menu"
                size="24"></Icon>
          <Menu v-if="isMenu" @on-select="selectMenu1" mode="horizontal" :active-name="menu1" style="float: left">
            <MenuItem v-for="(item,index) in menuList" :key="index" :name="item.numb">
              {{item.name}}
            </MenuItem>
          </Menu>
          <Menu mode="horizontal" type="light" style="float: right;margin-right: 20px">
            <div class="layout-logo"></div>
            <div class="layout-nav">
              <span style="font-size: 12px;font-weight: 600;color: #333;">{{supplier.supplierName}}</span>
              <router-link to="/log" v-show="supplier.userType==='SUPER'">
                <Tooltip content="日志" placement="bottom">
                  <Icon style="margin-left: 20px" size="18" color="#555555" type="md-ionic"/>
                </Tooltip>
              </router-link>
              <Dropdown trigger="click" style="margin-left: 20px;cursor: pointer;" @on-click="out">
                <Avatar style="margin-right: 8px"
                        src="https://ylcgenterprise.oss-cn-shanghai.aliyuncs.com/touxiang.jpg"/>
                {{user}}
                <Icon type="ios-arrow-down"/>
                <DropdownMenu slot="list">
                  <DropdownItem name="1">修改密码</DropdownItem>
                  <DropdownItem name="2">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </Menu>
        </Header>
        <router-view :supplier="supplier" @operateMuen="operateMuen"></router-view>
      </Layout>
    </Layout>
    <div @click="collapsedSider" v-if="!isCollapsed" class="zz-fixed"></div>
    <Modal v-model="modal" width="360">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>修改密码</span>
      </p>
      <div style="text-align:center">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <FormItem label="原密码" prop="oldPassword">
            <Input :maxlength="25" type="password" v-model="formValidate.oldPassword" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="新密码" prop="newPassword">
            <Input :maxlength="25" type="password" v-model="formValidate.newPassword" placeholder="请输入"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="handleSubmit('formValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modal: false,
        user: localStorage.getItem('user'),
        isMenu: false,
        tab: '',
        menuList: [],
        menuLeft: [],
        supplier: {},
        menu: localStorage.getItem('menu'),
        menu1: localStorage.getItem('menu1'),
        isCollapsed: false,
        formValidate: {
          oldPassword: '',
          newPassword: '',
        },
        ruleValidate: {
          oldPassword: [
            {required: true, message: '请输入', trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '请输入', trigger: 'blur'}
          ],
        }
      }
    },
    computed: {
      rotateIcon() {
        return [
          'menu-icon',
          this.isCollapsed ? 'rotate-icon' : ''
        ];
      },
      menuitemClasses() {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    },
    methods: {
      handleSubmit(name) {
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            _this.Axios.post('/Manage/UserInfo/updatePassword', _this.Qs.stringify({
              oldPassword: _this.formValidate.oldPassword,   //原密码
              newPassword: _this.formValidate.newPassword,   //新密码
            })).then(res => {
              if (res.data.code === 0) {
                _this.$router.push('/');
                this.$Message.success('修改密码成功，请重新登录！');
              } else {
                this.$Message.warning(res.data.message);
              }
              console.log(res.data)
            })
          } else {
            this.$Message.error('有必填项未填写!');
          }
        })
      },
      selectMenu(name) {
        this.menu = name;
        localStorage.setItem('menu', name);
      },
      selectMenu1(name) {
        const _this = this;
        let menuList = this.menuList;
        for (let i = 0; i < menuList.length; i++) {
          if (name === menuList[i].numb) {
            _this.menuLeft = _this.menuList[i];
            // _this.menu = _this.menuLeft.children[0].children[0].numb;
            localStorage.setItem('menu', _this.menuLeft.children[0].children[0].numb);
          }
        }
        _this.menu1 = name;
        localStorage.setItem('menu1', name);
      },
      collapsedSider() {
        this.$refs.side1.toggleCollapse();
      },
      tagAffair(i) {
        this.$store.commit('increment', i)
      },

      //退出登录
      out(i) {
        const _this = this;
        if (i === '1') {
          _this.modal = true;
        } else if (i === '2') {
          _this.Axios.post('/logout').then(function () {
          }).catch(err => {
            localStorage.removeItem('menu');
            localStorage.removeItem('menu1');
            localStorage.removeItem('menuList');
          });
          _this.$router.push('/');
        }
      },

      //获取用户信息
      getCurrentUser() {
        const _this = this;
        _this.Axios.get('/Manage/UserInfo/getCurrentUser').then(res => {
          _this.supplier = res.data.data;
        })
      },

      //子组件改变菜单选择
      operateMuen(a, b) {
        this.menu1 = a;
        localStorage.setItem('menu1', a);
        this.menu = b;
        localStorage.setItem('menu', b);
        if (b === '1-1-2') {
          this.$router.push('/home')
        }
      }
    },
    mounted() {
      this.menuList = JSON.parse(localStorage.getItem('menuList'));
      this.isMenu = true;
      this.getCurrentUser();
      this.$router.afterEach(route => {
        this.$Loading.finish();
      });
    },
  }
</script>
<style>
  .ivu-menu-horizontal.ivu-menu-light:after {
    display: none;
  }

  .swiper-container {
    width: 100%;
  }

  .swiper-slide {
    width: auto; /*根据内容调整宽度*/
  }
</style>
