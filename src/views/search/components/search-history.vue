<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('claer-searchhistory')">全部删除</span>
        &nbsp; &nbsp; &nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else
                name="delete"
                @click="isDeleteShow = true" />
    </van-cell>
    <van-cell v-for="(item,i) in searchHistory"
              :key="i"
              :title="item"
              @click="onSearchItemClick(item,i)">
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
  },
  methods: {
    onSearchItemClick (item, i) {
      if (this.isDeleteShow) {
        this.searchHistory.splice(i, 1)
        // 删除状态
      } else {
        // 搜索状态
        this.$emit('search', item)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
