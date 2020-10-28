import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语音包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// dayjs 默认语言是英语  把他配置为中文
dayjs.locale('zh-cn') // 全局使用

// 获取当前最新的时间
// console.log(dayjs().format('YYYY-MM-DD'))

// 定义一个全局过滤器，然后就可以在任何组件的模板中使用了
// 其实过滤器就相当于一个全局可用的方法（仅供模板使用）
// 参数1：过滤器名称
// 参数2：过滤器函数
// 使用方式：{{ 表达式 | 过滤器名称 }}
Vue.filter('relativeTime', (value) => {
  return dayjs().to(dayjs(value))
})
