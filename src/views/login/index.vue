<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录"
                 class="page-nav-bar">
      <van-icon slot="left"
                name="arrow-left"
                @click="$router.back()"></van-icon>
    </van-nav-bar>

    <!-- 登录表单 -->
    <van-form @submit="onSubmit"
              ref="loginFrom">
      <van-field v-model="user.mobile"
                 name="mobile"
                 placeholder="请输入手机号"
                 :rules="userFromRules.mobile"
                 type="number"
                 maxlength="11">
        <i slot="left-icon"
           class="iconfont iconshouji"></i>
      </van-field>
      <van-field v-model="user.code"
                 name="code"
                 placeholder="请输入验证码"
                 :rules="userFromRules.code"
                 type="number"
                 maxlength="6">
        <i slot="left-icon"
           class="iconfont iconyanzhengma"></i>
        <template #button>
          <van-count-down :time="1000 * 60"
                          format="ss s"
                          v-if="isCountDown"
                          @finish="isCountDown = false" />
          <van-button @click="onSendSms"
                      round
                      class="send-sms-btn"
                      size="small"
                      type="default"
                      native-type="button"
                      v-else>获取验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-warp">
        <van-button class="login-btn"
                    round
                    block
                    type="info"
                    native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      userFromRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }

        ]
      },
      isCountDown: false // 是否展示倒计时
    }
  },
  methods: {
    async onSubmit () {
      // 1. 获取表单数据
      const users = this.user
      // 2. 表单验证

      // 1. 展示登陆中 loading
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认 2000，0 表示持续展示不关闭
      })

      // 3. 提交表单请求登录
      try {
        const { data } = await login(users)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')

        // 登录成功，跳转回原来页面
        // back 的方式不严谨，后面讲功能优化的时候再说
        this.$router.push('/home')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
    },
    async onSendSms () {
      // 1. 校验手机号
      try {
        await this.$refs.loginFrom.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2. 验证通过，显示倒计时
      this.isCountDown = true

      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDown = false
        if (err.response.status === 429) {
          this.$toast('发送验证码过于频繁，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.login-container {
  .iconshouji,
  .iconyanzhengma {
    font-size: 37px;
  }

  .send-sms-btn {
    width: 168px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 20px;
    color: #666;
  }
  .login-btn-warp {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
