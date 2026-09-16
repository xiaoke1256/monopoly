<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">🎲 大富翁登录</h1>
      <Form ref="formRef" :model="form" :rules="rules" :label-width="80" class="form">
        <FormItem label="用户名" prop="username">
          <Input v-model="form.username" placeholder="请输入用户名" clearable />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="loading" @click="handleLogin" long>登录</Button>
        </FormItem>
      </Form>
      <div class="footer">
        还没有账号？
        <router-link to="/register" class="link">去注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/authApi';

export default {
  name: 'LoginIndex',
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async handleLogin() {
      try {
        const valid = await this.$refs.formRef.validate();
        if (!valid) return;
        this.loading = true;
        const res = await login(this.form);
        if (res.success) {
          // 保存 sessionId 和用户信息
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('sessionId', res.data.sessionId);
          localStorage.setItem('userInfo', JSON.stringify(res.data.user));
          this.$Message.success('登录成功');
          //跳转向游戏选择页面
          this.$router.push('/gameManage');
        } else {
          this.$Message.error(res.message || '登录失败');
        }
      } catch (err) {
        if (err && err.message) {
          this.$Message.error(err.message);
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.title {
  text-align: center;
  margin-bottom: 32px;
  color: #333;
  font-size: 24px;
}

.form {
  margin-top: 20px;
}

.footer {
  text-align: center;
  margin-top: 24px;
  color: #999;
  font-size: 14px;

  .link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
