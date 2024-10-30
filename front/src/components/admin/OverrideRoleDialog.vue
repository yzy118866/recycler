<template>
  <base-dialog
    v-model="model"
    title="Временно сменить роль"
  >
    <q-banner class="bg-info text-white q-py-sm q-mb-md">
      <template #avatar>
        <q-icon
          name="help"
          color="white"
        />
      </template>
      С помощью этой формы вы можете временно сменить роль аккаунта и протестировать другую роль.
      <br />
      Привелегия администратора будут сохранены и вы в любой момент сможете вернуться в интерфейс админисратора
    </q-banner>

    <q-form>

      <user-role-select v-model="roleSelect" :exclude="[RoleEnum.ADMIN]" clearable />

      <div class="row justify-around q-mt-md">
        <q-btn
      type="submit"
      label="Сохранить"
      color="positive"
      icon="save"
      unelevated
      no-caps
      @click="roleSave()"
    />
        <q-btn
      type="submit"
      label="Сбросить"
      color="negative"
      icon="refresh"
      unelevated
      no-caps
      @click="roleReset()"
    />
      </div>
    </q-form>
  </base-dialog>
</template>

<script setup lang="ts">
import UserRoleSelect from '../select/UserRoleSelect.vue'
import FormActions from '../form/FormActions.vue'
import BaseDialog from '../common/BaseDialog.vue'
import { useVModel } from '@vueuse/core';
import { TUserRole, useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';
import { Ref, ref, watch } from 'vue';
import { RoleEnum } from 'src/client';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  }
})

const store = useAuthStore()

// const {roleOverride} = storeToRefs(store)
const roleSelect: Ref<TUserRole | null> = ref(null)


const model = useVModel(props)

function roleSave(){
  store.roleOverride = roleSelect.value
  model.value = false;
  console.debug("Save role override: ", store.roleOverride)
}

function roleReset(){
  store.roleOverride = null;
  model.value = false;
}

watch(() => props.modelValue, () => {
  roleSelect.value = store.roleOverride
})

</script>