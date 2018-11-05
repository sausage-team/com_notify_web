<template>
  <div class="header">
    <div class="header-left">
      <div class="header-left-img"></div>
      <div class="header-left-title">
        <div class="title-item1">{{title}}</div>
        <div class="title-item2">{{subTitle}}</div>
      </div>
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
          <source src="../../assets/medias/notify.mp3" type="audio/mpeg">
          您的浏览器不支持 audio 元素。
        </audio>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/http/services/index.js'
export default {
  name: 'HeaderNav',
  data () {
    return {
      title: '海致数据推送中心',
      subTitle: 'Intellgence PushCenter',
      username: this.$cookies.get('username'),
      volstatus: localStorage.getItem('userSoundStatus')
    }
  },
  methods: {
    signOut () {
      service.userService.signOut()
        .then(res => {
          this.$cookies.remove('token')
          this.$cookies.remove('userId')
          this.$cookies.remove('userSoundStatus')
          this.$cookies.remove('username')
          this.$cookies.remove('mqtt_ws')
          this.$router.push('/login')
          this.$store.dispatch('closeSub')
        })
    },
    setVolswitch (index) {
      service.userService.updateSoundStatus({userSoundStatus: index}).then(res => {
        if (res.status === 0) {
          this.volstatus = index
          localStorage.setItem('userSoundStatus', index)
        }
      })
    }
  }
}
</script>
