<template>
  <div class="content">
    <Modal v-model="modal" width="540">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>编辑货品信息</span>
      </p>
      <div>
        <Table :columns="columns" :data="data"></Table>
        <div style="width: 100%;height: 8px;background: #ffffff;margin-top: -4px;z-index: 99;position: relative"></div>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="loading" size="large" @click="update">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        modal: false,
        loading: false,
        id: '',
        columns: [
          {
            title: 'SKU编号',
            align: 'center',
            key: 'skuInfoNo',
          },
          {
            title: '市场价',
            align: 'center',
            key: 'marketPrice',
            render: (h, params) => {
              return h('input', {
                style: {
                  width: '83px',
                  border: '1px solid #dcdee2',
                  padding: '0 4px',
                  outline:'none'
                },
                attrs: {
                  value: params.row.marketPrice,
                  type: "text",
                  maxlength: '7'
                },
                on: {
                  'input': (event) => {
                    if (event.target.value.length < 1) {
                      event.target.value = 1
                    }
                    event.target.value = event.target.value.match(/\d+(\.\d{0,2})?/) ? event.target.value.match(/\d+(\.\d{0,2})?/)[0] : ''
                  },
                  'blur': (event) => {
                    this.data[params.index].marketPrice = event.target.value;
                  }
                }
              })
            }
          },
          {
            title: '销售价',
            align: 'center',
            key: 'price',
            render: (h, params) => {
              return h('input', {
                style: {
                  width: '83px',
                  border: '1px solid #dcdee2',
                  padding: '0 4px'
                },
                attrs: {
                  value: params.row.price,
                  type: "text",
                  maxlength: '7'
                },
                on: {
                  'input': (event) => {
                    if (event.target.value.length < 1) {
                      event.target.value = 1
                    }
                    event.target.value = event.target.value.match(/\d+(\.\d{0,2})?/) ? event.target.value.match(/\d+(\.\d{0,2})?/)[0] : ''
                  },
                  'blur': (event) => {
                    this.data[params.index].price = event.target.value;
                  }
                }
              })
            }
          },
          {
            title: '折扣',
            align: 'center',
            key: 'discount',
            render: (h, params) => {
              return h('input', {
                style: {
                  width: '83px',
                  border: '1px solid #dcdee2',
                  padding: '0 4px'
                },
                attrs: {
                  value: params.row.discount?params.row.discount:'',
                  type: "text",
                  maxlength: '7'
                },
                on: {
                  'input': (event) => {
                    event.target.value = event.target.value.match(/\d+(\.\d{0,1})?/) ? event.target.value.match(/\d+(\.\d{0,1})?/)[0] : ''
                  },
                  'blur': (event) => {
                    this.data[params.index].discount = event.target.value;
                  }
                }
              })
            }
          },
          {
            title: '平台',
            align: 'center',
            key: 'platformName',
          },
        ],
        data: [],
      }
    },
    methods: {

      //修改价格
      update() {
        const _this = this;
        _this.loading = true;
        _this.Axios.post('/Manage/OnsalePrice/update', _this.data).then(res => {
          if (res.data.code === 0) {
            _this.modal = false;
            _this.$Message.success('成功')
          } else {
            _this.$Message.warning(res.data.message)
          }
          _this.loading = false
        })
      },


      getList(id) {
        const _this = this;
        _this.Axios.get('/Manage/OnsalePrice/onsalePriceList', {
          params: {
            skuInfoId: id
          }
        }).then(res => {
          _this.data = res.data.data
        })
      }
    },
    mounted() {
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
