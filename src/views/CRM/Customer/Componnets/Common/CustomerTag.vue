<template>
  <div>
    <div style="cursor: pointer">
      <!--<el-tag :type="type" @click.native="handleClick">{{ text }}</el-tag>-->
      <el-button :type="type" round v-on:click.stop="handleClick" size="mini">{{ text }}</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisitAddVisible" :title="visitTitle"  custom-class="visit-add">
      <visit-add :scope="scope"></visit-add>
    </el-dialog>
  </div>
</template>

<script>
  import VisitAdd from '../../../Visit/Add'
    export default {
      name: "customer-tag",
      components: {
        VisitAdd
      },
      props: {
        value: {
          type: String,
          require: true
        },
        scope: {
          default: null
        }
      },
      data () {
        return {
          dialogVisitAddVisible: false,
          visitTitle: '跟进客户：'+ this.scope.name + '(' + this.scope.phone + ')',
          customer: this.scope
        }
      },
      computed: {
        type () {
          // return this.value ? 'success' : 'danger'
          switch (this.value) {
            case '无计划':
              return 'info'
            case '待回访':
              return 'success'
            case '待接机':
            case '待带看':
              return 'warning'
            case '接机逾期':
            case '带看逾期':
            case '回访逾期':
              return 'danger'
            default:
              return ''
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
        }
      },
      mounted () {
        // console.log(this.scope)
        // console.log(this.myProps)
      },
      methods: {
        handleClick () {
          // this.$emit('input', !this.value)
          // alert(this.scope.name)
          this.dialogVisitAddVisible = true
        }
      }
    }
</script>

<style>
  /*.visit-add .el-dialog__header{*/
    /*padding:0px 0px!important;*/
  /*}*/
  .visit-add .el-dialog__body{
    padding:5px 10px 20px 10px!important;
  }

  /*.visit-add  .el-tabs__new-tab {*/
     /*border: 0px solid #d3dce6;*/
    /*margin: 10px 0 9px 10px;*/
  /*}*/

  /*.visit-add .el-tabs__item .el-icon-close {*/
    /*position: relative;*/
    /*left: 362px;*/
    /*z-index: 100000;*/
  /*}*/
  /*.visit-add  #tab-2 {*/

    /*width: 0px;*/
    /*padding-right: 0px;*/
    /*padding-left: 0px;*/
    /*height: 2px;*/
  /*}*/
  .visit-add .el-form-item  {
    text-align: left;
  }
  .visit-add .el-dialog__header {
    text-align: left;
  }
</style>
