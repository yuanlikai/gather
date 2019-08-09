<template>
  <div class="layout">
    <Layout class="" >

      <Sider breakpoint="xs" class="Sider2" ref="side1" hide-trigger collapsible :collapsed-width="0" :width="256"
             v-model="isCollapsed"
             style="overflow-x: auto;height: 100vh;">

        <Menu :theme="'dark'" active-name="1" width="256px" >
          <div class="i-layout-sider-logo i-layout-sider-logo-dark">
            <a href="/" target="_self" class="i-link i-link-color">
              <img src="https://file.iviewui.com/admin-pro-dist/img/logo-dark.11bf8723.png">
            </a>
          </div>
          <MenuGroup title="订单管理">
            <MenuItem name="1">
              <Icon type="md-document" />
              订单列表
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="报表管理">
            <MenuItem name="3">
              <Icon type="md-heart" />
              订单报表
            </MenuItem>
            <MenuItem name="4">
              <Icon type="md-leaf" />
              商品报表
            </MenuItem>
          </MenuGroup>
          <MenuGroup title="权限管理">
            <MenuItem name="5">
              <Icon type="md-heart" />
              用户管理
            </MenuItem>
            <MenuItem name="6">
              <Icon type="md-leaf" />
              角色管理
            </MenuItem>
            <MenuItem to="menuList" name="7">
              <Icon type="md-leaf" />
              菜单管理
            </MenuItem>
          </MenuGroup>
        </Menu>
      </Sider>

      <Layout :class="isCollapsed?'menucls':'menucla'">
        <Header :style="{padding: 10,display: 'flex'}" class="layout-header-bar">
          <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 24px','line-height':'64px'}"
                type="md-menu"
                size="24"></Icon>
          <Breadcrumb class="status">
            <BreadcrumbItem to="/">首页</BreadcrumbItem>
            <BreadcrumbItem to="/components/breadcrumb">异常页面</BreadcrumbItem>
            <BreadcrumbItem>404</BreadcrumbItem>
          </Breadcrumb>
          <Menu mode="horizontal" type="light" active-name="1" style="margin-left: auto;margin-right: 20px;">
            <div class="layout-logo"></div>
            <div class="layout-nav">

              <Icon size="18" type="md-expand"/>

              <Dropdown trigger="click" style="margin-left: 20px;cursor: pointer;">
                <!--<a href="javascript:void(0)">-->
                <Avatar style="margin-right: 8px" src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>
                Aresn
                <Icon type="ios-arrow-down"/>
                <DropdownMenu slot="list">
                  <DropdownItem>退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </Menu>
        </Header>
        <Row style="padding: 6px 0;margin: 0 12px;">
          <Col span="24" style="overflow-y: auto">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <Tag class="swiper-slide" type="dot" closable checkable color="error" style="border: none">基础列表
                </Tag>
                <Tag class="swiper-slide" type="dot" closable checkable style="border: none">商品列表
                </Tag>
                <Tag class="swiper-slide" type="dot" closable checkable style="border: none">基础表单
                </Tag>
                <Tag class="swiper-slide" type="dot" closable checkable style="border: none">表单详情
                </Tag>
                <Tag class="swiper-slide" type="dot" closable checkable style="border: none">表单详情
                </Tag>
              </div>
            </div>
          </Col>
        </Row>
        <router-view></router-view>
        <footer class="ivu-global-footer i-copyright">
          <div class="ivu-global-footer-links">
            <a href="http://www.e6best.com/" target="_blank" title="官网">官网</a>
            <a href="http://www.e6best.com/" target="_blank" title="社区">社区</a></div>
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
      collapsedSider() {
        this.$refs.side1.toggleCollapse();
      },
      tagAffair(i) {
        this.$store.commit('increment', i)
      }
    },
    mounted() {
      var mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        freeMode: true,
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
