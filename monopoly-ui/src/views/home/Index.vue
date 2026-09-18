<template>
  <div class="home">
    <div v-if="isLoggedIn" class="user-info">
      <span>欢迎回来，<strong>{{ userInfo?.nickname }}</strong>！</span>
      <button @click="handleLogout" class="logout-btn">退出登录</button>
    </div>
    <div class="hero">
      <h1>Welcome to Monopoly Game!</h1>
      <p>This is the home page of the Monopoly Game. Please click the button below to start playing.</p>
    </div>
    <div class="actions">
      <button v-if="isLoggedIn" @click="$router.push('/gameManage')">开始游戏</button>
      <button v-if="!isLoggedIn" @click="$router.push('/login')">去登录</button>
      <button v-if="!isLoggedIn" @click="$router.push('/register')">去注册</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeIndex',
  data() {
    return {
      userInfo: null,
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.userInfo;
    },
  },
  created() {
    const info = localStorage.getItem('userInfo');
    if (info) {
      try {
        this.userInfo = JSON.parse(info);
      } catch (e) {
        this.userInfo = null;
      }
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('token');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('userInfo');
      this.userInfo = null;
      this.$Message.success('已退出登录');
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  padding: 40px;
  text-align: center;
  min-height: 100vh;
}

.user-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 24px;

  .logout-btn {
    padding: 6px 16px;
    background: #ff4d4f;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #ff7875;
    }
  }
}

.hero {
  margin-bottom: 32px;

  h1 {
    font-size: 32px;
    margin-bottom: 12px;
  }
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;

  button {
    padding: 12px 24px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: #667eea;
    color: #fff;
    transition: background 0.2s;

    &:hover {
      background: #764ba2;
    }
  }
}
</style>
