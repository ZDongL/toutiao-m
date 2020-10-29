<template>
  <van-icon :color="value===1 ? '#e5645f' : '#777'"
            :name="value===1 ? 'good-job' : 'good-job-o'"
            @click="onlike"
            :loading="loading" />
</template>

<script>
import { addLikeArticle, deleteLikeArticle } from '../../api/article'
export default {
  data () {
    return {
      loading: false
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onlike () {
      this.loading = true
      try {
        if (this.value === 1) {
          // 已点赞 点击取消点赞
          await deleteLikeArticle(this.articleId)
          this.$toast.success('取消点赞')
          // 更新视图
          this.$emit('input', 0)
        } else {
          // 未点赞 点击点赞
          await addLikeArticle(this.articleId)
          this.$toast.success('点赞成功')
          // 更新视图
          this.$emit('input', 1)
        }
      } catch (err) {
        this.$toast.fail('操作失败，请重试')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
