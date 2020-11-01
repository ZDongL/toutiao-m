<template>
  <div class="updata-photo">
    <img :src="img"
         alt=""
         ref="img"
         class="img">
    <div class="tolbar">
      <div class="cancel"
           @click="$emit('close')">取消</div>
      <div class="confirm"
           @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updataUserPhoto } from '../../../api/user'

export default {
  data () {
    return {
      cropper: null
    }
  },
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  mounted () {
    // vue里面操作dom元素 用ref来操作 ref="img"
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false

    })
  },
  methods: {
    onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      // 基于服务端的裁切使用 getData 方法获取裁切参数
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(async blob => {
        try {
          // 错误的用法
        // 如果接口要求 Content-Type 是 application/json
        // 则传递普通 JavaScript 对象
        // updateUserPhoto({
        //   photo: blob
        // })

          // 如果接口要求 Content-Type 是 multipart/form-data
          // 则你必须传递 FormData 对象
          const formData = new FormData()
          formData.append('photo', blob)

          const { data } = await updataUserPhoto(formData)

          // 关闭弹出层
          this.$emit('close')

          // 更新视图
          this.$emit('updata-photo', data.data.photo)
          // 提示成功
          this.$toast.success('更新成功')
        } catch (error) {
          this.$toast.fail('更新失败，请重试')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.updata-photo {
  height: 100%;
  background-color: #000;
  .img {
    max-width: 100%;
    display: block;
  }
  .tolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      height: 90px;
      width: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>
