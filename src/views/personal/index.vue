<template>
  <div class="personal noPadding">
    <div class="personal_h">
      <div class="perh_d1">
        <div class="perh_info">
          <p class="perh_p0">{{ name }}</p>
          <div class="chatBox">
            <a href="javascript:;"><i class="iconfont el-icon-weixin"></i></a>
            <a href="javascript:;"><i class="iconfont el-icon-twitter"></i></a>
            <a href="javascript:;"><i class="iconfont el-icon-weibo"></i></a>
          </div>
          <p>{{ introduce }}</p>
        </div>
        <img src="../../assets/personal/user01.jpg" />
        <div class="rightIcon">
          <span style="margin-right: 20px"
            ><i class="el-icon-star-on"></i>Collection</span
          >
          <span><i class="el-icon-chat-dot-round"></i>Message</span>
        </div>
      </div>
    </div>
    <el-tabs>
      <el-tab-pane label="评论">
        <div class="container">
          <div class="commentbox">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="formData.content"
            >
            </el-input>
            <el-button
              type="primary"
              round
              @click="send()"
              style="position: absolute;bottom: 10px;"
              >评论</el-button
            >
          </div>
          <div class="comment-list">
            <div class="comment-info" v-for="(item, index) in arr" :key="index">
              <header><img src="../../assets/personal/user01.jpg" /></header>
              <div class="comment-right">
                <h3>{{ item.replyName }}</h3>
                <div class="comment-content-header">
                  <span
                    ><i class="glyphicon glyphicon-time"></i
                    >{{ item.time }}</span
                  >
                </div>
                <p class="content">{{ item.content }}</p>
                <div class="comment-content-footer">
                  <div class="row">
                    <div class="col-md-2">
                      <span class="reply-btn">回复</span>
                    </div>
                  </div>
                </div>
                <div class="reply-list"></div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="信息">
        <!-- <el-button type="success" slot="label">Message</el-button> -->
        Message
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['name', 'introduce'])
  },
  data() {
    return {
      formData: {},
      arr: [
        {
          id: 1,
          img: '../../assets/personal/user01.jpg',
          replyName: '帅大叔',
          beReplyName: '匿名',
          content: '整体来说，一般般，知识一些小细节的地方写的不错。',
          time: '2017-10-17 11:42:53',
          replyBody: [
            {
              id: 3,
              img: '',
              replyName: '帅大叔',
              beReplyName: '匿名',
              content: '谢谢夸奖，我回再接再厉的',
              time: '2017-10-17 11:42:53'
            }
          ]
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.personal_h {
  width: 100%;
  height: 230px;
  background: url(../../assets/personal/personBg.jpg) no-repeat center center;
  background-size: cover;
  .perh_d1 {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    position: relative;
    color: #58666e;
    & > img {
      position: absolute;
      width: 96px;
      height: 96px;
      border-radius: 50%;
      top: 60px;
      left: 50px;
    }
    .perh_info {
      padding: 59px 0 0 172px;
      .perh_p0 {
        font-size: 20px;
        margin-bottom: 6px;
      }
    }
    .chatBox {
      .iconfont {
        vertical-align: middle;
      }
      a {
        width: 30px;
        height: 30px;
        display: inline-block;
        background-color: #edf1f2;
        color: #58666e !important;
        border: 1px solid #e4e4e4;
        box-shadow: 0 1px 1px rgba(90, 90, 90, 0.1);
        text-align: center;
        line-height: 30px;
        border-radius: 50%;
        margin-right: 10px;
        margin-bottom: 12px;
        &:hover {
          background-color: #e4e4e4;
        }
      }
    }
    .rightIcon {
      position: absolute;
      top: 94px;
      right: 50px;
      color: #333;
      span {
        font-size: 20px;
        i {
          font-size: 18px;
          margin-right: 5px;
          color: #333;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.personal {
  .el-tabs__header {
    padding: 15px 0;
    background: #fff;
    border-bottom: 1px solid #ddd;
    margin-bottom: 30px;
  }
  .el-tabs__nav-wrap {
    padding-left: 20px;
  }
  .el-tabs__nav-wrap::after {
    display: none;
  }
  .el-tabs__content {
    padding: 0 20px;
  }
}

.container {
  width: 1000px;
}
.commentbox {
  width: 900px;
  margin: 20px auto;
  position: relative;
}
.comment-list {
  width: 900px;
  margin: 20px auto;
  clear: both;
  padding-top: 20px;
}
.comment-list .comment-info {
  position: relative;
  margin-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.comment-list .comment-info header {
  width: 10%;
  position: absolute;
}
.comment-list .comment-info header img {
  width: 100%;
  border-radius: 50%;
  padding: 5px;
}
.comment-list .comment-info .comment-right {
  padding: 5px 0px 5px 11%;
}
.comment-list .comment-info .comment-right h3 {
  margin: 5px 0px;
}
.comment-list .comment-info .comment-right .comment-content-header {
  height: 25px;
}
.comment-list .comment-info .comment-right .comment-content-header span,
.comment-list .comment-info .comment-right .comment-content-footer span {
  padding-right: 2em;
  color: #aaa;
}
.comment-list .comment-info .comment-right .comment-content-header span,
.comment-list
  .comment-info
  .comment-right
  .comment-content-footer
  span.reply-btn,
.send,
.reply-list-btn {
  cursor: pointer;
}
.comment-list .comment-info .comment-right .reply-list {
  border-left: 3px solid #ccc;
  padding-left: 7px;
}
.comment-list .comment-info .comment-right .reply-list .reply {
  border-bottom: 1px dashed #ccc;
}
.comment-list .comment-info .comment-right .reply-list .reply div span {
  padding-left: 10px;
}
.comment-list .comment-info .comment-right .reply-list .reply p span {
  padding-right: 2em;
  color: #aaa;
}
</style>
