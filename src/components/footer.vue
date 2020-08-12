<template>
  <div class="footer">
    <slot name="footer-child"><span class="footer_children">{{footerContent}}</span></slot>
  </div>
</template>
<script>
export default {
  name: 'footer-bar',
  props: {
    footerContent: {
      type: String,
      default () {
        return 'footer'
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.footer{
  position fixed
  bottom 0
  left 0
  right 0
  width 100%
  z-index 1000
  .footer_children{
    position absolute
    bottom 0
    left 0
    width 100%
    height 88px
    line-height 88px
    background #ff5722
    color #ffffff
    font-size 32px
  }
}
</style>
