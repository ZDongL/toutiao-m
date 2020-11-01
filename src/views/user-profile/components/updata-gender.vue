<template>
  <div class="updata-gander">
    <van-picker title="更改性别"
                show-toolbar
                :columns="columns"
                @confirm="onConfirm"
                @cancel="$emit('close')"
                :default-index="value" />
  </div>
</template>

<script>
import { updataUserProfile } from '../../../api/user'
export default {
  data () {
    return {
      columns: ['男', '女']
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {

    async onConfirm (value, index) {
      // console.log(`当前值：${value}, 当前索引：${index}`)
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        await updataUserProfile({
          gender: index
        })
        // 更新视图
        this.$emit('input', index)
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
</style>
