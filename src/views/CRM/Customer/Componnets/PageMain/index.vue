<template>
  <div>
    <el-table
      ref="table"
      :data="currentTableData"
      v-loading="loading"
      size="mini"
      stripe
      style="width: 100%;"
      :lazy="true"
      :load="load"
      @cell-click="toogleExpand"
     >

      <!--<el-table-column-->
        <!--type="selection"-->
        <!--width="55">-->
      <!--</el-table-column>-->
      <el-table-column  width="30" type="expand" >
        <template slot-scope="props">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp" class="visit">
              {{activity.content}}
            </el-timeline-item>
          </el-timeline>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="70" align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="45" align="center">
        <template slot-scope="scope">
          {{scope.row.genderText}}
        </template>
      </el-table-column>

      <el-table-column label="电话" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110" align="center">
        <template slot-scope="scope">
          <customer-tag :value="scope.row.planVisitState" :scope="scope.row"></customer-tag>
        </template>
      </el-table-column>
      <el-table-column label="意向度" width="110" align="center">
        <template slot-scope="scope">
          <purchasing-intention :value="scope.row.purchasingIntentionText"></purchasing-intention>
        </template>
      </el-table-column>
      <el-table-column label="客户需求" width="165" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.demand}}
        </template>
      </el-table-column>
      <el-table-column label="客户地址" width="145" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.addressAll}}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="120" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">
          {{scope.row.createdTimeText}}
        </template>
      </el-table-column>
      <el-table-column label="经纪人" width="110" :show-overflow-tooltip="true" v-if="roleName != '经纪人'">
        <template slot-scope="scope">
          {{scope.row.currentPoolName}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="110" v-else>
        <template slot-scope="scope">
          <el-button v-on:click.stop="handleEditClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button v-on:click.stop="handleRemoveClick(scope.row,scope.$index,currentTableData)" type="text" size="small">转入公池</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑客户基本信息" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" label-width="100px" :rules="addRules">
        <el-form-item label="姓名:"  prop="name">
          <el-col :span="12">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别:">
          <el-radio-group v-model="form.gender" @change="genderChange">
            <el-radio :label="0" >男</el-radio>
            <el-radio :label="1" >女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码:"  prop="phone">
          <el-col :span="12">
            <el-input v-model="form.phone" placeholder="请输入手机号码"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="居住地址:">
          <el-col :span="5">
            <el-cascader :options="cityOptions" ref="city"  v-model="selectedCity" @change="cityChange"></el-cascader>
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
            <el-input v-model="form.qq" placeholder="QQ"></el-input>
          </el-col>
          <el-col :span="5">
            <el-input v-model="form.weChat" placeholder="微信"></el-input>
          </el-col>
          <el-col :span="5">
            <el-input v-model="form.otherContact" placeholder="其他"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCustomer()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import util from '@/libs/util.js'
import CustomerTag from '../Common/CustomerTag'
import PurchasingIntention from '../Common/PurchasingIntention'
  import {getAdministrativeDivisionTree,getAdministrativeDivisionByCode} from '@/api/sys.login'
  import {privateToPublic, updateCustomer} from '@/api/crm'
export default {
  components: {
    CustomerTag,
    PurchasingIntention
  },
  props: {
    tableData: {
      default: () => []
    },
    loading: {
      default: false
    }
  },
  data () {
    return {
      roleName: util.cookies.get('roleName'),
      currentTableData: [],
      multipleSelection: [],
      dialogFormVisible: false,
      form:{
        Id:'',
        name: '',
        gender: '0',
        phone: '',
        cityCode: '',
        cityName: '',
        address: '',
        email: '',
        qq: '',
        weChat: '',
        otherContact: '',
      },
      cityOptions: [],
      selectedCity: [],
      addRules: {
        name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
        phone: [{required: true, message: '请输入手机号码', trigger: 'blur'}],
        demand: [{required: true, message: '请输入客户需求', trigger: 'blur'}],
        purchasingIntention: [{required: true, message: '请输入客户需求', trigger: 'blur'}]
      },
      activities: [{
        content: '支持使用图标',
        timestamp: '2018-04-12 20:46',
        size: 'large',
        type: 'primary',
        icon: 'el-icon-date',
        size: 'large'
      }, {
        content: '支持自定义颜色',
        timestamp: '2018-04-03 20:46',
        color: '#0bbd87',
        icon: 'el-icon-chat-line-square',
        size: 'large'
      }, {
        content: '支持自定义尺寸',
        timestamp: '2018-04-03 20:46',
        size: 'large'
      }, {
        content: '默认样式的节点',
        timestamp: '2018-04-03 20:46'
      }]
    }
  },
  created () {
    this.getAdministrativeDivisionTree()
  },
  watch: {
    tableData: {
      handler (val) {
        this.currentTableData = val
      },
      immediate: true
    }
  },
  methods: {
    load () {
      setTimeout(() => {
        resolve([{
          content: '支持使用图标',
          timestamp: '2018-04-12 20:46',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-date',
          size: 'large'
        }, {
          content: '支持自定义颜色',
          timestamp: '2018-04-03 20:46',
          color: '#0bbd87',
          icon: 'el-icon-chat-line-square',
          size: 'large'
        }, {
          content: '支持自定义尺寸',
          timestamp: '2018-04-03 20:46',
          size: 'large'
        }, {
          content: '默认样式的节点',
          timestamp: '2018-04-03 20:46'
        }])
      }, 1000)
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
    getAdministrativeDivisionByCode (cityCode) {
      getAdministrativeDivisionByCode(cityCode)
        .then(res => {
          this.selectedCity = res.map(obj => {return obj.code})
          console.log(this.selectedCity)
        })
        .catch(
          err => {
          }
        )
    },
    genderChange (value) {
      if(value == 0) {
        this.form.genderText = '男'
      } else {
        this.form.genderText = '女'
      }
    },
    cityChange (value) {
      this.form.cityCode = value[value.length - 1]
      var node = this.$refs.city.getCheckedNodes()
      var nodes = node[0].pathNodes
      this.form.cityName= ''
      for( var i = 0; i < nodes.length; i++)
      {
        this.form.cityName= this.form.cityName+nodes[i].label
      }
      console.log(this.form.cityName)
    },
    handleSwitchChange (val, index) {
      const oldValue = this.currentTableData[index]
      this.$set(this.currentTableData, index, {
        ...oldValue,
        type: val
      })
      // 注意 这里并没有把修改后的数据传递出去 如果需要的话请自行修改
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    privateToPublic (row,index,rows) {
      console.log(row)
      var param = {
        id: row.id,
        createdUser: util.cookies.get('uuid')
      }
      privateToPublic(param)
        .then(res => {
          if (res) {
            this.$message({
              message: '客户转移成功',
              type: 'success'
            })
            rows.splice(index, 1);
          } else {
            this.$message({
              message: '客户转移失败',
              type: 'warning'
            })
          }
        })
        .catch(
          err => {
            // this.$message({
            //   message: '删除失败',
            //   type: 'warning'
            // })
            console.log(err)
          }
        )
    },
    handleRemoveClick(row,index,rows) {
      this.$confirm('确认要将该客户转入公池？')
        .then(_ => {
          this.privateToPublic(row,index,rows)
        })
        .catch(_ => {
          // this.$message({
          //   message: '客户转移失败',
          //   type: 'warning'
          // })

          console.log(_)
        });
    },
    updateCustomer () {
      this.form.addressAll = this.form.cityName + this.form.address
      updateCustomer(this.form)
        .then(res => {
          if (res) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            // row.name=this.form.name
            // row.gender=this.form.gender
            // row.phone=this.form.phone
            // row.cityCode=this.form.cityCode
            // row.cityName=this.form.cityName
            // row.address=this.form.address
            // row.email=this.form.email
            // row.qQ=this.form.qQ
            // row.weChat=this.form.weChat
            // row.otherContact=this.form.otherContact
            // done()
            this.dialogFormVisible = false
          } else {
            this.$message({
              message: '修改失败',
              type: 'warning'
            })
          }
        })
        .catch(
          err => {
            // this.$message({
            //   message: '修改失败',
            //   type: 'warning'
            // })
            console.log(err)
          }
        )
    },
    handleEditClick(row) {
      this.form = row
      console.log(row.cityCode)
      this.getAdministrativeDivisionByCode(row.cityCode)
      this.dialogFormVisible = true
    },
    toogleExpand(row,col,cell,event) {
      console.log(row,col,cell,event)
      let $table = this.$refs.table
      this.currentTableData.map((item) => {
        console.log(item.name)
        if (row.id != item.id) {
          $table.toggleRowExpansion(item, false)
        }
      })
      $table.toggleRowExpansion(row)
    }
  }
}
</script>
