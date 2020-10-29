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
    // Prop 数据
    //  Prop 是受父组件数据影响的
    //    如果是普通数据（数字、字符串、布尔值）绝对不能修改
    //    即便改了也不会传导给父组件
    //
    //    如果是引用类型数据（数组、对象）
    //        可以修改，例如 [].push(xxx)，对象.xxx = xxx
    //        不能重新赋值, xxx = []
    searchHistory: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isDeleteShow: false // 控制删除显示状态
    }
  },
  methods: {
    onSearchItemClick (item, i) {
      if (this.isDeleteShow) {
        this.searchHistory.splice(i, 1)
        // 删除状态，删除历史记录数据
      } else {
        // 非删除状态，直接进入搜索
        this.$emit('search', item)
      }
    }
  }

}
</script>

<style lang="scss" scoped>
</style>
