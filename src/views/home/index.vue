<template>
  <div class="home-container">
    <!-- 搜索导航栏 -->
    <van-nav-bar class="page-nav-bar"
                 fixed>
      <van-button slot="title"
                  type="info"
                  icon="search"
                  class="search-btn"
                  to="/search"
                  round>搜索</van-button>
    </van-nav-bar>

    <!-- 频道列表 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页 -->
    <van-tabs v-model="active"
              animated
              swipeable
              class="channel-tabs">
      <van-tab v-for="channel in channels"
               :key="channel.id"
               :title="channel.name">
        <!-- 频道列表 -->
        <article-list :channel="channel"></article-list>
      </van-tab>
      <div slot="nav-right"
           class="placeholder"></div>
      <div slot="nav-right"
           class="hamburger-btn"
           @click="isChannelShow = true">
        <i class="iconfont icongengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道编辑弹出层 -->
    <van-popup v-model="isChannelShow"
               closeable
               round
               position="bottom"
               :style="{ height: '100%' }"
               close-icon-position="top-left">
      <channel-edit :my-channels="channels"
                    :active="active"
                    @updata-active="updataActive"></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannel } from '../../api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '../../utils/storage'
export default {
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelShow: false // 控制编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  created () {
    this.loadChannles()
  },
  methods: {
    // 获取用户频道列表
    async loadChannles () {
      let channels = []

      if (this.user) {
        // 已登录，请求获取用户频道列表
        const { data } = await getUserChannel()
        channels = data.data.channels
      } else {
        // 未登录，判断是否有本地的频道列表数据
        const localChannel = getItem('TOUTIAO_CHANNEL')

        if (localChannel) {
          //    有，拿来使用
          channels = localChannel
        } else {
          //    没有，请求获取默认频道列表
          const { data } = await getUserChannel()
          channels = data.data.channels
        }
      }
      this.channels = channels
    },
    updataActive (i, isChannelShow = true) {
      // 更新激活的频道项
      this.active = i
      // 关闭编辑频道弹层
      this.isChannelShow = isChannelShow
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  ::v-deep .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 42px;
    }
  }
  ::v-deep .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      right: 0;
      left: 0;
      top: 92px;
      z-index: 1;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0px;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      .iconfont {
        font-size: 33px;
      }
      &::before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background: url("../../assets/gradient-gray-line.png");
        background-size: contain;
      }
    }
  }
}
</style>
