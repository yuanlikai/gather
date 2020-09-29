<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">商品审核</div>
    </Card>
    <RadioGroup :style="{margin: '0 0 0 20px', background: '#fff',height:'auto'}" size="large" type="button"
                v-model="formValidate.state" @on-change="resetPage();getList()">
      <Radio style="padding:0 20px" label="AUDITING">
        待审核 ({{countList.auditingCount}})
      </Radio>
      <Radio style="padding:0 20px" label="PASS">
        已通过 ({{countList.passCount}})
      </Radio>
      <Radio style="padding:0 20px" label="REJECT">
        未通过 ({{countList.notPassCount}})
      </Radio>
    </RadioGroup>
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
            <FormItem label="商品分类：" prop="classify">
              <Cascader v-model="formValidate.classify" :data="treeData" @on-change="screen"></Cascader>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="商品品牌：" prop="brandNameLike">
              <Select v-model="formValidate.brandId" @on-change="resetPage();getList()" clearable>
                <Option v-for="(item,index) in brandList" :value="item.id" :key="index">{{item.brandName}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="供应商：" prop="brandNameLike">
              <Select v-model="formValidate.supplierId" @on-change="resetPage();getList()" clearable>
                <Option v-for="(item,index) in supplierList" :value="item.id" :key="index">{{item.supplierName}}
                </Option>
              </Select>
            </FormItem>
          </Col>
          <Col :xs="24" :md="12" :lg="8">
            <FormItem label="编号：" prop="skuInfoNoLike">
              <Input v-model="formValidate.skuInfoNoLike" placeholder="请输入"/>
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
          <FormItem v-if="formValidate1.approvalStatus!=='PASS'" label="反馈详情：" prop="rejectReason">
            <Input v-model="formValidate1.rejectReason" type="textarea" :rows="4" placeholder="请输入反馈详情"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="audit">确定</Button>
      </div>
    </Modal>
    <Modal v-model="modal1" width="500">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>审核详情</span>
      </p>
      <div style="text-align:center">
        <Table :columns="columns1" :data="data1"></Table>
        <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" @click="modal1=false">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modal: false,
        modal1: false,
        loading1: true,
        formValidate1: {
          name: '',
          id: '',
          approvalStatus: 'PASS',
          rejectReason: '',
        },
        formValidate: {
          state: 'AUDITING',
          skuInfoNameLike: '',
          skuInfoNoLike: '',
          classify: [],
          brandId: '',
          supplierId: '',
        },
        columns1: [
          {
            title: '审核时间',
            key: 'timeCreated',
            render: (h, params) => {
              return h('span', this.riqi(params.row.timeCreated))
            }
          },
          {
            title: '审核人员',
            key: 'approverName'
          },
          {
            title: '审核结果',
            key: 'approvalStatus',
            render: (h, params) => {
              return h('span', params.row.approvalStatus.name)

            }
          },
          {
            title: '反馈详情',
            key: 'feedback'
          }
        ],
        data1: [],
        columns: [
          {
            type: 'index',
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
                  trigger: 'hover',
                  placement: 'right'
                }
              }, [
                h('img', {
                  style: {
                    cursor: 'pointer',
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
                h('a', {
                  style: {
                    float: 'left',
                    width: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  },
                  on: {
                    click: () => {
                      let href = this.$router.resolve({
                        path: '/examine',
                        query: {
                          examineId: params.row.id,
                          audit: true
                        }
                      });
                      window.open(href.href, '_blank')
                    }
                  }
                }, params.row.skuInfoName),
                h('div', {
                  style: {
                    color: '#888888'
                  }
                }, `品牌：${params.row.brandName ? params.row.brandName : '未绑定'}`)
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
              if (params.row.approvalStatus === 'AUDITING') {
                return h('span', '待审核')
              } else if (params.row.approvalStatus === 'PASS') {
                return h('div', [
                  h('div', '已通过'),
                  h('a', {
                    on: {
                      'click': () => {
                        this.ExamineLog(params.row.id)
                      }
                    }
                  }, '审核详情'),
                ])
              } else if (params.row.approvalStatus === 'REJECT') {
                return h('div', [
                  h('div', '未通过'),
                  h('a', {
                    on: {
                      'click': () => {
                        this.ExamineLog(params.row.id)
                      }
                    }
                  }, '审核详情')
                ])
              }
            },
            filters: [
              {
                label: '待审核',
                value: 'AUDITING'
              },
              {
                label: '已通过',
                value: 'PASS'
              },
              {
                label: '未通过',
                value: 'REJECT'
              },
            ],
            filterMultiple: false,
            filterRemote(value) {
              this.$parent.resetPage();
              this.$parent.formValidate.state = value.length > 0 ? value[0] : 'all';
              this.$parent.getList()
            },
          },
          {
            title: '操作',
            tooltip: true,
            key: 'ProductName',
            width: 100,
            align: "center",
            render: (h, params) => {
              if (params.row.approvalStatus === 'AUDITING') {
                return ('div', [
                  h('a', {
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
                ])
              } else {
                return h('span', '暂无操作')
              }
            }
          }
        ],
        data: [],
        total: 0,
        start: 1,
        treeData: [],
        brandList: [],
        selection: [],
        supplierList: [],
        countList: {},
      }
    },
    methods: {

      //审核详情
      ExamineLog(id) {
        this.modal1 = true;
        const _this = this;
        _this.Axios.get('/Manage/ExamineLog/pageList', {
          params: {
            skuInfoId: id
          }
        }).then(res => {
          _this.data1 = res.data.data.content
        })
      },

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
            _this.count();
            _this.$Message.success('成功')
          } else {
            _this.$Message.warning(res.data.message)
          }
        })
      },

      //筛选
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
            approvalStatus: _this.formValidate.state,
            supplierId: _this.formValidate.supplierId,
            skuInfoNameLike: _this.formValidate.skuInfoNameLike,
            skuInfoNoLike: _this.formValidate.skuInfoNoLike,
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
        _this.Axios.get('/Manage/Brand/list').then(res => {
          _this.brandList = res.data.data
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

      //统计数目
      count() {
        const _this = this;
        _this.Axios.get('/Manage/SkuInfo/count2').then(res => {
          _this.countList = res.data.data
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
      this.selectList();
      this.count();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
