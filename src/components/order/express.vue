<style lang="less">
  .ivu-tree li ul {
    padding: 0 0 0 60px;
  }
</style>
<template>
  <Modal v-model="model" width="360">
    <p slot="header" style="text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>请填写发货信息</span>
    </p>
    <Form ref="formDynamic" :model="formDynamic" :label-width="84" style="width: 300px">
      <FormItem
        v-for="(item, index) in formDynamic.items"
        :key="index"
        :label="`快递信息(${index+1})`"
        :prop="'items.' + index + '.Express'"
        :rules="{ validator: validatePass,required: true, index: index, trigger: 'change'}">
        <Row>
          <Col span="18">
            <Input type="text" v-model="item.Express" placeholder="请输入快递公司"></Input>
            <Input type="text" v-model="item.ExpressNo" placeholder="请输入物流单号"></Input>
          </Col>
          <Col span="4" offset="1">
            <Button @click="handleRemove(index)">Delete</Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem>
        <Row>
          <Col span="12">
            <Button type="dashed" long @click="handleAdd" icon="md-add">添加快递</Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="备注信息" prop="Description">
        <Input type="textarea" v-model="formDynamic.Description" placeholder="请输入"></Input>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="handleSubmit('formDynamic')">发货</Button>
    </div>
  </Modal>
</template>
<script>
  export default {
    data() {

      return {
        model: false,
        formDynamic: {
          items: [
            {
              Express: '',
              ExpressNo: ''
            }
          ],
          idstr:'',
          Description: '',
        }
      }
    },
    methods: {
      validatePass (rule, value, callback) {
        const item = this.formDynamic.items[rule.index]
        if(item.Express&&item.ExpressNo){
          callback();
        }else {
          callback(new Error(`物流信息(${rule.index+1})不能为空`));
        }
      },
      handleSubmit(name) {
        const _this = this;
        this.$refs[name].validate((valid) => {
          if (valid) {
            _this.Axios.post('/Manage/Order/updateOrder', _this.Qs.stringify({
              idstr: _this.formValidate1.idstr,
              statusid: 2,
              Express: _this.formValidate1.Express,
              ExpressNo: _this.formValidate1.ExpressNo,
              Description: _this.formValidate1.Description
            })).then(res => {
              if (res.data.error === 0) {
                _this.$Message.success('发货成功');
                _this.getOrder();
                _this.modal1 = false;
              } else {
                _this.$Message.error(res.data.errorMsg);
              }
            })
          } else {
            this.$Message.error('请填写物流信息！');
          }
        })
      },
      handleAdd() {
        this.formDynamic.items.push({
          Express: '',
          ExpressNo: ''
        });
      },
      handleRemove(index) {
        if(this.formDynamic.items.length>1){
          this.formDynamic.items.splice(index,1)
        }else {
          this.$Message.warning('至少填写一个物流信息！')
        }
      }
    }
  }
</script>

