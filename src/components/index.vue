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
            <Input @on-enter="handleSubmit('formInline')" style="width: 100%;height: 36px;" prefix="ios-contact-outline"
                   v-model="formInline.user"
                   placeholder="Username"/>
          </FormItem>
          <FormItem prop="password" style="width: 100%">
            <Input @on-enter="handleSubmit('formInline')" height="36px" style="width: 100%;height: 36px;"
                   prefix="ios-lock-outline"
                   v-model="formInline.password" type="password" placeholder="Password"/>
          </FormItem>
          <FormItem style="width: 100%">
            <Button style="width: 100%;height: 36px;" type="primary" :loading="loading"
                    @click="handleSubmit('formInline')">登录
            </Button>
            <p class="version">当前版本 V2.1</p>
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
        loading: false,
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
            _this.loading = true;
            _this.Axios.post('/Login.ashx', {
              username: _this.formInline.user.replace(/ /g, ''),
              password: _this.formInline.password.replace(/ /g, '')
            }).then(res => {
              console.log(res.data)
              if (res.data.error === 0) {
                localStorage.setItem('menuList', JSON.stringify(res.data.data.sort(function (a, b) {
                  return Number(a.numb) - Number(b.numb)
                })));
                localStorage.setItem('menu1', res.data.data[0].numb);
                localStorage.setItem('menu', res.data.data[0].children[0].children[0].numb);
                localStorage.setItem('user', _this.formInline.user.replace(/ /g, ''));
                _this.$router.push(res.data.data[0].children[0].children[0].to);
                _this.loading = false;
              } else {
                _this.$Message.error(res.data.errorMsg);
                _this.loading = false;
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

  .version {
    width: 100%;
    text-align: right;
    color: #777777;
  }
</style>
