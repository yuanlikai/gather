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
            <Select v-model="item.Express" placeholder="请输入快递公司">
              <Option v-for="item in cityList3" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>

            <!--<Input :maxlength="20" type="text" v-model="item.Express" placeholder="请输入快递公司"></Input>-->


            <Input :maxlength="20" type="text" v-model="item.ExpressNo" placeholder="请输入物流单号"></Input>
          </Col>
          <Col span="4" offset="1">
            <Button @click="handleRemove(index)" size="small">删除</Button>
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
      <Button type="primary" @click="handleSubmit('formDynamic')">{{$route.query.idstr?'修改':'发货'}}</Button>
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
          Express: [],
          ExpressNo: [],
          Description: '',
        },
        ruleValidate: {

          Description: [
            {required: true, message: 'The name cannot be empty', trigger: 'blur'}
          ],
        },
        cityList3: [
          {
            value: '顺丰速运',
            label: '顺丰速运'
          },
          {
            value: '韵达快递',
            label: '韵达快递'
          },
          {
            value: '天天快递',
            label: '天天快递'
          },
          {
            value: '申通快递',
            label: '申通快递'
          },
          {
            value: '圆通速递',
            label: '圆通速递'
          },
          {
            value: '中通速递',
            label: '中通速递'
          },
          {
            value: '百世汇通',
            label: '百世汇通'
          },
          {
            value: 'EMS',
            label: 'EMS'
          },
          {
            value: '自提',
            label: '自提'
          },
        ],
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
        this.formDynamic.Express=[];
        this.formDynamic.ExpressNo=[];
        for(let i in _this.formDynamic.items){
          this.formDynamic.Express.push(_this.formDynamic.items[i].Express);
          this.formDynamic.ExpressNo.push(_this.formDynamic.items[i].ExpressNo);
        }
        this.$refs[name].validate((valid) => {
          if (valid) {
            _this.Axios.post('/Manage/Order/updateOrder', _this.Qs.stringify({
              idstr: _this.formDynamic.idstr,
              statusid: 2,
              Express: _this.formDynamic.Express.join('，'),
              ExpressNo: _this.formDynamic.ExpressNo.join('，'),
              Description: _this.formDynamic.Description
            })).then(res => {
              if (res.data.error === 0) {
                _this.$Message.success('发货成功');
                _this.$emit('getOrder');
                _this.model = false;
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

