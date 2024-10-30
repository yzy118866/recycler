<template>
  <div class="window-width window-height row justify-center items-center">
    <q-card
      class="login-card col-xs-12 col-sm-6 col-md-4 q-pa-md"
      flat
      bordered
    >
      <q-card-section class="q-pt-none q-px-none">
        <q-tabs
          v-model="tab"
          class="q-pa-none"
          align="justify"
          no-caps
        >
          <q-tab
            name="login"
            label="Авторизация"
          />
          <q-tab
            name="register"
            label="Регистрация"
          />
        </q-tabs>
      </q-card-section>
      <q-card-section class="q-pt-none q-px-none">
        <q-tab-panels
          v-model="tab"
          animated
        >
          <q-tab-panel name="login">
            <h4 class="text-center no-margin">
              Авторизация
            </h4>

            <div class="q-pt-md">
              <auth-widget />
            </div>
          </q-tab-panel>
          <q-tab-panel name="register">
            <h4 class="text-center no-margin">
              Регистрация
            </h4>

            <div class="q-pt-md">
              <register-widget />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import RegisterWidget from '../components/login/RegisterWidget.vue'
import AuthWidget from '../components/login/AuthWidget.vue'
import { Ref, ref } from 'vue';


type TabName = "login" | "register"

const tab: Ref<TabName>= ref("login")

</script>

<style lang="scss" scoped>
.login-card {
  max-width: 350px;
}
</style>
