<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar"
                 fixed>
      <div slot="left">
        <van-icon name="arrow-left"
                  @click="$router.back()" />
      </div>
    </van-nav-bar>

    <!-- 加载中 -->
    <van-loading size="24px"
                 vertical
                 color="#3296fa"
                 v-if="isloading">加载中...</van-loading>

    <!-- 加载完成-文章详情 -->
    <div class="article-detail markdown-body"
         v-else-if="article.title">
      <!-- 文章标题 -->
      <h1 class="article-title">{{article.title}}</h1>
      <!-- /文章标题 -->

      <!-- 用户信息 -->
      <van-cell class="user-info"
                center
                :border="false">
        <van-image class="avatar"
                   slot="icon"
                   round
                   fit="cover"
                   :src="article.aut_photo" />
        <div slot="title"
             class="user-name">{{article.aut_name}}</div>
        <div slot="label"
             class="publish-date">{{article.pubdate | relativeTime}}</div>

        <follow-user class="follow-btn"
                     :is_followed="article.is_followed"
                     :user_id="article.aut_id"
                     @updata-is_followed="article.is_followed = $event"></follow-user>
        <!-- <van-button v-if="article.is_followed"
                    class="follow-btn"
                    round
                    :loading='followloading'
                    size="small"
                    @click="onFollow">已关注</van-button>

        <van-button v-else
                    class="follow-btn"
                    type="info"
                    color="#3296fa"
                    round
                    size="small"
                    :loading='followloading'
                    @click="onFollow"
                    icon="plus">关注</van-button> -->
      </van-cell>
      <!-- /用户信息 -->

      <!-- 文章内容 -->
      <div class="article-content"
           v-html="article.content"
           ref="article-content"></div>
      <van-divider>正文结束</van-divider>

      <!-- 评论列表 -->
      <comment-list :source="article.art_id"
                    @onload-success="totalCommentCount = $event.total_count"
                    @reply-click="onReplyClick"
                    :list="commentList"></comment-list>

      <!-- 底部区域 -->
      <div class="article-bottom">
        <van-button class="comment-btn"
                    type="default"
                    @click="isPostShow = true"
                    round
                    size="small">写评论</van-button>
        <van-icon name="comment-o"
                  :badge="totalCommentCount"
                  color="#777" />
        <!-- 使用 v-model向子组件传参，  子
      组件接收用props接收, 接收数据名默认为value  默认事件为input -->
        <collect-article v-model="article.is_collected"
                         :articleId="article.art_id"
                         @input="article.is_collected = $event"></collect-article>
        <!-- <van-icon color="#777"
                name="star-o" /> -->

        <like-article v-model="article.attitude"
                      :articleId="article.art_id"
                      @input="article.attitude = $event"></like-article>

        <!-- <van-icon color="#777"
                  name="good-job-o" /> -->
        <van-icon name="share"
                  color="#777777"></van-icon>
      </div>
      <!-- /底部区域 -->

      <!-- 发布评论 -->
      <van-popup v-model="isPostShow"
                 position="bottom">
        <comment-post :target="article.art_id"
                      @post-success="onPostSuccess"></comment-post>
      </van-popup>
    </div>
    <!-- /加载完成-文章详情 -->

    <!-- 加载失败：404 -->
    <div class="error-wrap"
         v-else-if="errStatus===404">
      <van-icon name="failure" />
      <p class="text">该资源不存在或已删除！</p>
    </div>
    <!-- /加载失败：404 -->

    <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
    <div class="error-wrap"
         v-else>
      <van-icon name="failure" />
      <p class="text">内容加载失败！</p>
      <van-button class="retry-btn"
                  @click="loadArticle">点击重试</van-button>
    </div>
    <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->

    <!-- 回复弹出层 -->
    <van-popup v-model="isReplyShow"
               position="bottom"
               :style="{ height: '100%' }">
      <comment-reply v-if="isReplyShow"
                     :comment="currentComment"
                     @close="isReplyShow = false"></comment-reply>
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '../../api/article'
import { ImagePreview } from 'vant'
import followUser from '../../components/follow-user/index'
import collectArticle from '../../components/collect-article/index'
import likeArticle from '../../components/like-article/index'
import commentList from './components/comment.list'
import commentPost from './components/comment.post'
import commentReply from './components/comment-reply'
export default {
  data () {
    return {
      article: {}, // 文章详情
      isloading: true, // 加载中的 loading 状态
      errStatus: 0, // 失败的状态码
      followloading: false,
      totalCommentCount: 0, // 评论数量
      isPostShow: false, // 控制发布评论的显示状态
      commentList: [], // 评论列表
      isReplyShow: false,
      currentComment: {}// 当前点击回复的评论项
    }
  },
  // 给所有的后代组件提供数据
  // 注意：不要滥用
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {
    followUser,
    collectArticle,
    likeArticle,
    commentList,
    commentPost,
    commentReply

  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      // 展示 loading 加载中
      this.isloading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // 数据驱动视图这件事儿不是立即的
        this.article = data.data

        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.$toast('数据加载失败，请稍后重试')
      }
      // 无论加载成功或失败 都要把加载提示关闭
      this.isloading = false
    },
    previewImage () {
      // 得到所有的 img 节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')

      // 获取所有 img 地址
      const images = []
      imgs.forEach((img, i) => {
        images.push(img.src)

        // 给每个 img 注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从 0 开始
            startPosition: i
          })
        }
      })
    },
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick (comment) {
      this.currentComment = comment
      // console.log(comment)
      this.isReplyShow = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./github-markdown.css";
.article-container {
  padding-top: 92px;
  .van-icon-arrow-left {
    padding-top: 10px;
    font-size: 40px;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      ::v-deep p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  ::v-deep .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f7f9;
    height: 100%;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
