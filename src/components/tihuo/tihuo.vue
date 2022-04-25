<template>
  <div style="min-height: 100VH;background: #ffffff">
    <div class="page">
      <div class="weui-form" style="padding-top: 0">
        <div class="weui-form__control-area">
          <div class="weui-cells__group weui-cells__group_form">
            <div class="weui-cells__title">员工信息</div>
            <div class="weui-cells">
              <label for="js_input1" class="weui-cell weui-cell_active" id="js_cell">
                <div class="weui-cell__hd"><span class="weui-label">手机号码</span></div>
                <div class="weui-cell__bd weui-flex">
                  <input v-model="info.YgPhone" id="js_input1" class="weui-input" type="text" pattern="[0-9]*"
                         placeholder="请输入手机号码"
                         maxlength="16"/>
                </div>
              </label>
              <label for="js_input2" class="weui-cell weui-cell_active">
                <div class="weui-cell__hd"><span class="weui-label">员工姓名</span></div>
                <div class="weui-cell__bd weui-flex">
                  <input v-model="info.YgName" id="js_input2" class="weui-input" type="text" placeholder="请输入员工姓名"/>
                </div>
              </label>
              <label for="js_input2" class="weui-cell weui-cell_active">
                <div class="weui-cell__hd"><span class="weui-label">员工部门</span></div>
                <div class="weui-cell__bd weui-flex">
                  <input v-model="info.YgDept" id="js_input2" class="weui-input" type="text" placeholder="请输入员工部门"/>
                </div>
              </label>
            </div>
          </div>
          <div class="weui-cells__group weui-cells__group_form">
            <div class="weui-cells__title">收货信息</div>
            <div class="weui-cells">
              <label for="js_input1" class="weui-cell weui-cell_active" id="js_cell">
                <div class="weui-cell__hd"><span class="weui-label">收货姓名</span></div>
                <div class="weui-cell__bd weui-flex">
                  <input v-model="info.ShName" id="js_input1" class="weui-input" type="text" placeholder="请输入收货姓名"/>
                </div>
              </label>
              <label for="js_input2" class="weui-cell weui-cell_active">
                <div class="weui-cell__hd"><span class="weui-label">手机号码</span></div>
                <div class="weui-cell__bd weui-flex">
                  <input v-model="info.ShPhone" id="js_input2" class="weui-input" type="text" placeholder="请输入手机号码"/>
                </div>
              </label>
              <label for="js_input2" class="weui-cell weui-cell_active">
                <div class="weui-cell__hd"><span class="weui-label">街道</span></div>
                <div class="weui-cell__bd weui-flex">
                  <input v-model="info.ShStreet" id="js_input2" class="weui-input" type="text" placeholder="请输入街道"/>
                </div>
              </label>
              <label class="weui-cell weui-cell_active">
                <div class="weui-cell__hd"><span class="weui-label">省市区</span></div>
                <div class="weui-cell__bd weui-flex" @click="getSsq">
                  <p v-if="ssq.length===0" style="color: #b2b2b2">请选择省市区</p>
                  <p v-else>{{ ssq[0].label }} {{ ssq[1].label }} {{ ssq[2].label }}</p>
                </div>
              </label>
              <label for="js_input2" class="weui-cell weui-cell_active">
                <div class="weui-cell__hd"><span class="weui-label">详细地址</span></div>
                <div class="weui-cell__bd weui-flex">
                  <textarea v-model="info.ShAddress" id="js_input2" class="weui-textarea" placeholder="请输入详细地址"
                            rows="3"></textarea>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div class="weui-form__opr-area">
          <p @click="submit()" role="button" aria-disabled="true" class="weui-btn weui-btn_primary" href="javascript:"
             id="showTooltips">{{info.id===0?'确定':'修改'}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tihuo",
  data() {
    return {
      info: {
        id: 0,
        YgPhone: '',
        YgName: '',
        YgDept: '',
        ShName: '',
        ShPhone: '',
        ShStreet: '',
        ShCity: '',
        ShArea: '',
        ShAddress: '',
      },
      ssq: [],
      status: 0
    }
  },
  created() {
    document.title = '提货'
    if(this.$route.query.info){
      this.info = JSON.parse(this.$route.query.info)
      console.log(this.info.ShCity)
      this.ssq = [{label:this.info.ShCity},{label:this.info.ShCity},{label:this.info.ShArea}]
    }
  },
  methods: {
    info(i) {
      this.status = i
    },
    submit() {
      console.log()
      if (!(/^1[3456789]\d{9}$/.test(this.info.YgPhone))) {
        weui.topTips('请填写正确员工手机号码');
      } else if (this.info.YgName.length < 1) {
        weui.topTips('请填写员工姓名');
      } else if (this.info.YgDept.length < 1) {
        weui.topTips('请填写员工部门');
      } else if (this.info.ShName.length < 1) {
        weui.topTips('请填写收货姓名');
      } else if (!(/^1[3456789]\d{9}$/.test(this.info.ShPhone))) {
        weui.topTips('请填写正确收货手机号');
      } else if (this.info.ShStreet.length < 1) {
        weui.topTips('请填写街道');
      } else if (this.ssq.length < 1) {
        weui.topTips('请选择省市区');
      } else if (this.info.ShAddress.length < 1) {
        weui.topTips('请填写详细地址');
      } else {
        this.info.ShCity = this.ssq[1].label
        this.info.ShArea = this.ssq[2].label
        this.Axios.post('/tempweb/EditTemp.ashx', this.info).then(res => {
          if (res.data.error === 0) {
            weui.toast('提交成功', 3000);
            setTimeout(() => {
              this.$router.push({
                path: '/tihuo/select',
                status: 'edit'
              })
            }, 3000)
          } else {
            weui.topTips(res.data.errorMsg);
          }
        })
      }
    },
    getSsq() {
      const _this = this;
      weui.picker([
        {
          label: '上海',
          value: 0,
          children: [
            {
              label: '上海市',
              value: 0,
              children: [
                {
                  label: '黄浦区',
                  value: 0
                },
                {
                  label: '徐汇区',
                  value: 0
                },
                {
                  label: '长宁区',
                  value: 0
                },
                {
                  label: '静安区',
                  value: 0
                },
                {
                  label: '普陀区',
                  value: 0
                },
                {
                  label: '虹口区',
                  value: 0
                },
                {
                  label: '杨浦区',
                  value: 0
                },
                {
                  label: '闵行区',
                  value: 0
                },
                {
                  label: '宝山区',
                  value: 0
                },
                {
                  label: '嘉定区',
                  value: 0
                },
                {
                  label: '浦东新区',
                  value: 0
                },
                {
                  label: '金山区',
                  value: 0
                },
                {
                  label: '松江区',
                  value: 0
                },
                {
                  label: '青浦区',
                  value: 0
                },
                {
                  label: '奉贤区',
                  value: 0
                },
                {
                  label: '崇明区',
                  value: 0
                },
              ]
            }
          ]
        },
      ], {
        className: 'custom-classname',
        container: 'body',
        onConfirm: function (result) {
          _this.ssq = result
          console.log(result)
        },
        id: 'doubleLinePicker'
      });
    }
  }
}
</script>

<style scoped>

</style>
