<template>
  <q-page padding>
    <nav-top>
      <q-breadcrumbs-el
        label="Акты о несоответствии"
        :to="{name: 'reports'}"
      />
      <q-breadcrumbs-el :label="`Акт ${item?.id || ''}`" />
    </nav-top>

    <base-form
      v-if="item"
      @submit="saveData"
    >
      <template #info>
        <div>
          <key-value-info :data="infoData" />
        </div>
        <div class="row justify-around q-gutter-sm">
          <!-- <q-btn
            v-if="isExists && storeAuth.hasRole(RoleEnum.DISP) && item.approve_status == false && !item.report_sent"
            label="Составить акт о несоответствии"
            color="warning"
            icon="warning"
            unelevated
            no-caps
            :loading="loading"
            @click="showReport = true"
          /> -->
        </div>
      </template>

      <q-input
        v-model="item.car_driver"
        :readonly="readonly"
        hide-bottom-space
        label="ФИО Водителя"
        :rules="[ ruleRequired ]"
        outlined
        autofocus
      />
      <q-input
        v-model="item.car_model"
        :readonly="readonly"
        hide-bottom-space
        label="Наименование транспортного средства"
        :rules="[ ruleRequired ]"
        outlined
        autofocus
      />
      <q-input
        v-model="item.car_num"
        :rules="[ ruleRequired ]"
        label="Номер машины"
        :readonly="readonly"
        hide-bottom-space
        outlined
        autofocus
      />
      <q-input
        v-model="item.description"
        :rules="[ ruleRequired ]"
        :readonly="readonly"
        hide-bottom-space
        type="textarea"
        label="Описание"
        outlined
        autofocus
        autogrow
      />

      <template #actions>
        <form-actions
          class="q-mt-lg"
          :saving="saving"
          :deleting="deleting"
          :btn-delete="false"
          :btn-save="canEdit"
          :is-exists="isExists"
        />
      </template>
    </base-form>

    <q-card
      v-if="item && isExists"
      class="q-mt-md"
      flat
      bordered
    >
      <q-card-section>
        <div class="text-h6">
          Предпросмотр печати
          <q-btn
            :href="printUrl"
            target="_blank"
            class="q-ml-md"
            label="Печать"
            color="primary"
            icon="print"
            size="sm"
            unelevated
            no-caps
          />
        </div>
      </q-card-section>
      <q-card-section>
        <report-print :report="item" />
      </q-card-section>
    </q-card>

    <q-inner-loading :showing="loading" />
  </q-page>
</template>

<script setup lang="ts">
import NavTop from '../../components/common/NavTop.vue'
import ReportPrint from '../../components/buh/ReportPrint.vue'
import KeyValueInfo from "../../components/form/KeyValueInfo.vue"
import BaseForm from "../../components/form/BaseForm.vue"
import BackBtn from "src/components/form/BackBtn.vue"
import FormActions from "src/components/form/FormActions.vue"
import { storeToRefs } from "pinia"
import { promiseSetLoading } from "src/Modules/StoreCrud"
import { promiseFunc, notifySaved } from "src/Modules/Notif"
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { formatDateTime } from "src/Modules/Utils"
import { ruleRequired } from "src/Modules/Globals"
import { useMainStore } from 'src/stores/main'
import {NonComplianceReportRequest, RoleEnum} from 'src/client'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const store = useMainStore()
const storeAuth = useAuthStore()
const { report: item } = storeToRefs(store)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)

const itemId = computed(() => route.params.id as unknown as string)

const isExists = computed(() => Boolean(item.value?.id))


const infoData = computed(() => {
  if (!item.value) {
    return []
  }
  return [
    {
      label: "Дата создания",
      value: formatDateTime(item.value?.created_at),
    },
    {
      label: "Автор",
      value: item.value.author?.name,
    },
  ]
})

const defaultData = {
  id: null,
}

const readonly = computed(() => {
  return !canEdit.value
})

const canEdit = computed(() => {
  return storeAuth.hasRole([RoleEnum.DISP, RoleEnum.BUH_EXT, RoleEnum.BUH_INN])
})

const printUrl = computed(() => {
  return router.resolve({name: 'report_print', params: {id: itemId.value}}).href
})

function loadData() {
  if (itemId.value == "new") {
    item.value = Object.assign({}, defaultData)
    return
  }
  const prom = store.nonComplianceReportLoad(parseInt(itemId.value))
  promiseSetLoading(prom, loading)
}

function saveData() {

  const exists = isExists.value
  const payload: NonComplianceReportRequest = Object.assign({}, item.value, {})

  const prom = exists && item.value ? store.nonComplianceReportsUpdate(item.value.id, payload) : store.nonComplianceReportCreate(payload)

  promiseSetLoading(prom, saving)
  void prom.then((resp) => {
    if (!exists) {
      void router.replace({
        params: {
          id: resp.id,
        },
      })
    }

    promiseFunc(prom, notifySaved)
  })
}


onMounted(() => loadData())
</script>
