<template>
  <div style="min-height: 100VH;background: #ffffff">
    <div class="page">
      <div class="weui-form" style="padding-top: 0">
        <div class="weui-form__control-area">
          <div class="weui-cells__group weui-cells__group_form">
            <div class="weui-cells__title">修改信息</div>
            <div class="weui-cells">
              <label for="js_input1" class="weui-cell weui-cell_active" id="js_cell">
                <div class="weui-cell__hd"><span class="weui-label">手机号码</span></div>
                <div class="weui-cell__bd weui-flex">
                  <input v-model="phone" id="js_input1" class="weui-input" type="text" pattern="[0-9]*" placeholder="请输入手机号码"
                         maxlength="11"/>
                </div>
              </label>
            </div>
          </div>
          <div class="weui-form__opr-area" style="margin-top: 48px">
            <p @click="submit()" role="button" aria-disabled="true" class="weui-btn weui-btn_primary" href="javascript:"
               id="showTooltips">提交</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "edit",
  data() {
    return {
      phone:'',
    }
  },
  created() {
    document.title = '提货'
  },
  methods:{
    submit(){
      if(this.phone.length<1){
        weui.topTips('请输入手机号码');
      }else if(!(/^1[3456789]\d{9}$/.test(this.phone))){
        weui.topTips('请输入正确手机号');
      }else {
        this.Axios.post('/tempweb/CheckPhone.ashx',{
          YgPhone:this.phone
        }).then(res=>{
          if(res.data.error===0){
            this.$router.push({
              path:'/tihuo/index',
              query:{
                info:JSON.stringify(res.data)
              }
            })
          }else{
            weui.topTips(res.data.errorMsg);
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
