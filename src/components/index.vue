<template>
  <div class="login">
    <div class="page-account-container">
      <div class="page-account-top">
        <div class="page-account-top-logo">
          <img src="../assets/img/logo.png" alt="logo"></div>
      </div>
      <div class="ivu-login">
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem prop="user" style="width: 100%">
            <Input @on-enter="handleSubmit('formInline')" style="width: 100%;height: 36px;" prefix="ios-contact-outline" v-model="formInline.user"
                   placeholder="Username"/>
          </FormItem>
          <FormItem prop="password" style="width: 100%">
            <Input @on-enter="handleSubmit('formInline')" height="36px" style="width: 100%;height: 36px;" prefix="ios-lock-outline"
                   v-model="formInline.password" type="password" placeholder="Password"/>
          </FormItem>
          <FormItem style="width: 100%">
            <Button style="width: 100%;height: 36px;" type="primary" @click="handleSubmit('formInline')">登录</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [
            {required: true, message: 'Please fill in the user name', trigger: 'blur'}
          ],
          password: [
            {required: true, message: 'Please fill in the password.', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //登录及校验
      handleSubmit(name) {
        const _this = this;
        _this.$refs[name].validate((valid) => {
          if (valid) {
            _this.Axios.post('/form/login', _this.Qs.stringify({
              username: _this.formInline.user,
              password: _this.formInline.password
            })).then(res => {
              if (res.data.code === 0) {
                console.log(res.data.data.sort(function(a,b){
                }));
                localStorage.setItem('menuList',JSON.stringify(res.data.data.sort(function(a,b){
                  return Number(a.numb)-Number(b.numb)
                })));
                localStorage.setItem('menu1',res.data.data[0].numb);
                localStorage.setItem('menu',res.data.data[0].children[0].children[0].numb);
                localStorage.setItem('user',_this.formInline.user);
                _this.$router.push(res.data.data[0].children[0].children[0].to)
              } else {
                _this.$Message.error(res.data.message);
              }
            });
          } else {
            _this.$Message.warning('请输入账号密码！');
          }
        })
      },
    },
    mounted() {
    }
  }
</script>

<style lang="less" scoped>

  .ivu-input {
    height: 36px;
  }
</style>
