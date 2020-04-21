<template>
  <div class="page-login">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div
      class="page-login--layer page-login--layer-time"
      flex="main:center cross:center">
      {{time}}
    </div>
    <div class="page-login--layer">
      <div
        class="page-login--content"
        flex="dir:top main:justify cross:stretch box:justify">
        <div class="page-login--content-header">
          <p class="page-login--content-header-motto">
            时间是一切财富中最宝贵的财富
          </p>
        </div>
        <div
          class="page-login--content-main"
          flex="dir:top main:center cross:center">
          <!-- logo -->
          <img class="page-login--logo" src="./image/icon-only.png">
          <!-- form -->
          <div class="page-login--form">
            <el-card shadow="never">
              <el-form
                ref="loginForm"
                label-position="top"
                :rules="rules"
                :model="formLogin"
                size="default">
                <el-form-item prop="username">
                  <el-input
                    type="text"
                    v-model="formLogin.username"
                    placeholder="用户名">
                    <i slot="prepend" class="fa fa-user-circle-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    type="password"
                    v-model="formLogin.password"
                    placeholder="密码">
                    <i slot="prepend" class="fa fa-keyboard-o"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="code">
                  <el-input
                    type="text"
                    v-model="formLogin.code"
                    placeholder="验证码"
                  @input.native="inputCodeVerifyEvent">
                    <template slot="append">
                      <div class="login-code" id="verifyCode"></div>
                    </template>
                  </el-input>
                </el-form-item>

                <el-button
                  id="btnLogin"
                  size="default"
                  @click="submit"
                  type="primary"
                  class="button-login">
                  登录
                </el-button>
              </el-form>
            </el-card>
            <p
              class="page-login--options"
              flex="main:justify cross:center">
              <span><d2-icon name="question-circle"/> 忘记密码</span>
              <span>注册用户</span>
            </p>
            <img class="login-dui" src="./image/dui.png" v-show="showVerifyImg">
            <!-- quick login -->
            <!--<el-button class="page-login&#45;&#45;quick" size="default" type="info" @click="dialogVisible = true">-->
              <!--快速选择用户（测试功能）-->
            <!--</el-button>-->
          </div>
        </div>
        <div class="page-login--content-footer">
          <!--<p class="page-login&#45;&#45;content-footer-locales">-->
            <!--<a-->
              <!--v-for="language in $languages"-->
              <!--:key="language.value"-->
              <!--@click="onChangeLocale(language.value)">-->
              <!--{{ language.label }}-->
            <!--</a>-->
          <!--</p>-->
          <!--<p class="page-login&#45;&#45;content-footer-copyright">-->
            <!--Copyright-->
            <!--<d2-icon name="copyright"/>-->
            <!--2018 D2 Projects 开源组织出品-->
            <!--<a href="https://github.com/FairyEver">-->
              <!--@FairyEver-->
            <!--</a>-->
          <!--</p>-->
          <!--<p class="page-login&#45;&#45;content-footer-options">-->
            <!--<a href="#">帮助</a>-->
            <!--<a href="#">隐私</a>-->
            <!--<a href="#">条款</a>-->
          <!--</p>-->
        </div>
      </div>
    </div>
    <!--<el-dialog-->
      <!--title="快速选择用户"-->
      <!--:visible.sync="dialogVisible"-->
      <!--width="400px">-->
      <!--<el-row :gutter="10" style="margin: -20px 0px -10px 0px;">-->
        <!--<el-col v-for="(user, index) in users" :key="index" :span="8">-->
          <!--<div class="page-login&#45;&#45;quick-user" @click="handleUserBtnClick(user)">-->
            <!--<d2-icon name="user-circle-o"/>-->
            <!--<span>{{user.name}}</span>-->
          <!--</div>-->
        <!--</el-col>-->
      <!--</el-row>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
import localeMixin from '@/locales/mixin.js'
import util from '@/libs/util.js'
export default {
  mixins: [
    localeMixin
  ],
  data () {
    return {
      verifyCode:{},
      showVerifyImg: false,
      timeInterval: null,
      time: dayjs().format('HH:mm:ss'),
      // 快速选择用户
      dialogVisible: false,
      users: [
        {
          name: 'Admin',
          username: 'admin',
          password: 'admin'
        },
        {
          name: 'Editor',
          username: 'editor',
          password: 'editor'
        },
        {
          name: 'User1',
          username: 'user1',
          password: 'user1'
        }
      ],
      // 表单
      formLogin: {
        username: '',
        password: '',
        code: ''
      },
      // 表单校验
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          },
          {
            validator: this.inputCodeVerify,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
    this.verifyCode=this.getGVerify ("verifyCode");
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  },
  methods: {
    ...mapActions('d2admin/account', [
      'login'
    ]),
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },
    /**
     * @description 接收选择一个用户快速登录的事件
     * @param {Object} user 用户信息
     */
    handleUserBtnClick (user) {
      this.formLogin.username = user.username
      this.formLogin.password = user.password
      this.submit()
    },
    /**
     * @description 提交表单
     */
    // 提交登录信息
    submit () {
      // debugger
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.login({
            username: this.formLogin.username,
            password: this.formLogin.password
          })
            .then((res) => {
              if (!!(util.cookies.get('asideMenu'))) {
                this.$store.commit('d2admin/menu/asideSet',  JSON.parse(util.cookies.get('asideMenu')), { root: true })
              }
              // if (res.roleName === '经纪人') {
              //   this.$store.commit('d2admin/menu/asideSet', [
              //     { path: '/index', title: '首页', icon: 'home' },
              //     {
              //       title: '客源',
              //       icon: 'folder-o',
              //       children: [
              //         // { path: '/customer-add', title: '新增客户' },
              //         { path: '/customer-private', title: '我的客户' },
              //         { path: '/customer-public', title: '公共客户' },
              //         // { path: '/visit-add', title: '新增回访' }
              //       ]
              //     }
              //   ], { root: true })
              // } else {
              //   this.$store.commit('d2admin/menu/asideSet', [
              //     { path: '/index', title: '首页', icon: 'home' },
              //     {
              //       title: '系统',
              //       icon: 'folder-o',
              //       children: [
              //         { path: '/sys-user', title: '用户' },
              //          { path: '/page2', title: '权限' },
              //         { path: '/page3', title: '设置' }
              //       ]
              //     },
              //     {
              //       title: '客源',
              //       icon: 'folder-o',
              //       children: [
              //         // { path: '/customer-add', title: '新增客户' },
              //         { path: '/customer-private', title: '个人客户' },
              //         { path: '/customer-public', title: '公共客户' },
              //         // { path: '/visit-add', title: '新增回访' }
              //       ]
              //     }
              //   ], { root: true })
              // }
              // 重定向对象不存在则返回顶层路径
              this.$router.replace(this.$route.query.redirect || '/')
            })
        } else {
          // 登录表单校验失败
          this.$message.error('表单校验失败，请检查')
        }
      })
    },
    getGVerify (id){
      function GVerify(options) { //创建一个图形验证码对象，接收options对象为参数
        this.options = { //默认options参数值
          id: "", //容器Id
          canvasId: "verifyCanvas", //canvas的ID
          width: "97", //默认canvas宽度
          height: "38", //默认canvas高度
          type: "blend", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
          code: ""
        }

        if(Object.prototype.toString.call(options) == "[object Object]"){//判断传入参数类型
          for(var i in options) { //根据传入的参数，修改默认参数值
            this.options[i] = options[i];
          }
        }else{
          this.options.id = options;
        }

        this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
        this.options.letterArr = getAllLetter();

        this._init();
        this.refresh();
      }

      GVerify.prototype = {
        /**版本号**/
        version: '1.0.0',

        /**初始化方法**/
        _init: function() {
          var con = document.getElementById(this.options.id);
          var canvas = document.createElement("canvas");
          /*this.options.width = con.offsetWidth > 0 ? con.offsetWidth : "100";
          this.options.height = con.offsetHeight > 0 ? con.offsetHeight : "30";*/
          canvas.id = this.options.canvasId;
          canvas.width = this.options.width;
          canvas.height = this.options.height;
          canvas.style.cursor = "pointer";
          canvas.innerHTML = "您的浏览器版本不支持canvas";
          con.appendChild(canvas);
          var parent = this;
          canvas.onclick = function(){
            parent.refresh();
          }
        },

        /**生成验证码**/
        refresh: function() {
          this.options.code = '';
          var canvas = document.getElementById(this.options.canvasId);
          if(canvas.getContext) {
            var ctx = canvas.getContext('2d');
          }
          ctx.textBaseline = "middle";

          ctx.fillStyle = randomColor(180, 240);
          ctx.fillRect(0, 0, this.options.width, this.options.height);

          if(this.options.type == "blend") { //判断验证码类型
            var txtArr = this.options.numArr.concat(this.options.letterArr);
          } else if(this.options.type == "number") {
            var txtArr = this.options.numArr;
          } else {
            var txtArr = this.options.letterArr;
          }

          for(var i = 1; i <= 4; i++) {
            var txt = txtArr[randomNum(0, txtArr.length)];
            this.options.code += txt;
            ctx.font = '20px SimHei';
            //ctx.font = randomNum(this.options.height/2, this.options.height) + 'px SimHei'; //随机生成字体大小
            ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
            /* ctx.shadowOffsetX = randomNum(-3, 3);
            ctx.shadowOffsetY = randomNum(-3, 3);*/
            ctx.shadowBlur = randomNum(-3, 3);
            ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
            var x = this.options.width / 5 * i;
            var y = this.options.height / 2;
            var deg = randomNum(-30, 30);
            /**设置旋转角度和坐标原点**/
            ctx.translate(x, y);
            ctx.rotate(deg * Math.PI / 180);
            ctx.fillText(txt, 0, 0);
            /**恢复旋转角度和坐标原点**/
            ctx.rotate(-deg * Math.PI / 180);
            ctx.translate(-x, -y);
          }
          /**绘制干扰线**/
          for(var i = 0; i < 4; i++) {
            ctx.strokeStyle = randomColor(40, 180);
            ctx.beginPath();
            ctx.moveTo(randomNum(0, this.options.width/2), randomNum(0, this.options.height/2));
            ctx.lineTo(randomNum(0, this.options.width/2), randomNum(0, this.options.height));
            ctx.stroke();
          }
          /**绘制干扰点**/
          for(var i = 0; i < this.options.width/4; i++) {
            ctx.fillStyle = randomColor(0, 255);
            ctx.beginPath();
            ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
            ctx.fill();
          }
        },

        /**验证验证码**/
        validate: function(code){
          var verifyCode = code.toLowerCase();
          var v_code = this.options.code.toLowerCase();
          if(verifyCode == v_code){
            return true;
          }else{
            return false;
          }
        }
      }

      /**生成字母数组**/
      function getAllLetter() {
        var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        return letterStr.split(",");
      }
      /**生成一个随机数**/
      function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      }
      /**生成一个随机色**/
      function randomColor(min, max) {
        var r = randomNum(min, max);
        var g = randomNum(min, max);
        var b = randomNum(min, max);
        return "rgb(" + r + "," + g + "," + b + ")";
      }

      return new GVerify(id);
    },
    inputCodeVerify (rule,value, callback) {
      // debugger
      // console.log('rule=',rule)
      // console.log('value=',value)
      this.showVerifyImg = this.verifyCode.validate( value)
      if (!this.showVerifyImg) {
        callback(new Error('验证码错误'))
        this.verifyCode.refresh()
      }
      else {
        callback()
      }
    },
    inputCodeVerifyEvent (event) {
      // debugger
      // console.log('rule=',rule)
      // console.log('value=',value)
      if(event.target.value.length === 4) {
        event.target.blur()
        // this.showVerifyImg = this.verifyCode.validate(event.target.value)
        // if (!this.showVerifyImg) {
        //   callback(new Error('验证码错误'))
        //   this.verifyCode.refresh()
        // }
        // else {
        //   callback()
        // }
      }
    },
  }
}
</script>

<style lang="scss">
.page-login {
  @extend %unable-select;
  $backgroundColor: #F0F2F5;
  // ---
  background-color: $backgroundColor;
  height: 100%;
  position: relative;
  // 层
  .page-login--layer {
    @extend %full;
    overflow: auto;
  }
  .page-login--layer-area {
    overflow: hidden;
  }
  // 时间
  .page-login--layer-time {
    font-size: 24em;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.03);
    overflow: hidden;
  }
  // 登陆页面控件的容器
  .page-login--content {
    height: 100%;
    min-height: 500px;
  }
  // header
  .page-login--content-header {
    padding: 1em 0;
    .page-login--content-header-motto {
      margin: 0px;
      padding: 0px;
      color: $color-text-normal;
      text-align: center;
      font-size: 12px;
    }
  }
  // main
  .page-login--logo {
    /*width: 240px;*/
    /*margin-bottom: 2em;*/
    margin-top: -2em;
  }
  // 登录表单
  .page-login--form {
    width: 280px;
    // 卡片
    .el-card {
      margin-bottom: 15px;
    }
    // 登录按钮
    .button-login {
      width: 100%;
    }
    // 输入框左边的图表区域缩窄
    .el-input-group__prepend {
      padding: 0px 14px;
    }
    .login-code {
      height: 40px - 2px;
      display: block;
      margin: 0px -20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
    .login-dui{
      position: relative;
      left: 132px;
      top: -163px;
      width: 24px;
    }
    // 登陆选项
    .page-login--options {
      margin: 0px;
      padding: 0px;
      font-size: 14px;
      color: $color-primary;
      margin-bottom: 15px;
      font-weight: bold;
    }
    .page-login--quick {
      width: 100%;
    }
  }
  // 快速选择用户面板
  .page-login--quick-user {
    @extend %flex-center-col;
    padding: 10px 0px;
    border-radius: 4px;
    &:hover {
      background-color: $color-bg;
      i {
        color: $color-text-normal;
      }
      span {
        color: $color-text-normal;
      }
    }
    i {
      font-size: 36px;
      color: $color-text-sub;
    }
    span {
      font-size: 12px;
      margin-top: 10px;
      color: $color-text-sub;
    }
  }
  // footer
  .page-login--content-footer {
    padding: 1em 0;
    .page-login--content-footer-locales {
      padding: 0px;
      margin: 0px;
      margin-bottom: 15px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
        margin: 0 .5em;
        &:hover {
          color: $color-text-main;
        }
      }
    }
    .page-login--content-footer-copyright {
      padding: 0px;
      margin: 0px;
      margin-bottom: 10px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      color: $color-text-normal;
      a {
        color: $color-text-normal;
      }
    }
    .page-login--content-footer-options {
      padding: 0px;
      margin: 0px;
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      a {
        color: $color-text-normal;
        margin: 0 1em;
      }
    }
  }
  // 背景
  .circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0px;
    padding: 0px;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #FFF;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0%{
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100%{
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
}
</style>
