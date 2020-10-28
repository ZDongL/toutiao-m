<template>
  <div class="search-suggestion">

    <van-cell v-for="(text,i) in suggestion"
              :key="i"
              @click="$emit('search', text)"
              icon="search">
      <!-- 使用 v-html 指令可以绑定渲染带有 HTML 标签的字符串 -->
      <div slot="title"
           v-html="highlight(text)"></div>
    </van-cell>

  </div>
</template>

<script>
import { getSuggestion } from '../../../api/search'
// 按需导入防抖的包
import { debounce } from 'lodash'
export default {
  data () {
    return {
      suggestion: [], // 联想建议数据列表
      htmlStr: 'hello <span style="color : red">world</span>'
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    searchText: {
      // debounce 函数 (参数1)：一个函数,  (参数2)：延迟时间，单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function (value) {
        this.loadSuggestion(value)
      }, 200),

      // 当 searchText 发生改变的时候就会调用 handler 函数
      // 注意：handler 函数名称是固定的
      // handler (value) {
      //   this.loadSuggestion(value)
      // },
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    async loadSuggestion (q) {
      try {
        const { data } = await getSuggestion(q)
        this.suggestion = data.data.options
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, `<span style="color : #3296fa">${this.searchText}</span>`)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
