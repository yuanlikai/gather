<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">平台列表</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        数据列表
      </p>
      <router-link target="_blank" :to="{
        path:'/addTerrace',
      }">
        <Button type="dashed" style="width: 100%;margin-bottom: 16px;">添加平台</Button>
      </router-link>
      <Table :loading="loading" :show-header="true" :columns="columns" :data="data"></Table>
      <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      <div style="width: 100%;text-align: center;margin-top: 15px">
        <Page @on-change="paging" :total="Number(total)" :page-size="10" show-elevator show-total/>
      </div>
    </Card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modal:true,
        loading: true,
        status: '全部',
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '平台名称',
            tooltip: true,
            key: 'platformName',
            align: "center",
          },
          {
            title: '简称',
            tooltip: true,
            key: 'abbrPlatformName',
            align: "center",
          },
          {
            title: '域名',
            tooltip: true,
            key: 'domian',
            align: "center",
          },
          {
            title: '上架商品数',
            tooltip: true,
            key: 'onsaleCount',
            align: "center",
          },
          {
            title: '关联分类数(三级)',
            tooltip: true,
            key: 'categoryCount',
            align: "center",
          },
          {
            title: '关联供应商数',
            tooltip: true,
            key: 'supplierCount',
            align: "center",
          },
          {
            title: '状态',
            tooltip: true,
            align: "center",
            render:(h,params)=>{
              return h('div',[
                h('Badge',{
                  props:{
                    status: params.row.status===true?'success':'error'
                  }
                }),
                h('span',params.row.status===true?'启用':'停用')
              ],)
            }
          },
          {
            title: '操作',
            tooltip: true,
            width: 120,
            align: "center",
            render: (h, params) => {
              return h('div', [

                h('a', {
                  on: {
                    click: () => {
                      let href = this.$router.resolve({
                        path: '/terraceClassify',
                        query: {
                          id: params.row.id,
                          name: params.row.platformName
                        }
                      });
                      window.open(href.href, '_blank')
                    }
                  }
                }, '关联'),
                h('Divider',{
                  props:{
                    type:'vertical'
                  }
                }),
                h('a', {
                  on: {
                    click: () => {
                      let href = this.$router.resolve({
                        path: '/addTerrace',
                        query: {
                          id: params.row.id,
                        }
                      });
                      window.open(href.href, '_blank')
                    }
                  }
                }, '编辑')
              ])
            }
          },
        ],
        data: [],
        start: 1,
        total: 0,
      }
    },
    methods: {
      //获取平台列表
      getTerrace() {
        const _this = this;
        _this.loading = true;
        _this.Axios.get('/Manage/Platform/pageList', {
          params: {
            start: _this.start - 1,
            size: 10,
            status: _this.status!=='全部'?_this.status:''
          }
        }).then(res => {
          if (res.data.code === 0) {
            _this.data = res.data.data.content;
            _this.total = res.data.data.totalElements;
          } else {
            _this.data = [];
            _this.total = 0;
            _this.$Message.warning(res.data.errorMsg)
          }
          _this.loading = false;
        })
      },

      // 分页
      paging(i) {
        this.start = i;
        this.getTerrace();
      },
    },
    mounted() {
      this.getTerrace();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
