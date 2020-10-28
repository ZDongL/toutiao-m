<template>
  <div class="article-list">
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isrefLoading"
                      @refresh="onRefresh"
                      :success-text="successText"
                      :success-duration="1000">
      <!-- 文章列表 -->
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                :error.sync="error"
                error-text="请求失败，点击重新加载">
        <!-- <van-cell v-for="(v,i) in list" :key="i" :title="v.title" /> -->
        <article-item v-for="(article,i) in list"
                      :key="i"
                      :article="article"></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '../../../api/article'
import ArticleItem from '../../../components/article-item/index'
export default {
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleItem
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isrefLoading: false, // 控制下拉刷新的 loading 状态
      successText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getArticle({
          channel_id: this.channel.id, // 频道ID
          // 如果请求第1页数据：当前最新时间戳 Date.now
          // 如果请求之后的数据，使用本次接口返回的数据中的 pre_timestamp
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data
        // 数组的展开操作符，它会把数组元素一个一个拿出来
        this.list.push(...results)

        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将 finished 设置为 true，不再 load 加载更多了
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true
        // 请求失败了，loading 也需要关闭
        this.loading = false
      }
    },

    // 当下拉刷新的时候会触发调用该函数
    async onRefresh () {
      try {
        // 1. 请求获取数据
        const { data } = await getArticle({
          channel_id: this.channel.id, // 频道ID
          timestamp: Date.now(),
          with_top: 1
        })

        // 2. 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3. 关闭下拉刷新的 loading 状态
        this.isrefLoading = false
        // 更新下拉刷新成功提示的文本
        this.successText = `刷新成功，更新了${results.length}数据`
      } catch (err) {
        this.isrefLoading = false
        this.successText = '刷新失败'
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.article-list {
  // 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
  // 1vw = 视口宽度的百分之一
  // 1vh = 视口高度的百分之一
  height: 79vh;
  overflow-y: auto;
}
</style>
