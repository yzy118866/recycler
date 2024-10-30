<template>
  <base-dialog
    v-model="model"
    title="Добавить компанию"
  >
    <q-form @submit="onSubmit">
      <q-input
        v-model="company.name"
        label="Название компании"
        outlined
        autofocus
      />

      <div class="row justify-around q-mt-md">
        <q-btn
          type="submit"
          label="Добавить компанию"
          color="primary"
          no-caps
          :loading="isLoading"
        />
      </div>
    </q-form>
  </base-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BaseDialog from '../common/BaseDialog.vue'
import { useVModel } from '@vueuse/core';
import { useMainStore } from 'src/stores/main';
import { promiseSetLoading } from 'src/Modules/StoreCrud';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  }
})

const emit = defineEmits(["update:model-value", "reload"])
const model = useVModel(props)
const store = useMainStore()

const isLoading = ref(false)

const companyDefault = ref({
  name: "",
})

const company = ref({})

function formReset(){
  company.value = Object.assign({}, companyDefault.value)
}

function onSubmit(){
  const payload = Object.assign({}, company.value)
  const prom = store.companyCreate(payload)

  void prom.then(() => {
    model.value = false;
    formReset();
    emit("reload")
  })

  promiseSetLoading(prom, isLoading)
}

onMounted(() => {formReset()})

</script>