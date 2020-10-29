<template>
  <van-icon :color="value ? '#ffa500' : '#777'"
            :name="value ? 'star' : 'star-o'"
            @click="onCollect"
            :loading="loading" />
</template>

<script>
import { addCollect, deleteCollect } from '../../api/article'
export default {
  data () {
    return {
      loading: false
    }
  },
  props: {
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏 点击取消收藏
          await deleteCollect(this.articleId)
          this.$toast.success('取消收藏')
        } else {
          // 未收藏 点击收藏
          await addCollect(this.articleId)
          this.$toast.success('收藏成功')
        }

        // 更新视图
        // 自定义事件修改数据并不是立即的
        this.$emit('input', !this.value)
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
