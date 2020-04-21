<template>
  <div style="cursor: pointer">
    <!--<el-tag :type="type" @click.native="handleClick">{{ text }}</el-tag>-->
    <el-button :type="type" :icon="thisIcon" plain disabled size="mini">{{ text }}</el-button>
  </div>
</template>

<script>
  export default {
    name: "purchasing-intention",
    props: {
      value: {
        type: String,
        require: true
      },
      scope: {
        default: null
      },
      myProps: {
        default: null
      }
    },
    computed: {
      type () {
        // return this.value ? 'success' : 'danger'
        switch (this.value) {
          case '无意向':
          case '意向弱':
            return 'info'
          case '意向一般':
            return 'success'
          case '意向强':
            return 'warning'
          case '意向很强':
            return 'danger'
          default:
            return 'info'
        }
      },
      text () {
        // if (this.scope.$index === 1) {
        //   return this.myProps
        // } else if (this.scope.$index === 3) {
        //   return '通过scope拿到了当前行日期：' + this.scope.row.date
        // }
        // return this.value ? '是' : '否'
        return this.value
      },
      thisIcon () {
        switch (this.value) {
          case '无意向':
          case '意向弱':
            return 'icon-rate-face-1'
          case '意向一般':
            return 'icon-rate-face-2'
          case '意向强':
          case '意向很强':
            return 'icon-rate-face-3'
          default:
            return 'icon-rate-face-1'
        }
      }
    },
    mounted () {
      // console.log(this.scope)
      // console.log(this.myProps)
    },
    methods: {
      handleClick () {
        // this.$emit('input', !this.value)
        alert(this.myProps)
      }
    }
  }
</script>

<style scoped>
  @import '../../../../../assets/styles/common.css';
  @import '../../../../../assets/styles/fonts/style.css';
</style>
