<template>
  <d2-container>
    <d2-crud
      ref="d2Crud"
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :rowHandle="rowHandle"
      :add-template="addTemplate"
      add-title = "添加用户"
      :form-options="formOptions"
      :add-rules="addRules"
      :loading="loading"
      @row-add="handleRowAdd"
      @dialog-cancel="handleDialogCancel"
      @row-remove="handleRowRemove">
      <!--<el-button slot="header" style="margin-bottom: 5px" @click="addRow">新增</el-button>-->
      <div slot="header" >
        <el-row :gutter="20">
          <el-col :span="3">
            <el-input v-model="searchData.name" placeholder="请输入姓名"></el-input>
          </el-col>
          <el-col :span="3" class="seachleft">
            <el-input v-model="searchData.phone" placeholder="请输入电话"></el-input>
          </el-col>
          <el-col :span="5" class="seachleft">
            <el-cascader :options="cityOptions"  v-model="selectedCity" :props="{ checkStrictly: true }"
                         clearable placeholder="请输选择地区" @change="cityChange"></el-cascader>
          </el-col>
          <el-col :span="6" class="seachleft">
            <el-date-picker
              v-model="insertTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期" clearable  @change="timeChange">
            </el-date-picker>
          </el-col>
          <el-col :span="4" class="seachleft">
            <el-select v-model="selectedLevel" clearable  placeholder="请选择客户等级" @change="levelChange">
              <el-option
                v-for="item in levelOptions"
                :key="item.enumValue"
                :label="item.desction"
                :value="item.enumValue">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="3">
            <el-checkbox v-model="checked1" label="未成交" border @change="checked1Change" class="fixedCol"></el-checkbox>
          </el-col>
          <el-col :span="3" class="seachleft">
            <el-checkbox v-model="checked2" label="已成交" border @change="checked2Change" class="fixedCol"></el-checkbox>
          </el-col>
          <el-col :span="5"  class="seachleft">
            <el-select v-model="searchData.planVisitState" clearable  placeholder="请选择跟进状态">
              <el-option
                v-for="item in visitOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6" class="seachleft">
            <el-input v-model="searchData.key" placeholder="请输入模糊查找关键字"></el-input>
          </el-col>
          <el-col :span="4" class="seachleft">
            <el-button type="primary"  icon="el-icon-search" @click="getData">搜 索</el-button>
          </el-col>
        </el-row>
      </div>
    </d2-crud>
  </d2-container>
</template>

<script>

  import moment from 'moment'
  import util from '@/libs/util.js'
  import {getAdministrativeDivisionTree,} from '@/api/sys.login'
  import {getCustomerLevel,} from '@/api/common'
  import {getCustomers} from '@/api/crm'
  import CustomerTag from '../Componnets/Common/CustomerTag'
  import PurchasingIntention from '../Componnets/Common/PurchasingIntention'
  export default {
    name: 'public-customer',
    components: {
      CustomerTag,
      PurchasingIntention
    },
    data () {
      return {
        loading: false,
        columns: [
          {
            title: '姓名',
            key: 'name',
            width: 80,
            fixed: true
          },
          {
            title: '性别',
            key: 'genderText',
            width: 50,
            fixed: true
          },
          {
            title: '电话',
            key: 'phone',
            width: 110,
            fixed: true
          },
          {
            title: '状态',
            key: 'planVisitState',
            width: 110,
            component: {
              name: CustomerTag,
              props: {
                myProps: '我是通过props传过来的数据！'
              }
            },
            fixed: true
          },
          {
            title: '满意度',
            key: 'purchasingIntentionText',
            width: 110,
            component: {
              name: PurchasingIntention,
              props: {
                myProps: '我是通过props传过来的数据！'
              }
            },
            fixed: true
          },
          {
            title: '回访计划',
            key: 'planVisitTime',
            width: 100
          },
          {
            title: '级别',
            key: 'levelText',
            width: 80
          },
          {
            title: '需求',
            key: 'demand',
            width: 200,
            'show-overflow-tooltip': true
          },
          {
            title: '意向房源',
            key: 'intentionHouse',
            width: 200,
            'show-overflow-tooltip': true
          },
          {
            title: '成交',
            key: 'tradedTimes',
            width: 50
          },
          {
            title: '上次回访时间',
            key: 'lastVisitTime',
            width: 150
          },
          {
            title: '客户地址',
            key: 'address',
            width: 200,
            'show-overflow-tooltip': true
          },
          {
            title: '备注',
            key: 'remark',
            width: 200,
            'show-overflow-tooltip': true
          },
          {
            title: '录入时间',
            key: 'createdTimeText',
            width: 150
          }
        ],
        data: [],
        searchData: {
          poolId: window.CommonPoolId,
          name: '',
          phone: '',
          cityCode: '',
          beginTime: '',
          endTime: '',
          level: 0,
          planVisitState: '',
          tradedTimes: -1,
          key: '',
          pageIndex: 1,
          pageSize: 20
        },
        cityOptions: [],
        selectedCity: '',
        insertTime: [],
        levelOptions: [],
        selectedLevel: '',
        visitOptions: ['待接机','接机逾期','待带看','带看逾期','待回访','回访逾期','无计划'],
        checked1: false,
        checked2: false,
        pagination: {
          currentPage: 1,
          pageSize: 20,
          total: 0
        },
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
      this.getCustomerLevel()
      this.getAdministrativeDivisionTree()
    },
    methods: {
      // 请求表格数据
      getData () {
        this.loading = true
        getCustomers(this.searchData)
          .then(res => {
            console.log(res)
            this.data = res.items
            this.pagination.total = res.totalNum
            this.loading = false
          })
          .catch(
            err => {
              console.log(err)
              this.loading = false
            }
          )
      },
      getAdministrativeDivisionTree () {
        getAdministrativeDivisionTree()
          .then(res => {
            this.cityOptions = res
          })
          .catch(
            err => {
              console.log(err)
            }
          )
      },
      getCustomerLevel () {
        getCustomerLevel()
          .then(res => {
            this.levelOptions = res
          })
          .catch(
            err => {
              console.log(err)
            }
          )
      },
      cityChange (value) {
        this.searchData.cityCode = value[value.length - 1]
        console.log(this.searchData.cityCode)
      },
      timeChange (value) {
        // console.log(value)
        if (value.length === 2) {
          this.searchData.beginTime = value[0]
          this.searchData.endTime = value[1]
        } else {
          this.searchData.beginTime = ''
          this.searchData.endTime = ''
        }
      },
      checked1Change (value) {
        if (value) {
          this.checked2 = false
          this.searchData.tradedTimes = 0
        } else {
          if (this.checked2) {
            this.searchData.tradedTimes = 1
          } else {
            this.searchData.tradedTimes = -1
          }
        }
        console.log(this.searchData.tradedTimes)
      },
      checked2Change (value) {
        if (value) {
          this.checked1 = false
          this.searchData.tradedTimes = 1
        } else {
          if (this.checked1) {
            this.searchData.tradedTimes = 0
          } else {
            this.searchData.tradedTimes = -1
          }
        }
        console.log(this.searchData.tradedTimes)
      },
      levelChange (value) {
        this.searchData.level = value
        if (this.searchData.level === '') {
          this.searchData.level = 0
        }
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

<style scoped>
  .el-row {
    margin-bottom: 5px;
  }
  .seachleft{
    padding-left:0px!important;
  }
  .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner {
    width: 250px!important;
  }
  .fixedCol{
    width:100%;
  }
</style>
