<template>
  <van-cell class="comment-item">
    <van-image slot="icon"
               class="avatar"
               round
               fit="cover"
               :src="comment.aut_photo" />
    <div slot="title"
         class="title-wrap">
      <div class="user-name">{{comment.aut_name}}</div>
      <van-button class="like-btn"
                  :class="{likes:comment.is_liking}"
                  :loading="commentLoading"
                  @click="onCommentLike"
                  :icon="comment.is_liking ? 'good-job' : 'good-job-o'">{{comment.like_count || '赞'}}</van-button>
    </div>

    <div slot="label">
      <p class="comment-content">{{comment.content}}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{comment.pubdate | relativeTime}}</span>
        <van-button class="reply-btn"
                    @click="$emit('reply-click',comment)"
                    round>回复 {{comment.reply_count}}</van-button>
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentsLike, deleteCommentsLike } from '../../../api/comment'
export default {
  data () {
    return {
      commentLoading: false
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onCommentLike () {
      this.commentLoading = true
      try {
        if (this.comment.is_liking) {
          // 已点赞 点击取消点赞
          await deleteCommentsLike(this.comment.com_id.toString())
          this.comment.like_count--
          this.$toast.success('取消成功')
        } else {
          // 未点赞 点击点赞
          // console.log(111)
          await addCommentsLike(this.comment.com_id.toString())
          this.comment.like_count++
          this.$toast.success('点赞成功')
        }

        this.$emit('updata-commentLike', !this.comment.is_liking)
      } catch (err) {
        this.$toast.fail('操作失败，请重试')
      }
      this.commentLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-item {
  .avatar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      font-size: 26px;
      color: #406599;
    }
    .like-btn {
      height: 30px;
      padding: 0;
      border: none;
      font-size: 19px;
      line-height: 30px;
      margin-right: 7px;
      .van-icon {
        font-size: 30px;
      }
    }
    .likes {
      color: #e5645f;
    }
  }
  .comment-content {
    font-size: 32px;
    color: #222222;
    padding-top: 25px;
  }
  .comment-pubdate {
    color: #222;
    font-size: 19px;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }
  .reply-btn {
    // width: 135px;
    height: 48px;
    line-height: 48px;
    font-size: 21px;
    color: #222;
    background-color: #f4f5f6;
  }
}
</style>
