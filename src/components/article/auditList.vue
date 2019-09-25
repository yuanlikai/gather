<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">商品审核</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <p slot="title">
        筛选查询
      </p>
      <Form ref="formValidate" :model="formValidate" :label-width="80">
        <Row :gutter="30">
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="商品名称：" prop="skuInfoNameLike">
              <Input v-model="formValidate.skuInfoNameLike" placeholder="请输入"/>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="商品分类" prop="classify">
              <Cascader v-model="formValidate.classify" :data="treeData" @on-change="screen"></Cascader>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="商品品牌：" prop="brandNameLike">
              <Select v-model="formValidate.brandId" :clearable="true" @on-change="resetPage();getList()" clearable>
                <Option v-for="(item,index) in brandList" :value="item.id" :key="index">{{item.brandName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="供应商：" prop="brandNameLike">
              <Select v-model="formValidate.supplierId" :clearable="true" @on-change="resetPage();getList()" clearable>
                <Option v-for="(item,index) in supplierList" :value="item.id" :key="index">{{item.supplierName}}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :md="24" :lg="8" style="">
            <FormItem>
              <Button type="primary" style="margin-right: 6px" @click="resetPage();getList()">查询</Button>
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
      <Table @on-selection-change="choice" :loading="loading1" :show-header="true"
             :columns="columns"
             :data="data"></Table>
      <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      <div style="width: 100%;text-align: right;margin-top: 15px">
        <Dropdown style="float: left;margin-left: 22px" trigger="click" @on-click="batch()">
          <Button>
            批量操作
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem @click="getList()" name="1">加入回收站</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Page @on-change="paging" :total="Number(total)" :page-size="10" show-elevator show-total/>
      </div>
    </Card>
    <Modal v-model="modal" width="360">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>审核商品</span>
      </p>
      <div>
        <Form ref="formValidate1" :model="formValidate1" :label-width="80">
          <FormItem label="商品名称：" prop="name">
            {{formValidate1.name}}
          </FormItem>
          <FormItem label="商品审核：" prop="approvalStatus">
            <RadioGroup v-model="formValidate1.approvalStatus">
              <Radio label="PASS">审核通过</Radio>
              <Radio label="REJECT">审核不通过</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="反馈详情：" prop="rejectReason">
            <Input v-model="formValidate1.rejectReason" type="textarea" :rows="4" placeholder="请输入反馈详情"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="audit">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modal: false,
        loading1: true,
        formValidate1: {
          name: '',
          id: '',
          approvalStatus: 'PASS',
          rejectReason: '',
        },
        formValidate: {
          skuInfoNameLike: '',
          classify: [],
          brandId: '',
          supplierId: '',
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '商品图片',
            tooltip: true,
            width: 120,
            align: "center",
            key: 'skuInfoPicUrl',
            render: (h, params) => {
              return h('Poptip', {
                props: {
                  placement: 'right'
                }
              }, [
                h('img', {
                  style: {
                    height: '30px'
                  },
                  attrs: {
                    src: params.row.skuInfoPicUrl
                  }
                }),
                h('div', {
                  attrs: {
                    class: 'api'
                  },
                  slot: 'content'
                }, [
                  h('img', {
                    style: {
                      height: '200px'
                    },
                    attrs: {
                      src: params.row.skuInfoPicUrl
                    }
                  }),
                ])
              ])
            }
          },
          {
            title: '商品名称',
            tooltip: true,
            key: 'skuInfoName',
            render: (h, params) => {
              return h('div', [
                h('div', params.row.skuInfoName),
                h('div', {
                  style: {
                    color: '#888888'
                  }
                }, `品牌：${params.row.brandName}`)
              ])
            }
          },
          {
            title: '编号',
            tooltip: true,
            key: 'skuInfoNo',
            align: "center",
          },
          {
            title: '商品分类',
            align: "center",
            render: (h, params) => {
              return h('p', `${params.row.category1Name} > ${params.row.category2Name} > ${params.row.category3Name}`)
            }
          },
          {
            title: '供应商',
            tooltip: true,
            key: 'supplierName',
            align: "center",
          },
          {
            title: '状态',
            tooltip: true,
            align: "center",
            render: (h, params) => {
              return h('span', '待审核')
            }
          },
          {
            title: '操作',
            tooltip: true,
            key: 'ProductName',
            width: 120,
            align: "center",
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.formValidate1.id = params.row.id;
                    this.formValidate1.rejectReason = '';
                    this.formValidate1.approvalStatus = 'PASS';
                    this.formValidate1.name = params.row.skuInfoName;
                    this.modal = true
                  }
                }
              }, '审核')
            }
          }
        ],
        data: [],
        total: 0,
        start: 1,
        treeData: [],
        brandList: [],
        selection: [],
        supplierList: []
      }
    },
    methods: {

      //审核
      audit() {
        const _this = this;
        _this.Axios.post('/Manage/SkuInfo/examine', _this.Qs.stringify({
          id: _this.formValidate1.id,   //id
          rejectReason: _this.formValidate1.rejectReason,   //拒绝理由
          approvalStatus: _this.formValidate1.approvalStatus,   //审核状态 PASS("审核通过"), REJECT("拒绝");
        })).then(res => {
          if (res.data.code === 0) {
            _this.modal = false;
            _this.getList();
            _this.$Message.success('审核通过')
          } else {
            _this.$Message.warning(res.data.message)
          }
        })

      },

      //赛选
      screen(i) {
        this.formValidate.classify = i;
        this.resetPage();
        this.getList()
      },

      //获取品牌列表
      getList() {
        const _this = this;
        _this.loading1 = true;
        _this.Axios.get('/Manage/SkuInfo/pageList', {
          params: {
            start: _this.start - 1,
            size: 10,
            approvalStatus: 'AUDITING',
            supplierId: _this.formValidate.supplierId,
            skuInfoNameLike: _this.formValidate.skuInfoNameLike,
            category1: _this.formValidate.classify[0],
            category2: _this.formValidate.classify[1],
            category3: _this.formValidate.classify[2],
            brandId: _this.formValidate.brandId,
            recycleBin: false
          }
        }).then(res => {
          if (res.data.code === 0) {
            _this.data = res.data.data.content;
            _this.total = res.data.data.totalElements
          } else {
            _this.$Message.warning(res.data.message)
          }
          _this.loading1 = false;
        })
      },

      // 分页
      paging(i) {
        this.start = i;
        this.getList()
      },

      //重置搜索
      handleReset(name) {
        this.$refs[name].resetFields();
        this.resetPage();
        this.formValidate.brandId = '';
        this.formValidate.supplierId = '';
        this.getList()
      },

      //获取分类
      getTree() {
        const _this = this;
        _this.Axios.get('/Manage/Category/treeList').then(res => {
          _this.treeData = res.data.data;
        })
      },

      //获取品牌列表
      getBrand() {
        const _this = this;
        _this.Axios.get('/Manage/Brand/pageList').then(res => {
          _this.brandList = res.data.data.content
        })
      },

      //多选
      choice(selection) {
        this.selection = [];
        for (let i in selection) {
          this.selection.push(selection[i].id)
        }
      },

      //批量显示隐藏
      batch(i) {
        const _this = this;
        if (_this.selection.length > 0) {
          _this.Axios.post('/Manage/SkuInfo/restore', this.Qs.stringify({
            skuInfoIds: _this.selection
          }, {indices: false})).then(res => {
            if (res.data.code === 0) {
              _this.getList();
              _this.$Message.success('还原商品成功')
            } else {
              _this.$Message.warning(res.data.message)
            }
          })
        } else {
          _this.$Message.warning('至少选择一个商品')
        }
      },

      //获取供应商下拉
      selectList() {
        const _this = this;
        _this.Axios.get('/Manage/Supplier/selectList').then(res => {
          _this.supplierList = res.data.data
        })
      },

      resetPage() {
        this.start = 1;
        this.total = 0;
      }
    },
    mounted() {
      this.getList();
      this.getTree();
      this.getBrand();
      this.selectList()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
