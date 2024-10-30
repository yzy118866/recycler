<template>
  <!-- Override role dialog -->
  <override-role-dialog
    v-model="showOverrideRole"
  />

  <!-- User icon -->
  <q-item class="cursor-pointer">
    <q-item-section avatar>
      <q-icon
        name="account_circle"
        size="lg"
      />
    </q-item-section>
    <q-item-section>
      {{ userReadableStr }}
      <q-item-label
        class="text-white"
        caption
      >
        <small>
          {{ userRole || 'Роль не назначена' }}
          <template v-if="userRoleActual">
            ({{ userRoleActual }})
          </template>
        </small>
      </q-item-label>
    </q-item-section>

    <q-menu
      anchor="bottom middle"
      self="top middle"
      auto-close
    >
      <q-list dense>
        <q-item
          v-if="canOverrideRole"
          clickable
          @click="showOverrideRole = true"
        >
          <q-item-section>
            Сменить роль
          </q-item-section>
        </q-item>
        <q-item
          class="justify-center text-negative"
          clickable
          @click="askLogout"
        >
          <q-item-section>
            Выйти
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>
</template>

<script setup lang="ts">
import OverrideRoleDialog from '../admin/OverrideRoleDialog.vue'
import FormActions from '../form/FormActions.vue'
import BaseDialog from '../common/BaseDialog.vue'
import { storeToRefs } from "pinia"
import { useQuasar } from "quasar"
import { userRoleStr, userNameReadable } from "src/Modules/Utils"
import { RoleEnum } from "src/client"
import { TUserRole, useAuthStore } from "src/stores/auth"
import { computed, ref } from "vue"
import { useRouter } from "vue-router"

const store = useAuthStore()
const $q = useQuasar()
const $router = useRouter()

const {accountMaybeCached} = storeToRefs(store)

const showOverrideRole = ref(false)

const userReadableStr = computed(() => {
  return userNameReadable(accountMaybeCached.value)
})

const userRole = computed(() => {
  return userRoleStr(store.userRole)
})

const userRoleActual = computed(() => {
  if (store.roleOverride){
    return userRoleStr(store.userRoleActual)
  }
  return ''
})

const canOverrideRole = computed(() => {
  return store.hasRole(RoleEnum.ADMIN, true)
})

function askLogout() {
  $q.dialog({
    title: "Подтверждение",
    message: "Вы уверены что хотите выйти из аккаунта?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    logout()
    void $router.go(0)
  })
}

function logout() {
  void store.logout()
}

</script>