<template>
  <div>
    <Modal v-model="modal" width="460">
      <p slot="header" style="text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>导出订单</span>
      </p>
      <div>
        {{total}}
        <Tag v-for="(item,index) in 12000/100" :key="index" class="tag-dow" color="default">1-100条 <Icon type="md-checkmark" /></Tag>
        <Tag class="tag-dow" color="default">101-200条</Tag>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long >关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: "downloadOrder",
    props:['total'],
    data() {
      return {
        modal:true,

      }
    },
    computed:{
      totalNum:()=>{
        console.log(this.total)
        return 1
      }
    },
    methods:{

    },
    mounted(){
      console.log(this.total)
    }
  }
</script>

<style scoped>
  .tag-dow{
    width: 23%;
    text-align: center;
  }

</style>
