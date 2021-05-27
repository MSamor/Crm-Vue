<template>
  <div class="home">
    <el-container style="height: 100vh; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <div class="logo">
          <el-image class="logo" :src="url" fit="fill"></el-image>
        </div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          :default-openeds="['1', '3', '2', '4', '5']"
        >
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-setting"></i>系统管理</template>
            <el-menu-item-group>
              <el-menu-item index="admin"><i class="el-icon-user"></i>员工管理</el-menu-item>
              <el-menu-item index="role"><i class="el-icon-s-custom"></i>角色管理</el-menu-item>
              <el-menu-item index="right"><i class="el-icon-star-off"></i>权限管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-s-custom"></i>客户管理</template>
            <el-menu-item-group>
              <el-menu-item index="client"><i class="el-icon-s-opportunity"></i>客户管理</el-menu-item>
              <el-menu-item index="history"><i class="el-icon-refresh-right"></i>跟进历史管理</el-menu-item>
              <el-menu-item index="operator"><i class="el-icon-document"></i>移交记录</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-pie-chart"></i>平台管理</template>
            <el-menu-item-group>
              <el-menu-item index="platform"><i class="el-icon-data-analysis"></i>平台管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown @command="handleCommand">
            <i
              class="el-icon-setting"
              style="margin-right: 15px; color: black"
            ></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ user.realName }}</span>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>

        <el-footer>Copyright Power by maosi</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: "Home",
  data() {
    return {
      url: require("../assets/maosilogo.jpg"),
      user: {},
    };
  },
  created() {
    let user = window.sessionStorage.getItem("user");
    this.user = JSON.parse(user);
  },
  methods: {
    handleCommand(command) {
      if (command == "logout") {
        window.sessionStorage.removeItem("token");
        this.$router.push("/login");
      }
    },
  },
  components: {},
};
</script>
<style>
.el-header {
  background-color: rgb(84, 92, 100);
  color: rgb(231, 231, 231);
  line-height: 60px;
}

.el-aside {
  background-color: rgb(84, 92, 100) !important;
  margin-right: 0;
}

.el-container {
  border: 0px !important;
  overflow: hidden;
}

.el-menu {
  /* overflow: hidden; */
  border: 0 !important;
}

.el-footer {
  background-color: rgb(84, 92, 100) !important;
  color: white;
  text-align: center;
  line-height: 50px;
}

.logo {
  height: 60px;
}
</style>
