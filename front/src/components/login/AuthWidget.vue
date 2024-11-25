<template>
  <q-form
    id="loginForm"
    class="q-gutter-sm"
    @submit="onSubmit"
  >
    <q-input
      v-model="login.username"
      outlined
      label="Имя пользователя"
      :rules="[(val) => (val !== null && val !== '') || 'Введите имя пользователя']"
    />
    <q-input
      v-model="login.password"
      :type="login.passwordShow ? 'text' : 'password'"
      outlined
      label="Пароль"
      lazy-rules
      :rules="[(val) => (val !== null && val !== '') || 'Введите пароль']"
    />
  </q-form>

  <div class="row justify-around">
    <q-btn
      type="submit"
      color="primary"
      :loading="loading"
      label="Войти"
      size="md"
      form="loginForm"
      class="d-inline-block q-px-lg"
      no-caps
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from 'src/stores/auth.js';
import { AuthToken } from 'src/client';

export default defineComponent({
  data() {
    const store = useAuthStore();
    return {
      store: store,
      loading: false,
      login: {
        username: '',
        password: '',
        passwordShow: false,
      },
    };
  },
  computed: {
    loginStatus(): boolean {
      return this.store.isAuthenticated;
    },
  },
  methods: {
    async onSubmit() {
      const payload = {
        username: this.login.username,
        password: this.login.password,
      } as AuthToken;

      this.loading = true;

      try {
        await this.store.login(payload);
        await this.store.loadAccountInfo();

        // console.log("Текущая роль пользователя:", this.store.userRole);

        if (!this.store.userRole) {
          this.$q.notify({
            type: 'negative',
            message: 'Администратор ещё не дал вам роль',
            icon: 'warning',
          });
          await this.store.logout();
          return;
        }

       await this.$router.push({ name: 'index' });
      } catch (err) {
        console.warn(err);
        this.$q.notify({
          type: 'negative',
          message: 'Неверное имя пользователя или пароль',
          progress: true,
        });
      } finally {
        this.loading = false;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.login-card {
  max-width: 350px;
}
</style>
