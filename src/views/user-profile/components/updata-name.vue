<template>
  <div class="updata-name">
    <!-- 导航栏 -->
    <van-nav-bar title="更改昵称"
                 left-text="取消"
                 right-text="完成"
                 @click-left="$emit('close')"
                 @click-right="onConfrim"></van-nav-bar>

    <!-- 输入框 -->
    <div class="filed-wrap">
      <van-field v-model.trim="localName"
                 rows="2"
                 autosize
                 type="textarea"
                 maxlength="7"
                 placeholder="请输入昵称"
                 show-word-limit />
    </div>
  </div>
</template>

<script>
import { updataUserProfile } from '../../../api/user'
export default {
  data () {
    return {
      localName: this.value
    }
  },
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    async onConfrim () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        if (this.localName.length <= 0) {
          return this.$toast('昵称不能为空')
        } else {
          await updataUserProfile({
            name: this.localName
          })
        }
        // 更新视图
        this.$emit('input', this.localName)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败，请重试')
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.updata-name {
  .filed-wrap {
    padding: 20px;
  }
}
</style>
