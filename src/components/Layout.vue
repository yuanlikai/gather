<template>
  <div class="layout">
    <Layout class="">
      <Sider breakpoint="xs" class="Sider2" ref="side1" hide-trigger collapsible :collapsed-width="0" :width="256"
             v-model="isCollapsed"
             style="overflow-x: auto;height: 100vh;">
        <Menu @on-select="selectMenu" :theme="'dark'" :active-name="menu" :open-names="[menu]" width="256px">
          <div class="i-layout-sider-logo i-layout-sider-logo-dark">
            <a href="/" target="_self" class="i-link i-link-color">
              <img src="https://file.iviewui.com/admin-pro-dist/img/logo-dark.11bf8723.png">
            </a>
          </div>
          <MenuItem name="1">
            <Icon type="md-home"/>
            首页
          </MenuItem>

          <MenuGroup v-for="(item,index) in menuList" :key="index" :title="item.name">
            <MenuItem v-for="(items,indexs) in item.children" :key="indexs" :to="items.to" :name="items.numb">
              <Icon type="ios-analytics"/>
              {{items.name}}
            </MenuItem>
          </MenuGroup>

          <!--<MenuGroup title="报表管理">-->
          <!--<MenuItem name="3">-->
          <!--<Icon type="ios-analytics" />-->
          <!--订单报表-->
          <!--</MenuItem>-->
          <!--<MenuItem name="4">-->
          <!--<Icon type="ios-analytics" />-->
          <!--商品报表-->
          <!--</MenuItem>-->
          <!--</MenuGroup>-->
          <!--<MenuGroup title="权限管理">-->
          <!--<MenuItem to="userList" name="5">-->
          <!--<Icon type="ios-analytics" />-->
          <!--用户管理-->
          <!--</MenuItem>-->
          <!--<MenuItem to="roleList" name="6">-->
          <!--<Icon type="ios-analytics" />-->
          <!--角色管理-->
          <!--</MenuItem>-->
          <!--<MenuItem to="menuList" name="7">-->
          <!--<Icon type="ios-analytics" />-->
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
          <Breadcrumb class="status">
            <BreadcrumbItem>首页</BreadcrumbItem>
            <BreadcrumbItem>异常页面</BreadcrumbItem>
            <BreadcrumbItem>404</BreadcrumbItem>
          </Breadcrumb>
          <Menu mode="horizontal" type="light" style="margin-left: auto;margin-right: 20px;">
            <div class="layout-logo"></div>
            <div class="layout-nav">
              <!--<Icon size="18" type="md-expand"/>-->
              <Dropdown trigger="click" style="margin-left: 20px;cursor: pointer;" @on-click="out">
                <!--<a href="javascript:void(0)">-->
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
        <Row style="padding: 6px 0;margin: 0 12px;">
          <Col span="24" style="overflow-y: auto">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <router-link v-for="(item,index) in tabList" :key="index" :to="item.path" class="swiper-slide">
                  <Tag type="dot" closable checkable
                       :color="item.name===tab?'error':''" style="border: none"
                       @on-close.prevent="handleClose(index,item.name===tab)">{{item.name}}
                  </Tag>
                </router-link>
              </div>
            </div>
          </Col>
        </Row>
        <router-view></router-view>
        <footer class="ivu-global-footer i-copyright">
          <div class="ivu-global-footer-links">
            <a href="http://www.e6best.com/" target="_blank" title="官网">官网</a>
            <a href="https://weibo.com/u/6596595059" target="_blank" title="微博">微博</a></div>
          <div class="ivu-global-footer-copyright">Copyright © 2019 上海怡乐畅购智能技术有限公司</div>
        </footer>
      </Layout>
    </Layout>
    <div @click="collapsedSider" v-if="!isCollapsed" class="zz-fixed"></div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        user:sessionStorage.getItem('user'),
        tabList: [],
        tab: '',
        menuList: [],
        menu: sessionStorage.getItem('menu'),
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
        sessionStorage.setItem('menu', name);
      },
      collapsedSider() {
        this.$refs.side1.toggleCollapse();
      },
      tagAffair(i) {
        this.$store.commit('increment', i)
      },

      //退出登录
      out(){
        const _this = this;
        _this.Axios.post('/logout').then(function(){
        }).catch(err=>{
          _this.$router.push('/');
          _this.$Message.success('退出登录')
        });
      },

      //关闭标签
      handleClose(index, status) {
        if (status) {
          if (index + 1 === this.tabList.length) {
            this.$router.push(this.tabList[index - 1].path)
          } else {
            this.$router.push(this.tabList[index + 1].path)
          }
        }
        this.tabList.splice(index, 1);
      },

      //获取用户菜单
      getmenu() {
        const _this = this;
        _this.Axios.post('/Manage/Menu/getUserMenu').then(res => {
          _this.menuList = res.data.data.reverse();
        })
      }
    },
    mounted() {





      this.getmenu();
      var mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        initialSlide: 2,
        freeMode: true,
      });
      this.$router.beforeEach((to, from, next) => {
        console.log(to)
        this.$Loading.start();
        if (JSON.stringify(this.tabList).indexOf(to.name) === -1) {
          this.tabList.push({
            name: to.name,
            path: to.path
          });
        }
        this.tab = to.name;
        next();
      });
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
