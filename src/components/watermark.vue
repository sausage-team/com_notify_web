<template>
  <div class="wm-body hide">
  </div>
</template>
<script>
export default {
  props: {
    domKey: String,
    tscl: String
  },
  data () {
    return {
      data: this.$cookies.get('notify_data') || {}
    }
  },
  created () {
    setTimeout(() => {
      this.initWatermark()
    })
  },
  methods: {
    initWatermark () {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = 360
      canvas.height = 180
      context.fillStyle = 'rgba(100, 100, 100, 0.2)'
      context.font = '12px Arial'
      context.rotate(-30 * Math.PI / 180)
      if (this.tscl) {
        context.translate(90, 90)
      } else {
        context.translate(90, 120)
      }
      context.textAlign = 'center'
      context.fillText(`${this.data.name} (${this.data.identity})`, 0, 20)
      context.fillText(`${this.util.momentDate(this.data.last_login_time, 'date_time')}`, 0, 40)
      context.fillText(`本操作将被记录`, 0, 60)
      context.fillText(`泄露相关信息将被依法追究法律责任`, 0, 80)

      const _setBackgroundImage = (image) => {
        let qstr = ''
        let repeat = ''
        if (this.tscl === 'detail') {
          qstr = `#${this.domKey}`
          repeat = 'repeat'
        } else if (this.tscl === 'table') {
          qstr = `#${this.domKey} + .el-table`
          repeat = 'repeat'
        } else {
          qstr = `.${this.domKey}`
          repeat = 'no-repeat'
        }
        const element = this.$query(qstr)
        if (element.css('background-image') !== 'none') {
            element.css('background-repeat', `${repeat}`)
            element.css('background-size', `360px 180px`)
            element.css('background-image', `url(${image})`)
        } else {
            element.css('background-image', `url(${image})`)
        }
      }

      _setBackgroundImage(canvas.toDataURL('image/png'))
    }
  }
}
</script>
