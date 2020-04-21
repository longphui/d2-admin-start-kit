<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import util from '@/libs/util'

export default {
  name: 'app',
  watch: {
    '$i18n.locale': 'i18nHandle'
  },
  created () {
    this.i18nHandle(this.$i18n.locale)
    if (!!(util.cookies.get('asideMenu'))) {
      this.$store.commit('d2admin/menu/asideSet', JSON.parse(util.cookies.get('asideMenu')), { root: true })
    }
  },
  methods: {
    i18nHandle (val, oldVal) {
      util.cookies.set('lang', val)
      document.querySelector('html').setAttribute('lang', val)
    }
  }
}
</script>

<style lang="scss">
@import '~@/assets/style/public-class.scss';
</style>
