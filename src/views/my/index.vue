<template>
  <div class="my-container">

    <!-- 已登录头部 -->
    <div class="header user-info"
         v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar"
                     round
                     fit="cover"
                     :src="userInfo.photo" />
          <span class="uname">{{userInfo.name}}</span>
        </div>
        <div class="right">
          <van-button size="mini"
                      round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>

    <!-- 未登录头部 -->
    <div class="header not-login"
         v-else>
      <div class="login-btn"
           @click="$router.push('/login')">
        <img class="login-img"
             src="../../assets/mobile.png"
             alt="">
        <span class="text">登录 / 注册</span>
      </div>
    </div>

    <!-- 宫格导航 -->
    <van-grid :column-num="2"
              class="grid-nav"
              clickable>
      <van-grid-item class="grid-item">
        <i slot="icon"
           class="iconfont iconshoucang"></i>
        <span slot="text"
              class="text">收 藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon"
           class="iconfont iconlishi"></i>
        <span slot="text"
              class="text">历 史</span>
      </van-grid-item>
    </van-grid>

    <van-cell title="消息通知"
              is-link />
    <van-cell title="小智同学"
              is-link />

    <van-button type="default"
                size="large"
                class="out-login-btn"
                v-if="user"
                @click="outLogin">退出登录</van-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '../../api/user'
export default {
  data () {
    return {
      userInfo: {}// 用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    // 如果用户登录了，则请求加载用户信息数据
    if (this.user) {
      this.loadUserInfo()
    }
  },
  methods: {
    outLogin () {
      // 退出提示
      // 在组件中需要使用 this.$dialog 来调用弹框组件
      this.$dialog.confirm({
        title: '确认是否退出？'
      })
        .then(() => {
          // 确认退出：清除登录状态（容器中的 user + 本地存储中的 user）
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // console.log('取消了退出')
        })
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
        // console.log(data)
      } catch (err) {
        // console.log('数据请求失败，请稍后重试')
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.my-container {
  .header {
    height: 361px;
    background: url(~@/assets/banner.png);
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .login-img {
        height: 132px;
        width: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .uname {
          color: #fff;
          font-size: 30px;
        }
      }
      .right {
        .van-button {
          height: 32px;
          width: 134px;
        }
      }
    }
    .data-stats {
      height: 130px;
      display: flex;
      .data-item {
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav {
    .grid-item {
      height: 141px;
      margin-bottom: 9px;
      .iconfont {
        font-size: 45px;
      }
      .iconshoucang {
        color: #eb5253;
      }
      .iconlishi {
        color: #ff9d1d;
      }
      .text {
        font-size: 28px;
      }
    }
  }
  .out-login-btn {
    margin-top: 9px;
    font-size: 30px;
    color: #d86262;
  }
}
</style>
