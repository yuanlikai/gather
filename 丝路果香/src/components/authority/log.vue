
<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">日志管理</div>
    </Card>
    <Card :style="{margin: '0 20px 20px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        基础列表
      </p>
      <p slot="extra">
        <Icon type="ios-loop-strong"></Icon>
        <!--<span article="users" style="margin: 3px 4px 0 0">操作日期:</span>-->
        <span style="margin: 3px 4px 0 0">操作人员:</span>
        <Select v-model="username" @on-change="start=0;getLog()" style="width:120px;margin-right: 16px">
          <Option value="全部">全部</Option>
          <Option v-for="item in userList" :value="item.username" :key="item.username">{{item.username}}</Option>
        </Select>
      </p>


      <Table :loading="loading" :show-header="true" :columns="columns" :data="data"></Table>
      <div style="width: 100%;height: 2px;background: #ffffff;margin-top: -1px;z-index: 3;position: relative"></div>
      <div style="width: 100%;text-align: center;margin-top: 15px">
        <Page @on-change="paging" :total="total" :page-size="9" show-elevator show-total/>
      </div>
    </Card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        userList: [],
        loading:true,
        username: '全部',
        total: 0,
        start: 0,
        columns: [
          {
            title: '账号',
            key: 'username',
            align: "center",
          },
          {
            title: '地点',
            key: 'location',
            align: "center",
          },
          {
            title: '时间',
            key: 'timeCreated',
            align: "center",
            render:(h,params)=>{
              return h('span',this.riqi(params.row.timeCreated))
            }
          },
          {
            title: '接口名称',
            key: 'operation',
            align: "center",
          },
          {
            title: 'ip',
            key: 'ip',
            align: "center",
          },
        ],
        data: [],
      }
    },
    methods: {
      //获取日志列表
      getLog() {
        const _this = this;
        _this.loading=true;
        _this.Axios.get('/Manage/Log/pageList', {
          params: {
            username: _this.username !== '全部' ? _this.username : '',
            start: _this.start,
            size: 9,
          }
        }).then(res => {
          _this.data=res.data.data.content;
          _this.total = Number(res.data.data.totalElements)
          _this.loading=false;
        })
      },

      //分页
      // 用户分页
      paging(i) {
        this.start = i - 1;
        this.getLog();
      },

      //管理员下拉列表
      userInfo() {
        const _this = this;
        _this.Axios.get('/Manage/UserInfo/list').then(res => {
          this.userList = res.data.data
          console.log(res.data.data)
        })
      }
    },
    mounted() {
      this.getLog();
      this.userInfo();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
