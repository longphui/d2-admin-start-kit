<template>
  <el-tabs type="border-card">
    <el-tab-pane label="填写跟进内容">
      <el-form ref="formVisit" :model="formVisit" label-width="100px" :rules="addVisitRules">
        <el-form-item label="跟进类型:"  prop="visitType" >
          <el-col :span="5">
            <el-select v-model="formVisit.visitType"   placeholder="请选择跟进类型" @change="visitTypeChange" >
              <el-option
                v-for="item in visitTypeOptions"
                :key="item.enumValue"
                :label="item.desction"
                :value="item.enumValue">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-input type="text" v-model="formVisit.visitContent"  :placeholder="formVisit.visitPlaceholder"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="客户需求:" prop="demand">
          <el-col :span="20">
            <el-input type="textarea" v-model="formVisit.demand" placeholder="请输入客户购房需求"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="意向房源:" >
          <el-col :span="20">
            <el-input type="textarea" v-model="formVisit.intentionHouse" placeholder="请输入客户意向房源"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="客户意向:" prop="purchasingIntention" >
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
        <el-form-item label="备注:" >
          <el-col :span="20">
            <el-input type="textarea" v-model="formVisit.remark" placeholder="其他信息备注，客户性格爱好等"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="跟进计划:">
          <el-switch
            v-model="formVisit.hasVisitPlan"
            active-text="有计划"
            inactive-text="无计划">
          </el-switch>
        </el-form-item>
        <el-divider v-if="formVisit.hasVisitPlan">填写跟进计划</el-divider>
        <!--<el-form-item label="客户类型">-->
        <!--<el-radio-group v-model="poolType" @change="poolTypeChange">-->
        <!--<el-radio label="0">个人客户</el-radio>-->
        <!--<el-radio label="1">公共客户</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <el-form-item label="计划跟进类型:" v-if="formVisit.hasVisitPlan"  prop="planVisitType" >
          <el-col :span="5">
            <el-select v-model="formVisit.planVisitType"   placeholder="请选择跟进类型" @change="planVisitTypeChange" >
              <el-option
                v-for="item in visitTypeOptions"
                :key="item.enumValue"
                :label="item.desction"
                :value="item.enumValue">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-input type="text" v-model="formVisit.planVisitContent"  :placeholder="formVisit.planVisitPlaceholder"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="计划跟进时间:" v-if="formVisit.hasVisitPlan">
          <el-date-picker
            v-model="formVisit.planVisitTime"
            type="datetime"
            placeholder="选择日期时间"
            :clearable = "false">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveVisit" :loading="saveLoading">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="填写跟进计划">
      <el-form ref="formPlan" :model="formPlan" label-width="100px" :rules="addPlanRules">
        <el-form-item label="计划跟进类型:"  prop="planVisitType" >
          <el-col :span="5">
            <el-select v-model="formPlan.planVisitType"   placeholder="请选择跟进类型" @change="planVisitTypeChange1" >
              <el-option
                v-for="item in visitTypeOptions"
                :key="item.enumValue"
                :label="item.desction"
                :value="item.enumValue">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="15">
            <el-input type="text" v-model="formPlan.planVisitContent"  :placeholder="formPlan.planVisitPlaceholder"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="计划跟进时间:" >
          <el-date-picker
            v-model="formPlan.planVisitTime"
            type="datetime"
            placeholder="选择日期时间"
            :clearable = "false">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="savePlan" :loading="savePlanLoading">保存</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <!--<el-tab-pane closable ></el-tab-pane>-->
  </el-tabs>
</template>
<script>
  import {getVisitType,} from '@/api/common'
  import {addReturnVisit, addVisitPlan} from '@/api/crm'

  import moment from 'moment'
  import util from '@/libs/util.js'
  export default {
    props: {
      scope: {
        default: null
      }
    },
    name: "visit-add",
    data() {
      return {
        formVisit: {
          customerId: this.scope.id,
          demand: '',
          level: 1,
          intentionHouse: '',
          purchasingIntention: 0,
          remark: '',
          createdUser: util.cookies.get('uuid'),
          visitType: 2,
          visitContent: '',
          visitUser: util.cookies.get('loginName'),
          hasVisitPlan: false,
          planVisitTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          planVisitType:2,
          planVisitContent: '',
          visitPlaceholder: "请输入跟进内容",
          planVisitPlaceholder: "请输入跟进内容"
        },
        formPlan: {
          customerId: this.scope.id,
          planVisitTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          planVisitType:2,
          planVisitContent: '',
          planVisitPlaceholder: "请输入跟进内容",
          createdUser: util.cookies.get('uuid'),
        },
        purchasingIntention: 0,
        poolType: '0',
        cityOptions: [],
        selectedCity: [],

        iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3'],
        showTexts: ['无意向', '意向弱', '意向一般', '意向强', '意向很强'],
        saveVisitLoading: false,
        savePlanLoading: false,
        visitTypeOptions: []
      }
    },
    computed:{
      addVisitRules () {
        var validateVisitType = (rule, value,callback) => {
          if (this.formVisit.visitType === 0 && this.formVisit.visitContent === '') {
            callback(new Error('必须填写接机航班号'))
          } else if (this.formVisit.visitType === 1 && this.formVisit.visitContent === '') {
            callback(new Error('必须填写带看的房源信息'))
          } else {
            callback()
          }
        };
        var validatePlanVisitType = (rule, value,callback) => {
          if (this.hasVisitPlan && this.formVisit.planVisitType === 0 && this.formVisit.planVisitContent === '') {
            callback(new Error('必须填写接机航班号'))
          } else if (this.hasVisitPlan && this.formVisit.planVisitType === 1 && this.formVisit.planVisitContent === '') {
            callback(new Error('必须填写带看的房源信息'))
          } else {
            callback()
          }
        };
        return {
          demand: [{required: true, message: '请输入客户需求', trigger: 'blur'}],
          purchasingIntention: [{required: true, message: '请输入客户需求', trigger: 'blur'}],
          visitType: { validator: validateVisitType, trigger: "blur" },
          planVisitType: { validator: validatePlanVisitType, trigger: "blur" },
        }
      },
      addPlanRules () {
        var validatePlanVisitType = (rule, value,callback) => {
          if (this.formPlan.planVisitType === 0 && this.formPlan.planVisitContent === '') {
            callback(new Error('必须填写接机航班号'))
          } else if (this.formPlan.planVisitType === 1 && this.formPlan.planVisitContent === '') {
            callback(new Error('必须填写带看的房源信息'))
          } else {
            callback()
          }
        };
        return {
          planVisitType: { validator: validatePlanVisitType, trigger: "blur" }
        }
      },
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
      // console.log("addvisit")
      // console.log(this.scope)
      this.getVisitTYpe()
    },
    methods: {
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
          this.formVisit.visitPlaceholder="请输入跟进内容"
        }
        if(value === 0) {
          this.formVisit.visitPlaceholder="请输入接机航班"
        }
        if(value === 1) {
          this.formVisit.visitPlaceholder="请输入带看房源"
        }
      },
      planVisitTypeChange (value) {
        if (value === 2) {
          this.formVisit.planVisitPlaceholder = "请输入跟进内容"
        }
        if (value === 0) {
          this.formVisit.planVisitPlaceholder = "请输入接机航班"
        }
        if (value === 1) {
          this.formVisit.planVisitPlaceholder = "请输入带看房源"
        }
      },
      planVisitTypeChange1 (value) {
        if (value === 2) {
          this.formPlan.planVisitPlaceholder = "请输入跟进内容"
        }
        if (value === 0) {
          this.formPlan.planVisitPlaceholder = "请输入接机航班"
        }
        if (value === 1) {
          this.formPlan.planVisitPlaceholder = "请输入带看房源"
        }
      },
      saveVisit () {
        this.$refs.formVisit.validate((valid) => {
          if (valid) {
            this.saveVisitLoading = true
            console.log(this.formVisit)
            addReturnVisit(this.formVisit)
              .then(res => {
                console.log('res='+res)
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.saveVisitLoading = false
              })
              .catch(
                err => {
                  console.log(err)
                  this.saveVisitLoading = false
                  this.$message.error(err.message)
                }
              )
          } else {
            this.$message.error('表单校验失败，请检查')
          }
        })
      },
      savePlan () {
        this.$refs.formPlan.validate((valid) => {
          if (valid) {
            this.savePlanLoading = true
            console.log(this.formPlan)
            addVisitPlan(this.formPlan)
              .then(res => {
                console.log('res='+res)
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.savePlanLoading = false
              })
              .catch(
                err => {
                  console.log(err)
                  this.savePlanLoading = false
                  this.$message.error(err.message)
                }
              )
          } else {
            this.$message.error('表单校验失败，请检查')
          }
        })
      },
      purchasingIntentionChange (value) {
        console.log(value)
        this.formVisit.purchasingIntention = value-1
        console.log(this.formVisit.purchasingIntention)
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
