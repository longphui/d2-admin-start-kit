<template>
  <el-row :gutter="20" class="customer-header">
    <el-col :span="2.5">
      <el-button
        type="primary"
        icon="el-icon-plus" @click="$router.push({ path: '/customer-add' })">
        新 增
      </el-button>
    </el-col>
    <el-col :span="18">
      <el-input placeholder="请输入查询内容" v-model="form.searchText" class="input-with-select">
        <el-select v-model="form.searchType" slot="prepend" placeholder="请选择">
          <el-option label="" value=""></el-option>
          <el-option label="姓名" value="姓名"></el-option>
          <el-option label="电话" value="电话"></el-option>
          <el-option label="地址" value="地址"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="handleFormSubmit"></el-button>
      </el-input>
    </el-col>
  </el-row>

</template>

<script>
export default {
  data () {
    return {
      form: {
        searchType: '',
        searchText: '',
      },
      rules: {
        type: [ { required: true, message: '请选择一个状态', trigger: 'change' } ],
        user: [ { required: true, message: '请输入用户', trigger: 'change' } ]
      }
    }
  },
  methods: {
    handleFormSubmit () {
      // this.$refs.form.validate((valid) => {
      //   if (valid) {
      //     this.$emit('submit', this.form)
      //   } else {
      //     this.$notify.error({
      //       title: '错误',
      //       message: '表单校验失败'
      //     })
      //     return false
      //   }
      // })
      this.$emit('submit', this.form)
    },
    // handleFormReset () {
    //   this.$refs.form.resetFields()
    // }
  }
}
</script>
<style >
  .customer-header .el-select .el-input {
    width: 90px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .d2-layout-header-aside-group .d2-layout-header-aside-content .d2-theme-container .d2-theme-container-main .d2-theme-container-main-body .container-component .d2-container-full .d2-container-full__header {
    padding: 10px!important;
  }
  .d2-layout-header-aside-group .d2-layout-header-aside-content .d2-theme-container .d2-theme-container-main .d2-theme-container-main-body .container-component .d2-container-full .d2-container-full__body {
    padding: 5px 20px;
  }
</style>
