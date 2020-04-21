<template>
  <d2-container>
    <el-form ref="form" :model="form" label-width="100px" :rules="addRules">
      <el-form-item label="姓名:"  prop="name">
        <el-col :span="6">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="性别:">
        <el-radio-group v-model="form.gender">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号码:"  prop="phone">
        <el-col :span="6">
          <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="居住地址:">
        <el-col :span="5">
          <el-cascader :options="cityOptions"  v-model="selectedCity" @change="cityChange"></el-cascader>
        </el-col>
        <el-col :span="15">
          <el-input type="text" v-model="form.address"  placeholder="请输入详细地址"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="其他联系方式:">
        <el-col :span="5">
          <el-input v-model="form.email" placeholder="邮箱"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input v-model="form.qQ" placeholder="QQ"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input v-model="form.weChat" placeholder="微信"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input v-model="form.otherContact" placeholder="其他"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="跟进情况:">
        <el-switch
          v-model="form.isVisit"
          active-text="有跟进"
          inactive-text="无跟进">
        </el-switch>
      </el-form-item>
      <el-divider v-if="form.isVisit">填写跟进信息</el-divider>
      <el-form-item label="跟进类型:" v-if="form.isVisit">
        <el-col :span="5">
          <el-select v-model="form.visitType"   placeholder="请选择跟进类型" @change="visitTypeChange" >
            <el-option
              v-for="item in visitTypeOptions"
              :key="item.enumValue"
              :label="item.desction"
              :value="item.enumValue">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="15">
          <el-input type="text" v-model="form.visitContent"  :placeholder="visitPlaceholder"></el-input>
        </el-col>
      </el-form-item>

      <el-form-item label="客户需求:" prop="demand" v-if="form.isVisit">
        <el-col :span="20">
          <el-input type="textarea" v-model="form.demand" placeholder="请输入客户购房需求"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="意向房源:"  v-if="form.isVisit">
        <el-col :span="20">
          <el-input type="textarea" v-model="form.intentionHouse" placeholder="请输入客户意向房源"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="客户意向:" prop="purchasingIntention"  v-if="form.isVisit">
        <el-col :span="20" style="margin:10px">
          <el-rate v-model="purchasingIntention"
                   :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                   show-text
                   :texts="showTexts"
                   :icon-classes="iconClasses"
                   void-icon-class="icon-rate-face-off"
                   @change="purchasingIntentionChange"
          ></el-rate>
        </el-col>
      </el-form-item>
      <el-form-item label="备注:"  v-if="form.isVisit">
        <el-col :span="20">
          <el-input type="textarea" v-model="form.remark" placeholder="其他信息备注，客户性格爱好等"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="跟进计划:">
        <el-switch
          v-model="form.hasVisitPlan"
          active-text="有计划"
          inactive-text="无计划">
        </el-switch>
      </el-form-item>
      <el-divider v-if="form.hasVisitPlan">填写跟进计划</el-divider>
      <!--<el-form-item label="客户类型">-->
        <!--<el-radio-group v-model="poolType" @change="poolTypeChange">-->
          <!--<el-radio label="0">个人客户</el-radio>-->
          <!--<el-radio label="1">公共客户</el-radio>-->
        <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <el-form-item label="计划跟进类型:" v-if="form.hasVisitPlan">
        <el-col :span="5">
          <el-select v-model="form.planVisitType"   placeholder="请选择跟进类型" @change="planVisitTypeChange" >
            <el-option
              v-for="item in visitTypeOptions"
              :key="item.enumValue"
              :label="item.desction"
              :value="item.enumValue">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="15">
          <el-input type="text" v-model="form.planVisitContent"  :placeholder="planVisitPlaceholder"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="计划跟进时间:" v-if="form.hasVisitPlan">
        <el-date-picker
          v-model="form.planVisitTime"
          type="datetime"
          placeholder="选择日期时间"
          :clearable = "false">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveCustomer" :loading="saveLoading">保存</el-button>
      </el-form-item>
    </el-form>
  </d2-container>
</template>
<script>
  import {getAdministrativeDivisionTree,} from '@/api/sys.login'
  import {getVisitType,} from '@/api/common'
  import {addCustomer} from '@/api/crm'

  import moment from 'moment'
  import util from '@/libs/util.js'
  export default {
    props: {},
    name: "customer-add",
    data() {
      return {
        form: {
          name: '',
          gender: 0,
          phone: '',
          cityCode: '',
          cityName: '',
          address: '',
          email: '',
          qQ: '',
          weChat: '',
          otherContact: '',
          demand: '',
          intentionHouse: '',
          purchasingIntention: 0,
          remark: '',
          belongPoolId: util.cookies.get('uuid'),
          currentPoolId: util.cookies.get('uuid'),
          createdUser: util.cookies.get('uuid'),
          currentPoolName: util.cookies.get('loginName'),
          belongPoolType:util.cookies.get('roleName') === '经纪人' ? 0 : 1,
          isVisit: false,
          visitType: 2,
          visitContent: '',
          hasVisitPlan: false,
          planVisitTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          planVisitType:2,
          planVisitContent: ''
        },
        purchasingIntention: 0,
        poolType: '0',
        cityOptions: [],
        selectedCity: [],
        addRules: {
          name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
          phone: [{required: true, message: '请输入手机号码', trigger: 'blur'}],
          demand: [{required: true, message: '请输入客户需求', trigger: 'blur'}],
          purchasingIntention: [{required: true, message: '请输入客户需求', trigger: 'blur'}]
        },
        iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'],
        showTexts: ['无意向', '意向弱', '意向一般', '意向强', '意向很强'],
        saveLoading: false,
        visitTypeOptions: [],
        visitPlaceholder: "请输入跟进内容",
        planVisitPlaceholder: "请输入跟进内容"
      }
    },
    mounted () {
      // console.log('CommonPoolId='+window.CommonPoolId)
      //console.log(this.$route.params.pool)
      // console.log(this.pool)
      //this.poolTypeOptions = this.$route.params.pool
      //console.log(this.poolTypeOptions==='1')

      // this.form.poolType=this.$route.params.pool
    },
    created () {
      this.getAdministrativeDivisionTree()
      this.getVisitTYpe()
    },
    methods: {
      // 请求表格数据
      getAdministrativeDivisionTree () {
        this.loading = true
        getAdministrativeDivisionTree()
          .then(res => {
            this.cityOptions = res
            this.loading = false
          })
          .catch(
            err => {
              console.log(err)
              this.loading = false
            }
          )
      },
      getVisitTYpe () {
        getVisitType()
          .then(res => {
            this.visitTypeOptions = res
          })
          .catch(
            err => {
              console.log(err)
            }
          )
      },
      visitTypeChange (value) {
        if(value === 2) {
          this.visitPlaceholder="请输入跟进内容"
        }
        if(value === 0) {
          this.visitPlaceholder="请输入接机航班"
        }
        if(value === 1) {
          this.visitPlaceholder="请输入带看房源"
        }
      },
      planVisitTypeChange (value) {
        if (value === 2) {

          this.planVisitPlaceholder = "请输入跟进内容"
        }
        if (value === 0) {
          this.planVisitPlaceholder = "请输入接机航班"
        }
        if (value === 1) {
          this.planVisitPlaceholder = "请输入带看房源"
        }
      },
      saveCustomer () {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.saveLoading = true
            console.log(this.form)
            addCustomer(this.form)
              .then(res => {
                console.log('res='+res)
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.saveLoading = false
              })
              .catch(
                err => {
                  console.log(err)
                  this.saveLoading = false
                  this.$message.error(err.message)
                }
              )
          } else {
            this.$message.error('表单校验失败，请检查')
          }
        })
      },
      cityChange (value) {
        this.form.cityCode = value[value.length - 1]
        console.log(this.form.cityCode)
      },
      // poolTypeChange (value) {
      //   if(value === '0'){
      //     this.form.belongPoolId = this.form.currentPoolId = util.cookies.get('uuid')
      //     this.form.currentPoolName = util.cookies.get('loginName')
      //   } else {
      //     this.form.belongPoolId = this.form.currentPoolId = window.CommonPoolId
      //     this.form.currentPoolName = '公共客户池'
      //   }
      //   console.log(this.form.belongPoolId)
      // },
      purchasingIntentionChange (value) {
        console.log(value)
        this.form.purchasingIntention = value-1
        console.log(this.form.purchasingIntention)
      }
    }
  }
</script>

<style scoped>
  /*.el-form-item{*/
    /*margin-bottom: 8px!important;*/
  /*}*/
  @import '../../../../assets/styles/common.css';
  @import '../../../../assets/styles/fonts/style.css';

  .el-divider__text {
    color: #3a72e4;
  }
</style>
<!--<style>-->

  <!--.el-select .el-input {-->
    <!--width: 100%!important;-->
  <!--}-->
<!--</style>-->
