<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">平台列表</div>
    </Card>
    <RadioGroup v-model="state"  :style="{margin: '0 0 0 20px', background: '#fff',height:'auto'}" size="large" type="button">
      <Radio style="padding:0 20px" label="0">
        全部平台
      </Radio>
      <Radio style="padding:0 20px" label="1">
        启用
      </Radio>
      <Radio style="padding:0 20px" label="2">
        停用
      </Radio>
    </RadioGroup>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        数据列表
      </p>
      <Button type="dashed" style="width: 100%;margin-bottom: 16px;" to="/#/addTerrace" target="_blank">添加平台</Button>
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
        loading:false,
        state:'0',
        columns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '平台名称',
            tooltip: true,
            key: 'ProductName',
            align: "center",
          },
          {
            title: '简称',
            tooltip: true,
            key: 'ProductName',
            align: "center",
          },
          {
            title: '上架商品数',
            tooltip: true,
            key: 'ProductName',
            align: "center",
          },
          {
            title: '关联分类数(三级)',
            tooltip: true,
            key: 'ProductName',
            align: "center",
          },
          {
            title: '关联供应商数',
            tooltip: true,
            key: 'ProductName',
            align: "center",
          },
          {
            title: '状态',
            tooltip: true,
            key: 'ProductName',
            align: "center",
          },
          {
            title: '状态',
            tooltip: true,
            key: 'ProductName',
            align: "center",
            render:(h,params)=>{
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      let href = this.$router.resolve({
                        path: '/orderDetails',
                        query: {
                          idstr: params.row.ID,
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
        data:[
          {
            ProductName:'123'
          }
        ],
        start:1,
        total:0,
      }
    },
    methods: {
      //获取平台列表
      getTerrace(){
        const _this = this;
        _this.loading = true;
        _this.Axios.get('/Manage/Platform/pageList', {
          params: {
            status:''
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
