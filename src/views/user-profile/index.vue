<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar"
                 title="个人信息"
                 left-arrow
                 @click-left="$router.back()"></van-nav-bar>

    <!-- 文件选择器 -->
    <input type="file"
           hidden
           @change="onFileChange"
           ref="file">

    <van-cell title="头像"
              is-link>
      <van-image class="avatar"
                 fit="cover"
                 round
                 @click="$refs.file.click()"
                 :src="user.photo" />
    </van-cell>
    <van-cell title="昵称"
              @click="isUpdataNameShow = true"
              :value="user.name"
              is-link></van-cell>
    <van-cell title="性别"
              @click="isUpdataGenderShow = true"
              :value="user.gender === 1 ? '女' : '男'"
              is-link></van-cell>
    <van-cell title="生日"
              @click="isUpdataBirthdayShow = true"
              :value="user.birthday"
              is-link></van-cell>

    <!-- 修改昵称弹出层 -->
    <van-popup v-model="isUpdataNameShow"
               position="bottom"
               :style="{ height: '100%' }">
      <updata-name v-if="isUpdataNameShow"
                   @close="isUpdataNameShow = false"
                   v-model="user.name"></updata-name>
    </van-popup>

    <!-- 修改性别弹出层 -->
    <van-popup v-model="isUpdataGenderShow"
               position="bottom">
      <updata-gender v-if="isUpdataGenderShow"
                     v-model="user.gender"
                     @close="isUpdataGenderShow = false"></updata-gender>
    </van-popup>

    <!-- 修改生日弹出层 -->
    <van-popup v-model="isUpdataBirthdayShow"
               position="bottom">
      <updata-birthday v-if="isUpdataBirthdayShow"
                       v-model="user.birthday"
                       @close="isUpdataBirthdayShow = false"></updata-birthday>

    </van-popup>

    <!-- 修改头像弹出层 -->
    <van-popup v-model="isUpdataPhotoShow"
               position="bottom"
               :style="{ height: '100%' }">
      <updata-photo v-if="isUpdataPhotoShow"
                    :img="img"
                    @close="isUpdataPhotoShow = false"
                    @updata-photo="user.photo = $event"></updata-photo>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '../../api/user'
import updataName from './components/updata-name'
import updataGender from './components/updata-gender'
import updataBirthday from './components/updata.birthday'
import updataPhoto from './components/updata-photo'
export default {
  data () {
    return {
      user: {}, // 用户的个人资料
      isUpdataNameShow: false,
      isUpdataGenderShow: false,
      isUpdataBirthdayShow: false,
      isUpdataPhotoShow: false,
      img: null
    }
  },
  created () {
    this.loadUserProfile()
  },
  components: {
    updataName,
    updataGender,
    updataBirthday,
    updataPhoto
  },
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (error) {
        this.$toast('数据加载失败')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)

      // 展示预览图片弹出层
      this.isUpdataPhotoShow = true

      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完毕，把它的 value 清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }
  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
