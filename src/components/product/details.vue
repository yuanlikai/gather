<template>
  <div class="content">
    <Card style="border:none;margin-bottom: 16px;">
      <div class="ivu-page-header-title">基础详情页</div>
    </Card>
    <Content :style="{margin: '0 20px 20px 20px', background: '#fff',padding: '16px',height:'auto'}">
      <Row class="ivu-kp">
        <Col  span="24" style="color: #333;margin-bottom: 16px;">基本信息</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">姓名： Aresn</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">性别： 男</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">城市： 北京市</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">生日： 1991-05-14</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">邮箱： aresn@iview.design</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">地址： 北京市朝阳区</Col>
      </Row>
      <Row class="ivu-kp">
        <Col  span="24" style="color: #333;margin-bottom: 16px;">其他信息</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">姓名： Aresn</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">性别： 男</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">城市： 北京市</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">生日： 1991-05-14</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">邮箱： aresn@iview.design</Col>
        <Col  :xs="24" :md="12" :lg="8" class="ivu-description-detail" span="8">地址： 北京市朝阳区</Col>
      </Row>
      <Row class="ivu-kp" style="border: none;margin: 0;padding: 0">
        <Col  span="24" style="color: #333;margin-bottom: 16px;">表格信息</Col>
        <Col  span="24">
          <Table :show-header="true" :columns="columns1" :data="data1"></Table>
        </Col>
      </Row>
    </Content>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        columns1: [
          {
            title: 'Name',
            key: 'name'
          },
          {
            title: 'Age',
            key: 'age'
          },
          {
            title: 'Name',
            key: 'name'
          },
          {
            title: 'Age',
            key: 'age'
          },
          {
            title: 'Address',
            key: 'address'
          }
        ],
        data1: [
          {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park',
            date: '2016-10-03'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            date: '2016-10-01'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park',
            date: '2016-10-02'
          },
          {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park',
            date: '2016-10-04'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            date: '2016-10-01'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park',
            date: '2016-10-02'
          },
          {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park',
            date: '2016-10-04'
          }
        ]
      }
    },
    methods: {},
    mounted() {
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
