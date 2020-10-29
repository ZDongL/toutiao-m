<template>
  <van-button v-if="is_followed"
              round
              :loading='loading'
              size="small"
              @click="onFollow">已关注</van-button>

  <van-button v-else
              type="info"
              color="#3296fa"
              round
              size="small"
              :loading='loading'
              @click="onFollow"
              icon="plus">关注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '../../api/user'

export default {
  data () {
    return {
      loading: false
    }
  },
  props: {
    is_followed: {
      type: Boolean,
      required: true
    },
    user_id: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onFollow () {
      this.loading = true // 展示关注按钮的 loading 状态
      try {
        if (this.is_followed) {
        // 已关注状态 点击取消关注
          await deleteFollow(this.user_id)
          this.$toast.success('取消关注成功')
        } else {
        // 未关注状态 点击关注
          await addFollow(this.user_id)
          this.$toast.success('关注成功')
        }

        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        this.$emit('updata-is_followed', !this.is_followed)
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast('你不能关注你自己！')
        } else {
          this.$toast('操作失败，请重试')
        }
      }
      this.loading = false // 关闭关注按钮的 loading 状态
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
