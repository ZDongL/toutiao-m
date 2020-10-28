<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title"
           class="title-text">我的频道</div>
      <van-button type="danger"
                  class="edit-btn"
                  plain
                  size="mini"
                  @click="editChannel"
                  round>{{isEdit ? '完成' : '编辑'}}</van-button>
    </van-cell>

    <van-grid :gutter="10"
              class="my-grid">
      <van-grid-item v-for="(channel,i) in myChannels"
                     :key="i"
                     @click="myChannelClick(channel,i)"
                     class="grid-item">
        <van-icon slot="icon"
                  name="close"
                  v-show="isEdit && channel.id !== 0"></van-icon>
        <!-- true，则作用该类名  false，不作用类名  :class="{active : active===i}"-->
        <span slot="text"
              class="text"
              :class="{active : active===i}">{{channel.name}}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title"
           class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10"
              class="recommend-grid">
      <van-grid-item v-for="(channel, i) in recommedChannels"
                     :key="i"
                     icon="plus"
                     class="grid-item"
                     @click="onAddChannel(channel)"
                     :text="channel.name" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '../../..//api/channel'
import { mapState } from 'vuex'
import { setItem } from '../../../utils/storage'
export default {
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false // 控制编辑状态的显
    }
  },
  created () {
    this.loadALLChannels()
  },
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  methods: {
    async loadALLChannels () {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取频道数据失败')
      }
    },
    async onAddChannel (channel) {
      this.myChannels.push(channel)

      // 数据持久化处理
      if (this.user) {
        try {
          // 已登录，把数据请求接口放到线上
          await addUserChannel({
            id: channel.id, // 频道ID
            seq: this.myChannels.length // 序号
          })
        } catch (err) {
          this.$toast('保存频道失败，请稍后重试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNEL', this.myChannels)
      }
    },
    editChannel () {
      this.isEdit = !this.isEdit
    },
    async myChannelClick (channel, i) {
      if (this.isEdit) {
        // 1. 如果是默认推荐频道，则不删除
        if (channel.id === 0) {
          return
        }

        // 3. 如果删除的激活频道之前的频道，则更新激活的频道项
        if (i <= this.active) {
          // 让激活频道的索引 - 1
          this.$emit('updata-active', this.active - 1, true)
        }

        // 2. 删除频道项
        this.myChannels.splice(i, 1)
        // 4, 数据持久化处理
        if (this.user) {
        // 登录状态
          try {
            // 已登录，把数据请求接口放到线上
            await deleteUserChannel(channel.id)
          } catch (err) {
            this.$toast('删除频道失败，请稍后重试')
          }
        } else {
          // 未登录，把数据存储到本地
          setItem('TOUTIAO_CHANNEL', this.myChannels)
        }
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('updata-active', i, false)
      }
    }
  },
  computed: {
    ...mapState(['user']),
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommedChannels () {
      // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
      return this.allChannels.filter(channel => {
        // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
        return !this.myChannels.find(myChannel => myChannel.id === channel.id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 46px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  ::v-deep .grid-item {
    height: 86px;
    width: 160px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        margin: 0;
        color: #222222;
      }
      .active {
        color: red;
      }
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
  }
  ::v-deep .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 26px;
          margin-right: 6px;
        }
      }
    }
  }
  ::v-deep .my-grid {
    .grid-item {
      .van-icon-close {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 10px;
        z-index: 2;
      }
    }
  }
}
</style>
