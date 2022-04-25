<template>

  <div style="min-height: 100VH;background: #ffffff">
    <div class="page" style="padding-top: 48px">
      <p @click="btnC(1)" href="#button_default" role="button" class="weui-btn weui-btn_default">填写信息</p>
      <p @click="btnC(2)" href="#button_default" role="button" class="weui-btn weui-btn_default">修改信息</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "select",
  created() {
    document.title = '提货'
  },
  methods:{
    btnC(e){
      if(e===1){
        this.$router.push({
          path:'/tihuo/index',
        })
      }else if(e===2){
        this.$router.push({
          path:'/tihuo/edit',
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
