<template>
  <div class="bigBox">
    <div class="logBox">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label-width="50px" label="账号" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label-width="50px" label="密码" prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            @keyup.enter.native="submitForm('ruleForm')"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="ruleForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item> -->
        <el-form-item label-width="70px">
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
      callback();
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        password: "",
        checkPass: "",
        username: "",
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        // checkPass: [{ validator: validatePass2, trigger: "blur" }],
        username: [{ validator: checkAge, trigger: "blur" }],
      },
    };
  },
  created() {
    const tokenStr = window.sessionStorage.getItem("token");
    if (tokenStr) {
      this.$router.push("/welcome");
    }
  },
  methods: {
    submitForm(formName) {
      console.log(this.$refs[formName].validate());
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //发送请求
          Vue.axios.post("/login", this.ruleForm).then((res) => {
            console.log(res);
            if (res.data.status == 200) {
              this.$message.success(res.data.msg);
              window.sessionStorage.setItem(
                "user",
                JSON.stringify(res.data.data.user)
              );
              window.sessionStorage.setItem("token", res.data.data.token);
              window.sessionStorage.setItem(
                "right",
                JSON.stringify(res.data.data.right)
              );
              this.$router.push("/welcome");
            } else {
              this.$message.error("登录失败");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style>
.bigBox {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url("../assets/maosibg.gif");
  background-size: 100% 100%;
}
.logBox {
  background-color: rgba(247, 247, 247, 0.9);
  width: 400px;
  height: 300px;
  display: flex;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 16%;
}
</style>