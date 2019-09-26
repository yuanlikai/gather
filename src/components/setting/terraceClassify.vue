<template>
  <div class="content">
    <Card style="border:none;margin: 16px 0;">
      <div class="ivu-page-header-title">平台映射</div>
    </Card>
    <Card :style="{margin: '16px 20px', background: '#fff',height:'auto'}">
      <Tree @on-check-change="check" :data="data" show-checkbox style="margin-left: 50px"></Tree>
    </Card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        data: [],
        Tree:[],
      }
    },
    methods: {

      check(data){
        const _this = this;
        let categoryIds=[];
        let cancelCategoryIds=[];
        for (let i in data){
          data[i].treeLevel===3?categoryIds.push(data[i].id):'';
        }
        for (let i in _this.Tree){
          if(categoryIds.indexOf(_this.Tree[i])===-1){
            cancelCategoryIds.push(_this.Tree[i])
          }
        }
        _this.Axios.post('/Manage/Category/relevanceCategory',_this.Qs.stringify({
          platformId:_this.$route.query.id,     //平台id
          cancelCategoryIds:cancelCategoryIds.length>0?cancelCategoryIds:[''],     //取消的三级分类id集合
          categoryIds:categoryIds.length>0?categoryIds:[''],     //选中的三级分类id集合
        }, {indices: false})).then(res=>{
         if(res.data.code===0){
           _this.getTree();
           _this.$Message.success('设置成功')
          }else {
           _this.$Message.warning(res.data.message)
         }
        });
      },

      //获取分类树形结构
      getList(){
        const _this = this;
        _this.Axios.get('/Manage/Category/categoryPlatformRelation',{
          params:{
            platformId: _this.$route.query.id
          }
        }).then(res=>{
          _this.data=res.data.data
        })
      },

      //获取第三级分类
      getTree(){
        const _this = this;
        _this.Axios.get('/Manage/Category/selectedCategory',{
          params:{
            platformId: _this.$route.query.id
          }
        }).then(res=>{
          _this.Tree=res.data.data
        })

      }
    },
    mounted() {
      this.getList();
      this.getTree();
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
