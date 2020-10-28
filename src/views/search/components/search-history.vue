<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span>全部删除</span>
        &nbsp; &nbsp; &nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else
                name="delete"
                @click="isDeleteShow = true" />
    </van-cell>
    <van-cell v-for="(item,i) in searchHistory"
              :key="i"
              :title="item">
      <van-icon v-show="isDeleteShow"
                name="close" />
    </van-cell>
  </div>
</template>

<script>
export default {
  props: {
    searchHistory: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
