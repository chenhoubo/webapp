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
    <div style="margin-top:15px;padding-bottom: 15px;position: relative;">
      <div class="left">
        <el-card>
          <div slot="header" class="clearfix">
            <span style="font-size: 16px; font-weight: bold;">用户信息</span>
          </div>
          <el-descriptions :column="2">
            <el-descriptions-item label="用户名">{{
              info.name
            }}</el-descriptions-item>
            <el-descriptions-item label="账号">{{
              info.username
            }}</el-descriptions-item>
            <el-descriptions-item label="性别">
              <el-tag size="small">{{ info.gender }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="年龄">{{
              info.age
            }}</el-descriptions-item>
            <el-descriptions-item label="电话">{{
              info.tel
            }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{
              info.address
            }}</el-descriptions-item>
            <el-descriptions-item label="角色">{{
              info.rolename
            }}</el-descriptions-item>
            <el-descriptions-item label="风格">{{
              info.style
            }}</el-descriptions-item>
            <el-descriptions-item label="描述">{{
              info.introduce
            }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{
              info.createTime
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
        <el-card style="margin-top:15px;">
          <div slot="header" class="clearfix">
            <span style="font-size: 16px; font-weight: bold;">系统信息</span>
          </div>
          <el-descriptions :column="2">
            <el-descriptions-item label="版本">{{
              sysInfo.version
            }}</el-descriptions-item>
            <el-descriptions-item label="描述">{{
              sysInfo.desc
            }}</el-descriptions-item>
            <el-descriptions-item label="作者">{{
              sysInfo.realName
            }}</el-descriptions-item>
            <el-descriptions-item label="描述">{{
              sysInfo.desc
            }}</el-descriptions-item>
            <el-descriptions-item label="版本时间">{{
              sysInfo.createTime
            }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              sysInfo.tel
            }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{
              sysInfo.email
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
      <div class="right">
        <el-card>
          <div slot="header" class="clearfix">
            <span style="font-size: 16px; font-weight: bold;">用户评论</span>
          </div>
          <div>
            <div class="commentbox">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                v-model="formData.content"
                style="width:90%;"
              >
              </el-input>
              <el-button
                type="primary"
                round
                @click="send()"
                style="position: absolute;bottom: 10px;left: 91%;"
                >评论</el-button
              >
            </div>
            <div class="comment-list">
              <div
                class="comment-info"
                v-for="(item, index) in arr"
                :key="index"
              >
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
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInfo } from '@/api/login'
import { save, all } from '@/api/speak'
import { available } from '@/api/info'
import { format } from '@/utils/component'
export default {
  computed: {
    ...mapGetters(['name', 'introduce'])
  },
  activated() {
    this.getUserInfo()
    this.getSpeaks()
    this.getSystemInfo()
  },
  data() {
    return {
      formData: {},
      sysInfo: {},
      info: {},
      arr: []
    }
  },
  methods: {
    getUserInfo() {
      getInfo()
        .then(res => {
          this.info = res.data
          this.info.createTime = format(res.data.createTime)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    send() {
      console.log('this.formData.content:', this.formData.content)
      if (this.formData.content == '' || this.formData.content == undefined) {
        this.$message.error('请输入内容')
      } else {
        this.formData = Object.assign(
          {
            img: ' ../../assets/personal/user01.jpg',
            replyName: this.name,
            name: this.name
          },
          this.formData
        )
        save(this.formData)
          .then(() => {
            this.formData = {}
            this.getSpeaks()
          })
          .catch(err => {
            this.$message.error(err.message)
          })
      }
    },
    getSpeaks() {
      all()
        .then(res => {
          this.arr = res.data.map(item => {
            return {
              ...item,
              time: format(item.createTime)
            }
          })
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    getSystemInfo() {
      available()
        .then(res => {
          this.sysInfo = res.data.map(item => {
            return {
              ...item,
              createTime: format(item.createTime)
            }
          })[0]
        })
        .catch(err => {
          this.$message.error(err.message)
        })
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

.commentbox {
  margin: 20px auto;
  position: relative;
}
.comment-list {
  overflow: auto;
}
.comment-list .comment-info {
  position: relative;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.comment-list .comment-info header {
  width: 10%;
  position: absolute;
}
.comment-list .comment-info header img {
  width: 80%;
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
.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
.left {
  width: 40%;
  margin-left: 1%;
  display: inline-block;
  position: absolute;
}
.right {
  width: 56%;
  display: inline-block;
  position: relative;
  left: 42%;
}
</style>
