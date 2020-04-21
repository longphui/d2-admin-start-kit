<template>
  <d2-container>
    <demo-page-header
      slot="header"
      @submit="handleSubmit"
      ref="header"/>
    <demo-page-main
      :table-data="table"
      :loading="loading"/>
    <demo-page-footer
      slot="footer"
      :current="page.pageIndex"
      :size="page.pageSize"
      :total="page.pageTotal"
      @change="handlePaginationChange"/>
  </d2-container>
</template>

<script>
  import {getCustomers} from '@/api/crm'
  import util from '@/libs/util.js'
  export default {
    // name 值和本页的 $route.name 一致才可以缓存页面
    name: 'private-customer',
    components: {
      'DemoPageHeader': () => import('../Componnets/PageHeader'),
      'DemoPageMain': () => import('../Componnets/PageMain'),
      'DemoPageFooter': () => import('../Componnets/PageFooter')
    },
    data () {
      return {
        table: [],
        loading: false,
        page: {
          pageIndex: 1,
          pageSize: 10,
          pageTotal: 0
        }
      }
    },
    created () {
      this.handleSubmit ()
    },
    methods: {
      handlePaginationChange (val) {
        this.$notify({
          title: '分页变化',
          message: `当前第${val.current}页 共${val.total}条 每页${val.size}条`
        })
        this.page = {
          pageIndex: val.current,
          pageSize: val.size,
          pageTotal: val.total
        }
        // nextTick 只是为了优化示例中 notify 的显示
        this.$nextTick(() => {
          this.$refs.header.handleFormSubmit()
        })
      },
      handleSubmit (form) {
        this.loading = true
        // this.$notify({
        //   title: '开始请求数据'
        // })
        getCustomers({
          poolId: util.cookies.get('uuid'),
          roleName: util.cookies.get('roleName'),
          poolType: 0,
          ...form,
          ...this.page
        })
          .then(res => {
            this.loading = false
            // this.$notify({
            //   title: '数据请求完毕'
            // })
            this.table = res.items
            this.page.pageTotal = res.totalNum
          })
          .catch(err => {
            this.loading = false
            this.$message.error('数据请求异常')
            console.log('err', err)
          })
      },
    }
  }
</script>
<style>
  .visit .el-timeline-item__node{
    left: -5px!important;
    width: 20px!important;
    height: 20px!important;
  }
</style>
