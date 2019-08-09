<template>
  <div class="content">
    <Card style="border:none;margin-bottom: 16px;">
      <div class="ivu-page-header-title">基础列表</div>
      <div class="ivu-page-header-content">标准的列表，包含增删改查等基础操作。</div>
    </Card>

    <Content :style="{margin: '0 20px 20px 20px', background: '#fff',padding: '16px',height:'auto'}">
      <Form :label-width="80">
        <Row :gutter="30">
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="规则名称：">
              <Input placeholder="Enter something..."/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="调用次数：">
              <Input placeholder="Enter something..."/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8" v-if="!downUp">
            <FormItem label="调用次数：">
              <Input placeholder="Enter something..."/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8" v-if="!downUp">
            <FormItem label="规则名称：">
              <Input placeholder="Enter something..."/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8" v-if="!downUp">
            <FormItem label="调用次数：">
              <Input placeholder="Enter something..."/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8" v-if="!downUp">
            <FormItem label="调用次数：">
              <Input placeholder="Enter something..."/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="24" :lg="downUp?8:24" style="text-align: right">
            <FormItem>
              <Button type="primary" style="margin-right: 6px">查询</Button>
              <Button style="margin-right: 6px">重置</Button>
              <Button type="text" style="color:#2d8cf0" @click="downUp=!downUp">
                <template v-if="downUp">
                  展开
                  <Icon type="ios-arrow-down"/>
                </template>
                <template v-if="!downUp">
                  收起
                  <Icon type="ios-arrow-up"/>
                </template>
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>

      <Table :show-header="true" :columns="columns1" :data="data1"></Table>
      <div class="table-page">
        <Page :total="100"/>
      </div>
    </Content>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        downUp: true,
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
    methods: {
    },
    mounted() {
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
