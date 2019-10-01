<template>
  <div class="content">
    <Modal v-model="modal" width="300">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>编辑SKU库存</span>
      </p>
      <div>
        <Row>
          <!--<Col span="8">SKU编号：{{skuInfoName}}</Col>-->
          <!--<Col span="8">商品名称：{{skuInfoName}}</Col>-->
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="SKU编号" prop="skuInfoNo">
              <p>{{formValidate.skuInfoNo}}</p>
            </FormItem>
            <FormItem label="商品名称" prop="skuInfoName">
              <p>{{formValidate.skuInfoName}}</p>
            </FormItem>
            <FormItem label="商品库存" prop="stock">
              <Input v-model="formValidate.stock" placeholder="Enter your name"></Input>
            </FormItem>
          </Form>
        </Row>
      </div>
      <div slot="footer">
        <Button type="primary" :loading="loading" size="large" @click="handleSubmit('formValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        loading: false,
        formValidate: {
          skuInfoName: '',
          skuInfoNo: '',
          stock: '',
          supplierKey: ''
        },
        ruleValidate: {
          stock: [
            {required: true, message: '商品库存不能为空', trigger: 'blur'}
          ],
        },
        modal: false,
        skuInfoName: '',
        data1: []
      }
    },
    methods: {
      handleSubmit(name) {
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            _this.loading = true;
            _this.Axios.post('/Manage/SkuInfo/updateStock', _this.Qs.stringify({
              skuInfoNo: _this.formValidate.skuInfoNo,    //商品编号
              stock: _this.formValidate.stock,    //修改的库存数 需要>=0
              supplierKey: _this.formValidate.supplierKey,    //商品所属的供应商id
            })).then(res => {
              if (res.data.code === 0) {
                _this.$emit('getList');
                _this.modal=false;
                _this.$Message.success('修改成功！')
              } else {
                _this.$Message.warning(res.data.message)
              }
              _this.loading = false;
            })
          } else {
            this.$Message.warning('商品库存不能为空');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      }
    },
    mounted() {
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
