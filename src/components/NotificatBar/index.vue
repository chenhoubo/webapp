<template>
  <div class="notificatBar">
    <div class="cardBox">
      <div class="cardHead">
        <p>消息中心</p>
        <i
          class="el-icon-close"
          @click="$store.commit('app/SET_MSGISOPEN')"
        ></i>
      </div>
      <ul class="conUl">
        <li v-for="item in msgList" :key="item.id">
          <router-link :to="item.link" class="conUl_link">
            <span class="conUl_sp0">{{ item.content }}</span>
            <span class="conUl_sp1">{{ item.time }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getMsgList } from '@/api/user'
export default {
  data() {
    return {
      msgList: [
        // {
        //   id: '1',
        //   content: '优惠券到期提醒',
        //   link: '/product/index',
        //   time: '2019-06-01'
        // }
      ]
    }
  },
  created() {
    getMsgList()
      .then(res => {
        this.msgList = res.data.map(item => {
          return {
            link: '/product/index',
            content: '新增商品: ' + item.title + ',需要你审核',
            ...item
          }
        })
        if (res.data.length > 0) {
          this.$store.commit('app/SET_ISMSG', true)
        } else {
          this.$store.commit('app/SET_ISMSG', false)
        }
      })
      .catch(err => {
        this.$message.error(err.message)
      })
  }
}
</script>
<style lang="scss">
.cardBox {
  width: 100%;
  .cardHead {
    height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid #e4e4e4;
    line-height: 50px;
    p {
      font-size: 16px;
      color: #333;
      float: left;
    }
    i {
      float: right;
      font-size: 20px;
      margin-top: 14px;
      color: #b3b3b3;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        color: #333;
      }
    }
  }
}
.conUl {
  li {
    height: 50px;
    line-height: 50px;
    .conUl_link {
      display: block;
      margin: 0 20px;
      height: 100%;
      border-bottom: 1px solid #e4e4e4;
    }
    .conUl_sp0 {
      font-size: 14px;
    }
    .conUl_sp1 {
      font-size: 12px;
      color: #b3b3b3;
      float: right;
    }
  }
}
</style>
