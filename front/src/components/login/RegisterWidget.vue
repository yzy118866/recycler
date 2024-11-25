<template>
  <q-form
    id="registerForm"
    class="q-gutter-sm"
    @submit="onSubmit"
    @validation-error="isValid = false"
    @validation-success="isValid = true"
  >
    <q-input
      v-model="register.first_name"
      outlined
      label="Имя"
      :rules="[ruleRequired]"
      dense
    />
    <q-input
      v-model="register.last_name"
      outlined
      label="Фамилия"
      :rules="[ruleRequired]"
      dense
    />
    <q-input
      v-model="register.email"
      type="email"
      outlined
      label="Email"
      :rules="[ruleRequired, ruleValidEmail]"
      dense
    />
    <q-input
      v-model="register.password"
      :type="register.passwordShow ? 'text' : 'password'"
      outlined
      label="Пароль"
      lazy-rules
      dense
      autocomplete="new-password"
      :rules="[ruleRequired, rulePassword]"
    />
    <q-input
      v-model="register.password2"
      :type="register.passwordShow ? 'text' : 'password'"
      outlined
      label="Повторите пароль"
      lazy-rules
      dense
      autocomplete="new-password"
      :rules="[ruleRequired, (val) => (val === register.password) || 'Пароли должны совпадать']"
    />
  </q-form>

  <div class="row justify-around">
    <q-btn
      type="submit"
      color="primary"
      :loading="isLoading"
      label="Зарегистрироваться"
      size="md"
      form="registerForm"
      class="d-inline-block q-px-lg"
      no-caps
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import {ruleRequired, ruleValidEmail} from 'src/Modules/Globals'
import { useAuthStore } from 'src/stores/auth';
import { UserRegister } from 'src/client';
import { promiseSetLoading } from 'src/Modules/StoreCrud';
import { useRoute, useRouter } from 'vue-router';

const store = useAuthStore()
const $router = useRouter()
const $route = useRoute()

const isLoading = ref(false)
const isValid = ref(true)

const registerDefaults = {
  first_name: "",
  last_name: "",
  email: "",
  username: "",
  password: "",
  password2: "",
  passwordShow: false,
  

}
const register = ref(Object.assign({}, registerDefaults))

const rulePassword = (val: string) => val.length >= 8 || "Пароль должен содержать не менее 8 символов"

function onSubmit(){
  const payload =  Object.assign({}, register.value)
  payload.username = payload.email;

  const prom = store.register(payload)

  void prom.then(() => {
    const next = $route.params.next as string | null
    if (next){
      void $router.push(next)
    } else {
      void $router.push({name: "index"})
    }
  })

  promiseSetLoading(prom, isLoading)
}


</script>