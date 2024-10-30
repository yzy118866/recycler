<template>
  <dialog-create-non-compliance-report
    v-if="item"
    v-model="showReport"
    :ticket-id="item.id"
    @reload="loadData"
  />

  <q-page padding>
    <nav-top>
      <q-breadcrumbs-el
        label="Тикеты"
        :to="{name: 'tickets_all'}"
      />
      <q-breadcrumbs-el :label="`Тикет #${item?.id || ''}`" />
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
          <template v-if="isExists && storeAuth.hasRole([RoleEnum.DISP, RoleEnum.OTV])">
            <q-btn
              v-if="item.status == TicketStatusEnum.CR && item.approve_status === null"
              icon="pending"
              label="Отправить в работу"
              color="secondary"
              unelevated
              no-caps
              :loading="loading"
              @click="askUpdateTicketStatus(TicketStatusEnum.PR)"
            />
            <q-btn
              v-if="item.status == TicketStatusEnum.PR"
              icon="archive"
              label="Отправить в архив"
              color="secondary"
              unelevated
              no-caps
              :loading="loading"
              @click="askUpdateTicketStatus(TicketStatusEnum.AR)"
            />
          </template>
          <template v-if="isExists && storeAuth.hasRole(RoleEnum.OTV) && item.approve_status == null">
            <q-btn
              label="Одобрить"
              color="positive"
              icon="done"
              unelevated
              no-caps
              :loading="loading"
              @click="askUpdateApprovalStatus(true)"
            />
            <q-btn
              label="Отклонить"
              color="negative"
              icon="block"
              unelevated
              no-caps
              :loading="loading"
              :disable="!item.waste_image"
              @click="askUpdateApprovalStatus(false)"
            >
              <q-tooltip v-if="!item.waste_image">
                Сначала приложите фото несоответствующего отхода
              </q-tooltip>
            </q-btn>
          </template>
          <template v-if="isExists && storeAuth.hasRole(RoleEnum.DISP) && item.approve_status == true && item.status != TicketStatusEnum.AR">
            <q-btn
              label="Закрыть талон"
              color="positive"
              icon="done"
              unelevated
              no-caps
              :loading="loading"
              @click="askUpdateTicketStatus(TicketStatusEnum.AR)"
            />
          </template>


          <q-btn
            v-if="isExists && storeAuth.hasRole(RoleEnum.DISP) && item.approve_status == false && !item.report_sent"
            label="Составить акт о несоответствии"
            color="warning"
            icon="warning"
            unelevated
            no-caps
            :loading="loading"
            @click="showReport = true"
          />
          <q-btn
            v-else-if="storeAuth.hasRole(RoleEnum.DISP) && item.report_sent"
            :to="{name: 'report', params: {id: item.report_sent}}"
            label="Открыть акт о несоответствии"
            color="primary"
            icon="open_in_new"
            target="_blank"
            unelevated
            no-caps
          />
        </div>
      </template>

      <q-input
        v-model="item.num"
        :readonly="readonly"
        hide-bottom-space
        autocomplete="off"
        label="Номер талона"
        outlined
      />

      <q-input
        v-model="item.car_model"
        :readonly="readonly"
        hide-bottom-space
        autocomplete="off"
        label="Марка машины"
        outlined
      />

      <q-input
        v-model="item.car_num"
        :readonly="readonly"
        hide-bottom-space
        autocomplete="off"
        label="Госномер машины"
        outlined
      />
      <q-input
        v-model="item.mass_full"
        :readonly="readonly"
        type="number"
        hide-bottom-space
        autocomplete="off"
        label="Масса полная"
        outlined
      />
      <q-input
        v-model="item.mass_empty"
        :readonly="readonly"
        type="number"
        hide-bottom-space
        autocomplete="off"
        label="Масса пустая"
        outlined
      />
      <q-input
        v-model="item.ticket_volume"
        :readonly="readonly"
        type="number"
        hide-bottom-space
        autocomplete="off"
        label="Объём талона"
        outlined
      />
      <q-input
        v-model="item.actual_volume"
        :readonly="readonly"
        type="number"
        hide-bottom-space
        autocomplete="off"
        label="Фактический объём"
        outlined
      />

      <company-select
        v-model="item.company"
        hide-bottom-space
        :rules="[ruleRequired]"
        :readonly="readonly"
      />

      <div>
        <fkko-select
          v-if="item"
          v-model="item.fkko"
          hide-bottom-space
          :rules="[ruleRequired]"
          :company="item?.company"
          :readonly="readonly || !item.company"
        />
        <q-tooltip v-if="!item.company">
          Сначала выберите компанию
        </q-tooltip>
      </div>

      <landfill-select
        v-model="item.landfill"
        hide-bottom-space
        :rules="[ruleRequired]"
        :readonly="readonly"
      />


      <q-file
        v-model="item.waste_image"
        :readonly="readonly || !storeAuth.hasRole([RoleEnum.DISP, RoleEnum.OTV])"
        :max-files="1"
        :max-file-size="1024**3*10"
        accept="image/*"
        hide-bottom-space
        autocomplete="off"
        label="Фото несоответствующего отхода"
        outlined
        @update:model-value="uploadWasteImage"
      >
        <template #prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
      <template v-if="item.waste_image">
        <image-preview
          :src="item.waste_image"
          width="100%"
          fit="contain"
          style="height: 200px"
        />
      </template>

      <template #actions>
        <form-actions
          class="q-mt-lg"
          :saving="saving"
          :deleting="deleting"
          :btn-delete="false"
          :btn-save="canEdit"
          :is-exists="isExists"
          @delete="onDelete"
        />
      </template>
    </base-form>

    <q-inner-loading :showing="loading" />
  </q-page>
</template>

<script setup lang="ts">
import LandfillSelect from '../../components/select/LandfillSelect.vue'
import ImagePreview from '../../components/form/ImagePreview.vue'
import NavTop from '../../components/common/NavTop.vue'
import FkkoSelect from '../../components/select/FKKOSelect.vue'
import CompanySelect from '../../components/select/CompanySelect.vue'
import KeyValueInfo from "../../components/form/KeyValueInfo.vue"
import BaseForm from "../../components/form/BaseForm.vue"
import FormActions from "src/components/form/FormActions.vue"
import { storeToRefs } from "pinia"
import { promiseSetLoading } from "src/Modules/StoreCrud"
import { promiseFunc, notifySaved } from "src/Modules/Notif"
import { computed, onMounted, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { formatDateTime } from "src/Modules/Utils"
import { TicketStatusNames, ruleRequired } from "src/Modules/Globals"
import { useMainStore } from 'src/stores/main'
import {RoleEnum, TicketRequest, TicketStatusEnum} from 'src/client'
import { useAuthStore } from 'src/stores/auth'
import { useQuasar } from 'quasar'
import DialogCreateNonComplianceReport from 'src/components/buh/DialogCreateNonComplianceReport.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const store = useMainStore()
const storeAuth = useAuthStore()
const { ticket: item } = storeToRefs(store)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showReport = ref(false)

const itemId = computed(() => route.params.id as unknown as string)

const isExists = computed(() => Boolean(item.value?.id))


const infoData = computed(() => {
  if (!item.value) {
    return []
  }
  const approveStatus: Map<true | false | null, string> = new Map([[false, "Отклонен"], [true, "Одобрен"], [null, "-"]])
  return [
    {
      label: "Дата создания",
      value: formatDateTime(item.value?.created_at),
    },
    {
      label: "Автор",
      value: item.value?.author?.name,
    },
    {
      label: "Статус",
      value: TicketStatusNames.get(item.value?.status),
    },
    {
      label: "Статус подтверждения",
      value: approveStatus.get(item.value?.approve_status),
    },
    {
      label: "Акт о несоответствии отправлен",
      value: (item.value?.report_sent )? "Да": "Нет",
    },
  ]
})

const defaultData = {
  id: null,
  company: null,
  num: "",
  name: "",
  // status: TicketStatusEnum.CR,
  fkko: [],
}

const readonly = computed(() => {
  return !canEdit.value
})

const canEdit = computed(() => {
  if (item.value?.approve_status == false){
    return storeAuth.hasRole([RoleEnum.DISP])
  }
  return storeAuth.hasRole([RoleEnum.OUTLEN, RoleEnum.BUH_EXT])
})

function loadData() {
  if (itemId.value == "new") {
    item.value = Object.assign({}, defaultData)
    return
  }
  const prom = store.ticketLoad(parseInt(itemId.value))
  promiseSetLoading(prom, loading)
}

function saveData() {
  if (!item.value?.company){
    return
  }

  const exists = isExists.value
  const payload: TicketRequest = Object.assign({}, item.value, {
    company_id: item.value?.company?.id,
    fkko_id: item.value?.fkko?.id,
    landfill_id: item.value?.landfill?.id,
  })

  const prom = exists ? store.ticketUpdate(item.value.id, payload) : store.ticketCreate(payload)

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

function askUpdateTicketStatus(status: TicketStatusEnum){
  void $q.dialog({
      message: "Вы уверены что хотите обновить статус талона?",
      cancel: true,
    }).onOk(() => {
      updateTicketStatus(status)
    })
}
function updateTicketStatus(status: TicketStatusEnum){
  if (!item.value?.id){
    return
  }
  const payload: TicketRequest = Object.assign({}, item.value, {
    status: status,
    company_id: item.value?.company.id,
    fkko_id: item.value?.fkko.id,
    landfill_id: item.value?.landfill?.id,
  })
  const prom = store.ticketUpdate(item.value.id, payload)
  void prom.then((resp) => {
    promiseFunc(prom, notifySaved)
  })
  promiseSetLoading(prom, saving)
}

function askUpdateApprovalStatus(status: boolean){
  void $q.dialog({
      message: status ? "Вы уверены что хотите одобрить талон?" : "Вы уверены что хотите отклонить талон?",
      cancel: true,
    }).onOk(() => {
      updateApprovalStatus(status)
    })
}
function updateApprovalStatus(status: boolean){
  if (!item.value?.id){
    return
  }
  const payload: TicketRequest = Object.assign({}, item.value, {
    approve_status: status,
    company_id: item.value?.company.id,
    fkko_id: item.value?.fkko.id,
    landfill_id: item.value?.landfill?.id,
  })
  const prom = store.ticketUpdate(item.value.id, payload)
  void prom.then((resp) => {
    promiseFunc(prom, notifySaved)
  })
  promiseSetLoading(prom, saving)
}

function uploadWasteImage(image: Blob){
  if (!item.value?.id){
    return
  }
  const prom = store.uploadWasteImage(item.value.id, {file: image})
  promiseSetLoading(prom, saving)

  void prom.then(() => notifySaved("Изображение успешно прикреплено"))
}

function onDelete() {
//   const prom = store.deleteUser(item.value.id)

//   promiseSetLoading(prom, deleting)
//   void prom.then(() => {
//     notifyDeleted()
//     router.go(-1)
//   })
}

// watch(() => item.value?.company, () => {
//   if (!item.value?.landfill){
//     item.value?.landfill = item.value?.company.landfill
//   }
// })

onMounted(() => loadData())
</script>
