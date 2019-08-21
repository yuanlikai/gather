<style lang="less">
    .ivu-tree li ul {
        padding: 0 0 0 60px;
    }
</style>
<template>
    <div class="content">
      <Card style="border:none;margin-bottom: 16px;">
        <div class="ivu-page-header-title">订单列表</div>
        <div class="ivu-page-header-content">表格查询的复杂操作</div>
      </Card>
      <Content :style="{margin: '0 20px 20px 20px', background: '#fff',padding: '16px',height:'auto'}">
        <!--<p slot="title">-->
          <!--基础列表-->
        <!--</p>-->
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <Row :gutter="30">
            <Col :xs="24" :md="12" :lg="8">
              <FormItem label="订单状态：" prop="state">
                <Input v-model="formValidate.state" placeholder="请输入"/>
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :lg="8">
              <FormItem label="供应商：">
                <Input placeholder="请选择"/>
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :lg="8" v-if="!downUp">
              <FormItem label="订单编号：">
                <Input placeholder="请输入"/>
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :lg="8" v-if="!downUp">
              <FormItem label="收货人：">
                <Input placeholder="请输入"/>
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :lg="8" v-if="!downUp">
              <FormItem label="电话：">
                <Input placeholder="请输入"/>
              </FormItem>
            </Col>
            <Col :xs="24" :md="12" :lg="8" v-if="!downUp">
              <FormItem label="时间：">
                <Input placeholder="请选择"/>
              </FormItem>
            </Col>
            <Col :xs="24" :md="24" :lg="downUp?8:24" style="text-align: right">
              <FormItem>
                <Button type="primary" style="margin-right: 6px" @click="handleSubmit('formValidate')">查询</Button>
                <Button style="margin-right: 6px" @click="handleReset('formValidate')">重置</Button>
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

        <Table :show-header="true" :columns="columns" :data="data"></Table>
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
              columns:[],
              data:[],
              formValidate: {
                state: '',
                supplierid:'',
                ordernumber:'',
                consignee:'',
                phone:'',
                time:'',
              },
              ruleValidate: {
                state: [
                  { message: 'The name cannot be empty', trigger: 'blur' }
                ],
              }
            }
        },
        methods: {
          //获取订单列表
          getOrder(){
            const _this = this;
            _this.Axios.get('/Manage/Order/pageList',_this.Qs.stringify({

            })).then(res=>{

              console.log(res.data)
            })
          },

          //查询订单
          handleSubmit (name) {
            this.$refs[name].validate((valid) => {
              if (valid) {
                this.$Message.success('Success!');
              } else {
                this.$Message.error('Fail!');
              }
            })
          },
          handleReset (name) {
            this.$refs[name].resetFields();
          }
        },
        mounted() {
          this.getOrder()
        }
    }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
