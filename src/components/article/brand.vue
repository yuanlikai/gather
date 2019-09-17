
<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">品牌管理</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        筛选查询
      </p>
      <Form ref="formValidate" :model="formValidate" :label-width="80">
        <Row :gutter="30">
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="品牌名称：" prop="brandNameLike">
              <Input v-model="formValidate.brandNameLike" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="24" :lg="8" style="">
            <FormItem>
              <Button type="primary" style="margin-right: 6px" @click="handleSubmit('formValidate')">查询</Button>
              <Button style="margin-right: 6px" @click="handleReset('formValidate')">重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        数据列表
      </p>
      <Button type="dashed" style="width: 100%;margin-bottom: 16px;">添加</Button>
      <Table :loading="loading1" :show-header="true" :columns="columns" :data="data"></Table>
      <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      <div style="width: 100%;text-align: center;margin-top: 15px">
        <Page @on-change="paging" :total="total" :page-size="10" show-elevator show-total/>
      </div>
    </Card>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading1: false,
        data1: [],
        total:0,
        formValidate: {
          brandNameLike: ''
        },
        columns: [
          {
            title: '编号',
            tooltip: true,
            key: 'ProductName',
            minWidth: 120,
            align: "center",
          },
          {
            title: '品牌名称',
            tooltip: true,
            key: 'ProductName',
            minWidth: 120,
            align: "center",
          },
          {
            title: '品牌简称',
            tooltip: true,
            key: 'ProductName',
            minWidth: 120,
            align: "center",
          },
          {
            title: '排序ID',
            tooltip: true,
            key: 'ProductName',
            minWidth: 120,
            align: "center",
            sortable: true
          },
          {
            title: '关联供应商',
            tooltip: true,
            key: 'ProductName',
            minWidth: 120,
            align: "center",
            sortable: true
          },
          {
            title: '是否显示',
            tooltip: true,
            key: 'ProductName',
            minWidth: 120,
            align: "center",
          },
          {
            title: '操作',
            tooltip: true,
            key: 'ProductName',
            width: 160,
            align: "center",
            render: (h, params) => {
              return h('div', [
                h('a', {
                  style: {
                    height: '12px',
                    marginRight: '5px',
                    paddingRight: '5px',
                    borderRight: '1px solid #e8eaec'
                  },
                  on: {
                    click: () => {
                      this.status = '修改';
                      this.addAccount = true;
                      this.id = params.row.id;
                      this.formValidate.menuUrl = '';
                      this.formValidate.numb = params.row.numb;
                      this.formValidate.menuName = params.row.menuName;
                      this.module = '《' + params.row.menuName + '》';
                    }
                  }
                }, '编辑'),

                h('Poptip', {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: '确定删除该品牌？',
                  },
                  on: {
                    'on-ok': () => {
                      const _this = this;
                      _this.Axios.post('/Manage/Menu/deleteMenus', _this.Qs.stringify({
                        id: params.row.id
                      }, {indices: false})).then(res => {
                        if (res.data.code === 0) {
                          _this.getMenuList();
                          _this.$Message.success('删除成功')
                        } else {
                          _this.$Message.error(res.data.message)
                        }
                      })
                    }
                  }
                }, [
                  h('a', '删除')
                ]),
              ])
            }
          },
        ],
        data:[
          {
            ProductName:'123'
          }
        ],
      }
    },
    methods: {

      //获取品牌列表
      getBrand() {
        const _this = this;
        _this.Axios.get('/Manage/Brand/pageList', {
          params: {
            firstLetter: '',     //品牌前缀
            brandNameLike: '',   //品牌名称模糊搜搜
          }
        }).then(res => {
          console.log(res.data)
        })
      },

      // 分页
      paging(i) {
        this.start = i;
      },

      //搜索品牌
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$Message.success('Success!');
          } else {
            this.$Message.error('Fail!');
          }
        })
      },


      //重置搜索
      handleReset(name) {
        this.$refs[name].resetFields();
      },
    },
    mounted() {
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
