<template>
  <base-dialog
    v-model="model"
    title="Составить акт о несоответствии"
  >
    <q-form
      class="q-gutter-y-sm"
      @submit="onSubmit"
    >
      <q-input
        v-model="item.car_driver"
        label="ФИО Водителя"
        :rules="[ ruleRequired]"
        outlined
        autofocus
      />
      <q-input
        v-model="item.car_model"
        label="Наименование транспортного средства"
        :rules="[ ruleRequired]"
        outlined
        autofocus
      />
      <q-input
        v-model="item.car_num"
        :rules="[ ruleRequired]"
        label="Номер машины"
        outlined
        autofocus
      />
      <q-input
        v-model="item.description"
        :rules="[ ruleRequired]"
        type="textarea"
        label="Описание"
        outlined
        autofocus
        autogrow
      />

      <div class="row justify-around q-mt-md">
        <q-btn
          type="submit"
          label="Составить акт"
          color="primary"
          icon="save"
          no-caps
          unelevated
          :loading="isLoading"
        />
      </div>
    </q-form>
  </base-dialog>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import BaseDialog from '../common/BaseDialog.vue'
import { useVModel } from '@vueuse/core';
import { useMainStore } from 'src/stores/main';
import { promiseSetLoading } from 'src/Modules/StoreCrud';
import { NonComplianceReportRequest } from 'src/client';
import { ruleRequired } from 'src/Modules/Globals';
import { notifySaved } from 'src/Modules/Notif';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  ticketId: {
    type: Number,
    required: true,
  }
})

const emit = defineEmits(["update:model-value", "reload"])
const model = useVModel(props)
const store = useMainStore()

const isLoading = ref(false)

const itemDefault = ref({
  name: "",
})

const item: Ref<NonComplianceReportRequest> = ref({})

function formReset(){
  item.value = Object.assign({}, itemDefault.value)
}

function onSubmit(){
  const payload = Object.assign({}, item.value, {
    ticket_id: props.ticketId
  })
  const prom = store.nonComplianceReportCreate(payload)

  void prom.then(() => {
    model.value = false;
    formReset();
    emit("reload")
    notifySaved("Акт успешно составлен")
  })

  promiseSetLoading(prom, isLoading)
}

onMounted(() => {formReset()})

</script>