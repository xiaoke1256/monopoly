<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="title">🎲 大富翁注册</h1>
      <Form ref="formRef" :model="form" :rules="rules" :label-width="80" class="form">
        <FormItem label="用户名" prop="username">
          <Input v-model="form.username" placeholder="请输入用户名" clearable />
        </FormItem>
        <FormItem label="昵称" prop="nickname">
          <Input v-model="form.nickname" placeholder="请输入昵称（游戏内显示）" clearable />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="form.password" type="password" placeholder="请输入密码（至少6位）" show-password />
        </FormItem>
        <FormItem label="确认密码" prop="confirmPassword">
          <Input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="loading" @click="handleRegister" long>注册</Button>
        </FormItem>
      </Form>
      <div class="footer">
        已有账号？
        <router-link to="/login" class="link">去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { register } from '@/api/authApi';

export default {
  name: 'RegisterIndex',
  data() {
    const validateConfirm = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      form: {
        username: '',
        nickname: '',
        password: '',
        confirmPassword: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '用户名至少3位', trigger: 'blur' },
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateConfirm, trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    async handleRegister() {
      try {
        const valid = await this.$refs.formRef.validate();
        if (!valid) return;
        this.loading = true;
        const res = await register({
          username: this.form.username,
          nickname: this.form.nickname,
          password: this.form.password,
        });
        if (res.success) {
          // 注册成功后自动登录
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('userInfo', JSON.stringify(res.data.user));
          this.$Message.success('注册成功，欢迎加入！');
          this.$router.push('/game');
        } else {
          this.$Message.error(res.message || '注册失败');
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
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  width: 420px;
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
