<template>
  <div class="login">
    <div class="page-account-container">
      <div class="page-account-top">
        <div class="page-account-top-logo"><img src="https://file.iviewui.com/admin-pro-dist/img/logo.6871ef17.png"
                                                alt="logo"></div>
        <div class="page-account-top-desc">iView Admin Pro 企业级中台前端/设计解决方案</div>
      </div>
      <div class="ivu-login">
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem prop="user" style="width: 100%">
            <Input style="width: 100%;height: 36px;" prefix="ios-contact-outline" v-model="formInline.user" placeholder="Username" />
          </FormItem>
          <FormItem prop="password" style="width: 100%">
            <Input style="width: 100%;height: 36px;" prefix="ios-lock-outline" v-model="formInline.password" placeholder="Password" />
          </FormItem>
          <FormItem style="width: 100%">
            <Button style="width: 100%;height: 36px;" type="primary" @click="handleSubmit('formInline')">登录</Button>
          </FormItem>
        </Form>
      </div>
      <div class="page-account-other"><span>其它登录方式</span>
        <img src="https://file.iviewui.com/admin-pro-dist/img/icon-social-wechat.c69ec08c.svg" alt="wechat">
        <img src="https://file.iviewui.com/admin-pro-dist/img/icon-social-qq.2cf4276d.svg" alt="qq">
        <img src="https://file.iviewui.com/admin-pro-dist/img/icon-social-weibo.cbf658a0.svg" alt="weibo">
        <a href="/register" class="page-account-register">注册账户</a>
      </div>
    </div>
    <footer class="ivu-global-footer i-copyright" style="position: fixed">
      <div class="ivu-global-footer-links">
        <a href="http://www.e6best.com/" target="_blank" title="官网">官网</a>
        <a href="http://www.e6best.com/" target="_blank" title="社区">社区</a></div>
      <div class="ivu-global-footer-copyright">Copyright © 2019 上海怡乐畅购智能技术有限公司</div>
    </footer>
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
                _this.$router.push('/table')
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

<style lang="less">

</style>
