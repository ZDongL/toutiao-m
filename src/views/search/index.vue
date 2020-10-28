<template>
  <div class="search-container">

    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮 -->
    <form action="/"
          class="search-form">
      <van-search v-model="searchText"
                  show-action
                  background="#3296FA"
                  placeholder="请输入搜索关键词"
                  @search="onSearch"
                  @cancel="onCancel"
                  @focus="isResultShow = false" />
    </form>

    <!-- 搜索结果 -->
    <search-result :searchText="searchText"
                   v-if="isResultShow"></search-result>

    <!-- 搜索建议 -->
    <search-suggestion v-else-if="searchText"
                       :searchText="searchText"
                       @search="onSearch"></search-suggestion>

    <!-- 搜索历史 -->
    <search-history v-else
                    :searchHistory="searchHistory"
                    @search="onSearch"
                    @claer-searchhistory="searchHistory = []"></search-history>

  </div>
</template>

<script>
import searchHistory from './components/search-history'
import searchSuggestion from './components/search-suggestion'
import searchResult from './components/search-result'
import { setItem, getItem } from '../../utils/storage'
export default {
  data () {
    return {
      searchText: '',
      isResultShow: false, // 控制搜索结果的展示
      searchHistory: getItem('TOUTIAO_SEARCH_HISTORY') || []
    }
  },
  components: {
    searchHistory,
    searchSuggestion,
    searchResult
  },
  methods: {
    onSearch (val) {
      this.searchText = val
      const index = this.searchHistory.indexOf(val)
      if (index !== -1) {
        this.searchHistory.splice(index, 1)
      }
      this.searchHistory.unshift(val)

      this.isResultShow = true
    },
    onCancel () {
      this.$router.push('/home')
    }
  },
  watch: {
    searchHistory (val) {
      setItem('TOUTIAO_SEARCH_HISTORY', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
  }
}
</style>
