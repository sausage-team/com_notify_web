<template>
  <div class="header">
    <div class="header-left">
      <div class="header-left-img"></div>
      <div class="header-left-title">
        <div class="title-item1">{{title}}</div>
        <div class="title-item2">{{subTitle}}</div>
      </div>
    </div>
    <div class="header-menu-btn">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          消息中心<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in menuList" @click.native="chooseModal($event, item)" :key="index">{{item.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="header-con">
      <Menu mode="horizontal" theme="primary" :active-name="chooseType">
        <MenuItem name="messages" @click.native="chooseMenu($event, 'messages')">
            <span>消息盒子</span>
            <i></i>
        </MenuItem>
        <MenuItem name="follows" @click.native="chooseMenu($event, 'follows')">
            <span>关注列表</span>
            <i></i>
        </MenuItem>
        <MenuItem name="pushes" @click.native="chooseMenu($event, 'pushes')">
            <span>推送记录</span>
            <i></i>
        </MenuItem>
      </Menu>
    </div>
    <div class="header-right">
      <div class="header-right-setting">
        <div class="user">
          <i class="user-icon"></i>
        </div>
        <div class="title">{{username}}</div>
        <div class="bor-seq"></div>
        <div class="audio-on" v-show="volstatus == 1" @click="setVolswitch(0)"></div>
        <div class="audio-off" v-show="volstatus != 1" @click="setVolswitch(1)"></div>
        <div class="setting-icon" @click="signOut"></div>
        <audio id='tipAudio'>
          <source src="../assets/medias/notify.mp3" type="audio/mpeg">
          您的浏览器不支持 audio 元素。
        </audio>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      title: '海致数据推送中心',
      subTitle: 'Intellgence PushCenter',
      username: this.$cookies.get('notify_data') ? this.$cookies.get('notify_data').name : '未知',
      volstatus: localStorage.getItem('userSoundStatus'),
      chooseType: this.$route.name,
      menuList: []
    }
  },
  created () {
    if (this.$cookies.get('no_token')) {
      this.userService.getMenuList().then(res => {
        if (res.status === 0) {
          this.menuList = res.data
        }
      })
    }
  },
  methods: {
    signOut () {
      this.userService.signOut()
        .then(res => {
          this.$cookies.remove('no_token')
          this.$cookies.remove('notify_data')
          this.$router.push('/login')
          this.$store.dispatch('closeSub')
        })
    },
    chooseModal (e, item) {
      e.stopPropagation()
      this.userService.getMenuUrl({
        product_name: item.pro_name
      }).then(res => {
        if (res.status === 0) {
          if (res.data) {
            window.location.href = res.data
          }
        }
      })
    },
    setVolswitch (index) {
      this.userService.updateSoundStatus({userSoundStatus: index}).then(res => {
        if (res.status === 0) {
          this.volstatus = index
          localStorage.setItem('userSoundStatus', index)
        }
      })
    },
    chooseMenu (e, type) {
      if (this.chooseType !== type) {
        this.$router.push(type)
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.chooseType = this.$route.name
    }
  }
}
</script>
