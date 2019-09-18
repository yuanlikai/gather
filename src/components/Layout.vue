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
        <Header :style="{padding: 10,display: 'flex'}" class="layout-header-bar">
          <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 24px','line-height':'64px'}"
                type="md-menu"
                size="24"></Icon>

          <Menu v-if="isMenu" @on-select="selectMenu1" mode="horizontal" :active-name="menu1">
            <MenuItem v-for="(item,index) in menuList" :key="index" :name="item.numb">
              {{item.name}}
            </MenuItem>
          </Menu>

          <Menu mode="horizontal" type="light" style="margin-left: auto;margin-right: 20px;">
            <div class="layout-logo"></div>
            <div class="layout-nav">
              <router-link to="/log">
                <Tooltip content="日志" placement="bottom">
                  <Icon size="18" color="#555555" type="md-ionic"/>
                </Tooltip>
              </router-link>
              <Dropdown trigger="click" style="margin-left: 20px;cursor: pointer;" @on-click="out">
                <Avatar style="margin-right: 8px" src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>
                {{user}}
                <Icon type="ios-arrow-down"/>
                <DropdownMenu slot="list">
                  <DropdownItem name="1">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </Menu>
        </Header>
        <router-view :supplier="supplier" @operateMuen="operateMuen"></router-view>
      </Layout>
    </Layout>
    <div @click="collapsedSider" v-if="!isCollapsed" class="zz-fixed"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        user: localStorage.getItem('user'),
        isMenu: false,
        tab: '',
        menuList: [],
        menuLeft: [],
        supplier: {
          supplierId: '',
          userType: '',
        },
        menu: localStorage.getItem('menu'),
        menu1: localStorage.getItem('menu1'),
        isCollapsed: false,
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
      out() {
        const _this = this;
        _this.Axios.post('/logout').then(function () {
        }).catch(err => {
          localStorage.removeItem('menu');
          localStorage.removeItem('menu1');
          localStorage.removeItem('menuList');
          _this.$router.push('/');
          _this.$Message.success('退出登录')
        });
      },

      //获取用户信息
      getCurrentUser() {
        const _this = this;
        _this.Axios.get('/Manage/UserInfo/getCurrentUser').then(res => {
          _this.supplier.supplierId = res.data.data.supplierId;
          _this.supplier.userType = res.data.data.userType;
        })
      },

      //子组件改变菜单选择
      operateMuen(a,b){
        this.menu1 = a;
        localStorage.setItem('menu1', a);
        this.menu = b;
        localStorage.setItem('menu', b);
        if(b==='1-1-2'){
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
  .swiper-container {
    width: 100%;
  }

  .swiper-slide {
    width: auto; /*根据内容调整宽度*/
  }
</style>
