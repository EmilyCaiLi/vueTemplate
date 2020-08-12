<template>
  <div>
    <div class="nav-wrap">
      <span :class="item == 1? 'span_chose': ''" @click="changeItem(1)">每周一氪</span>
      <span :class="item == 2? 'span_chose': ''" @click="changeItem(2)">每周一案</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
      item: 1
    }
  },
  methods: {
    changeItem (item) {
      this.item = item === 1 ? 1 : 2
    }
  }
}
</script>
<style scoped lang="stylus">
.nav-wrap {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: .2rem 0 ;
  span {
    padding: .2rem 0 ;
    display: inline-block;
    border-bottom: 1px solid transparent;
  }
  .span_chose {
    color: red !important;
    border-bottom: 1px solid red;
  }
}
</style>
