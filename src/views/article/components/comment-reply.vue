<template>
  <div class="comment-reply">
    <van-nav-bar :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'">
      <van-icon slot="left"
                @click="$emit('close')"
                name="cross"></van-icon>
    </van-nav-bar>

    <div class="scroll-wrap">
      <!-- 当前评论项 -->
      <comment-item :comment="comment"></comment-item>

      <!-- 回复评论项 -->
      <van-cell title="全部回复" />
      <comment-list type="c"
                    :source="comment.com_id"
                    :list="commentList"></comment-list>
    </div>

    <div class="post-wrap">
      <van-button class="post-btn"
                  size="small"
                  @click="isReplyShow = true"
                  round>写评论</van-button>
    </div>

    <!-- 发布评论 -->
    <van-popup v-model="isReplyShow"
               position="bottom">
      <comment-post :target="comment.com_id"
                    @post-success="onPostSuccess"></comment-post>
    </van-popup>
  </div>
</template>

<script>
import commentItem from './comment.item'
import commentList from './comment.list'
import commentPost from './comment.post'
export default {
  data () {
    return {
      isReplyShow: false,
      commentList: [] // 评论的回复列表
    }
  },
  components: {
    commentItem,
    commentList,
    commentPost
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    onPostSuccess (data) {
      // 更新回复的数量
      this.comment.reply_count++

      // 关闭弹层
      this.isReplyShow = false

      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88px;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 65%;
  }
}
</style>
