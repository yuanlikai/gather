<template>
  <div>
    <Modal
      v-model="modal1"
      :title="title">
      <Table :columns="columns1" :data="data1"></Table>
    </Modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        proUrl: '',
        modal3: false,
        modal1: false,
        title: '',
        data1: [],
        columns1: [
          {
            title: '图片',
            width:'80px',
            align:'center',
            key: 'name',
            render: (h, params) => {
              return h('div', {
                style: {
                  display: 'flex',
                  justifyContent:'center',
                  alignItems: 'center'
                }
              }, [
                h('img', {
                  attrs: {
                    src: params.row.ProductImg
                  },
                  style: {
                    height: '30px',
                    width: '30px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    marginRight: '6px'
                  },
                  on: {
                    'click': () => {
                      this.$emit('showModal3',params.row.ProductImg)
                    }
                  }
                }),
              ])
            }
          },
          {
            title: '编号',
            key: 'StockNo',
          },
          {
            title: '名称',
            key: 'ProductName',
          },
          {
            title: '数量',
            key: 'Num',
          },
        ],
      }
    },
    methods: {
      info(row) {
        this.title = `订单编号: ${row.OrderNumber} 产品信息`
        this.data1 = row.ProList
        this.modal1 = true
      },
    },
    mounted() {
    
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
