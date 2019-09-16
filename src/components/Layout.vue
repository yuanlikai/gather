<template>
  <div class="layout">
    <Layout class="">
      <Sider breakpoint="xs" class="Sider2" ref="side1" hide-trigger collapsible :collapsed-width="0" :width="256"
             v-model="isCollapsed"
             style="overflow-x: auto;height: 100vh;">
        <Menu v-if="isMenu" @on-select="selectMenu" :theme="'dark'" :active-name="menu"
              width="256px">
          <div class="i-layout-sider-logo i-layout-sider-logo-dark">
            <a class="i-link i-link-color">
              <img src="../assets/img/logo-wat.png">
            </a>
          </div>
          <!--<MenuItem name="1">-->
          <!--<Icon type="md-home"/>-->
          <!--首页-->
          <!--</MenuItem>-->
          <div v-for="(item,index) in menuList" :key="index" v-show="item.numb===menu1">
            <MenuGroup v-for="(itema,indexa) in item.children" :key="indexa" :title="itema.name">
              <MenuItem v-for="(itemb,indexb) in itema.children" :key="indexb" :to="itemb.to" :name="itemb.numb">
                <Icon type="ios-analytics"/>
                {{itemb.name}}
              </MenuItem>
            </MenuGroup>
          </div>
          <!--<MenuGroup v-for="(item,index) in menuList" :key="index" :title="item.children[0].name">-->
            <!--<MenuItem v-for="(items,indexs) in item.children[0].children" :key="indexs" :to="items.to" :name="items.numb">-->
              <!--<Icon type="ios-analytics"/>-->
              <!--{{items.name}}-->
            <!--</MenuItem>-->
          <!--</MenuGroup>-->
          <!--<MenuGroup title="分类管理">-->
          <!--<MenuItem to="orderList" name="2">-->
          <!--<Icon type="ios-analytics"/>-->
          <!--分类列表-->
          <!--</MenuItem>-->
          <!--</MenuGroup>-->
          <!--<MenuGroup title="报表管理">-->
          <!--<MenuItem to="orderList" name="3">-->
          <!--<Icon type="ios-analytics"/>-->
          <!--订单报表-->
          <!--</MenuItem>-->
          <!--<MenuItem to="orderList" name="4">-->
          <!--<Icon type="ios-analytics"/>-->
          <!--商品报表-->
          <!--</MenuItem>-->
          <!--</MenuGroup>-->
          <!--<MenuGroup title="权限管理">-->
          <!--<MenuItem to="userList" name="5">-->
          <!--<Icon type="ios-analytics"/>-->
          <!--用户管理-->
          <!--</MenuItem>-->
          <!--<MenuItem to="roleList" name="6">-->
          <!--<Icon type="ios-analytics"/>-->
          <!--角色管理-->
          <!--</MenuItem>-->
          <!--<MenuItem to="menuList" name="7">-->
          <!--<Icon type="ios-analytics"/>-->
          <!--菜单管理-->
          <!--</MenuItem>-->
          <!--</MenuGroup>-->
        </Menu>
      </Sider>
      <Layout :class="isCollapsed?'menucls':'menucla'">
        <Header :style="{padding: 10,display: 'flex'}" class="layout-header-bar">
          <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 24px','line-height':'64px'}"
                type="md-menu"
                size="24"></Icon>

          <Menu v-if="isMenu" @on-select="selectMenu1" mode="horizontal" :active-name="menu1">
            <MenuItem name="11000">
              首页
            </MenuItem>
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
        <!--<Row style="padding: 6px 0;margin: 0 12px;">-->
        <!--<Col span="24" style="overflow-y: auto">-->
        <!--<div article="swiper-container">-->
        <!--<div article="swiper-wrapper">-->
        <!--<router-link v-for="(item,index) in tabList" :key="index" :to="item.path" article="swiper-slide">-->
        <!--<Tag type="dot" closable checkable-->
        <!--:color="item.name===tab?'error':''" style="border: none"-->
        <!--@on-close.prevent="handleClose(index,item.name===tab)">{{item.name}}-->
        <!--</Tag>-->
        <!--</router-link>-->
        <!--</div>-->
        <!--</div>-->
        <!--</Col>-->
        <!--</Row>-->

        <router-view :supplier="supplier"></router-view>

        <!--<footer article="ivu-global-footer i-copyright">-->
        <!--<div article="ivu-global-footer-links">-->
        <!--<a href="http://www.e6best.com/" target="_blank" title="官网">官网</a>-->
        <!--<a href="https://weibo.com/u/6596595059" target="_blank" title="微博">微博</a></div>-->
        <!--<div article="ivu-global-footer-copyright">Copyright © 2019 上海怡乐畅购智能技术有限公司</div>-->
        <!--</footer>-->
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
