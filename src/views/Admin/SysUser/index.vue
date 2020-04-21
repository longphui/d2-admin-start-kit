<template>
  <d2-container>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :data="data"
      :rowHandle="rowHandle"
      :add-template="addTemplate"
      add-title = "添加用户"
      :form-options="formOptions"
      :add-rules="addRules"
      :loading="loading"
      @row-add="handleRowAdd"
      @dialog-cancel="handleDialogCancel"
      @row-remove="handleRowRemove">
      <el-button slot="header" style="margin-bottom: 5px" @click="addRow">新增</el-button>
    </d2-crud>
  </d2-container>
</template>

<script>

  import util from '@/libs/util.js'
  import {
    getAllSysUser, addUser, deleteUser
  } from '@/api/sys.login'
  export default {
    data () {
      return {
        loading: false,
        columns: [
          {
            title: '用户名',
            key: 'loginName'
          },
          {
            title: '手机号码',
            key: 'phone'
          },
          {
            title: '创建时间',
            key: 'createdTimeText'
          }
        ],
        data: [],
        addButton: {
          text: '点我查看表单校验',
          icon: 'el-icon-plus',
          size: 'small'
        },
        addTemplate: {
          loginName: {
            title: '用户名',
            value: ''
          },
          password: {
            title: '登录密码',
            value: ''
          },
          phone: {
            title: '手机号',
            value: ''
          }
        },
        formOptions: {
          labelWidth: '80px',
          labelPosition: 'left',
          saveLoading: false
        },
        addRules: {
          loginName: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
          password: [ { required: true, message: '请输入登录密码', trigger: 'blur' } ],
          phone: [ { required: true, message: '请输入手机号码', trigger: 'blur' } ]
        },
        rowHandle: {
          remove: {
            size: 'mini',
            confirm: true
          }
        }
      }
    },
    created () {
      this.getData()
    },
    methods: {
      // 请求表格数据
      getData () {
        this.loading = true
        getAllSysUser(util.cookies.get('roleName'))
          .then(res => {
            console.log(res)
            this.data = res
            this.loading = false
          })
          .catch(
            err => {
              console.log(err)
              this.loading = false
            }
          )
      },
      addRow () {
        this.$refs.d2Crud.showDialog({
          mode: 'add'
        })
      },
      handleRowAdd (row, done) {
        this.formOptions.saveLoading = true
        row.createdUser = util.cookies.get('uuid')
        addUser(row)
          .then(res => {
            this.formOptions.saveLoading = false
            if (res) {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              done(res)
            } else {
              this.$message({
                message: '保存失败',
                type: 'warning'
              })
            }
          })
          .catch(
            err => {
              console.log(err)
              this.formOptions.saveLoading = false
            }
          )
      },
      handleDialogCancel (done) {
        this.$message({
          message: '取消保存',
          type: 'warning'
        })
        done()
      },
      handleRowRemove ({ index, row }, done) {
        var param = {
          Id: row.id,
          user: util.cookies.get('uuid')
        }
        deleteUser(param)
          .then(res => {
            if (res) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              done()
            } else {
              this.$message({
                message: '删除失败',
                type: 'warning'
              })
            }
          })
          .catch(
            err => {
              this.$message({
                message: '删除失败',
                type: 'warning'
              })
              console.log(err)
            }
          )
      }
    }
  }
</script>
