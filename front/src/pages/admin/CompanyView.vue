<template>
  <q-page padding>
    <nav-top>
      <q-breadcrumbs-el
        label="Заказчики"
        :to="{name: 'companies'}"
      />
      <q-breadcrumbs-el :label="`Заказчик ${item?.name || ''}`" />
    </nav-top>

    <q-tabs
      v-model="tab"
      class="bg-primary text-white shadow-2"
      align="justify"
      inline-label
      no-caps
    >
      <q-tab
        name="contracts"
        label="Документы"
      />
      <q-tab
        name="company"
        label="Заказчик"
      />
      <q-tab
        name="fkko"
        label="Коды ФККО"
      />
      <q-tab
        name="stats"
        label="Статистика"
      />
      <!-- <q-tab
        name="reports"
        label="Отчеты"
        disable
      /> -->
    </q-tabs>

    <q-tab-panels
      v-if="item"
      v-model="tab"
      animated
    >
      <q-tab-panel name="contracts">
        <contracts-view
          v-if="item"
          :company="item"
          @reload="loadData()"
        />
      </q-tab-panel>
      <q-tab-panel name="company">
        <base-form
          v-if="item"
          @submit="saveData"
        >
          <template #info>
            <div>
              <key-value-info :data="infoData" />
            </div>
          </template>

          <q-input
            v-model="item.name"
            label="Название компании"
            :rules="[ruleRequired]"
            hide-bottom-space
            outlined
            dense
          />

          <q-input
            v-model="item.customer"
            label="ИНН"
            hide-bottom-space
            outlined
            dense
          />

          <landfill-select
            v-model="item.landfill"
            hide-bottom-space
            dense
          />

          <q-input
            v-model="item.kpts"
            label="КПТС"
            hide-bottom-space
            outlined
            dense
          />

          <q-input
            v-model="item.contract_num"
            label="Номер договора"
            hide-bottom-space
            outlined
            dense
          />

          <q-input
            v-model="item.sum_actual"
            :readonly="summReadonly"
            type="number"
            label="Сумма фактическая (руб)"
            hide-bottom-space
            outlined
            dense
          />

          <q-input
            v-model="item.sum_overall"
            :readonly="summReadonly"
            type="number"
            label="Сумма договора (руб)"
            hide-bottom-space
            outlined
            dense
          />

          <!-- <template v-if="item.ticket_template">
            <div class="text-subtitle1">
              Шаблон заполнения талона
            </div>

            <q-input
              v-model="item.ticket_template.mass_full"
              type="number"
              label="Масса полная"
              hide-bottom-space
              outlined
              dense
            />

            <q-input
              v-model="item.ticket_template.car_num"
              label="Номер машины"
              hide-bottom-space
              outlined
              dense
            />
          </template> -->

          <template #actions>
            <form-actions
              class="q-mt-lg"
              :saving="saving"
              :deleting="deleting"
              :btn-delete="true"
              @delete="onDelete"
            />
          </template>
        </base-form>
      </q-tab-panel>

      <q-tab-panel name="fkko">
        <div style="max-width: 100%">
          <div class="text-h6 q-mb-md">
            Коды ФККО ({{ item.fkko?.length || 0 }})
          </div>
          <company-fkko v-model="item">
            <form-actions
              class="q-mt-lg"
              :saving="saving"
              :deleting="deleting"
              :btn-delete="true"
              @delete="onDelete"
              @save="saveData"
            />
          </company-fkko>
        </div>
      </q-tab-panel>
      <q-tab-panel name="stats">
        <div>
          <!-- История баланса -->
          <div class="q-table__title q-mb-sm">
            История баланса
          </div>
          <company-balance-history :company="item.id" />

          <!-- Добавляем отступ -->
          <div class="q-mt-lg"></div>

          <!-- Таблица Талоны -->
          <tickets-table :filter-company="item?.id" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import CompanyBalanceHistory from './CompanyBalanceHistory.vue'
import LandfillSelect from '../../components/select/LandfillSelect.vue'
import NavTop from '../../components/common/NavTop.vue'
import CompanyFkko from '../../components/buh/CompanyFkko.vue'
import TicketsTable from '../../components/table/TicketsTable.vue'
import ContractsView from '../../components/buh/ContractsView.vue'
import FormActions from '../../components/form/FormActions.vue'
import KeyValueInfo from '../../components/form/KeyValueInfo.vue'
import BaseForm from '../../components/form/BaseForm.vue'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMainStore } from 'src/stores/main'
import { promiseSetLoading } from 'src/Modules/StoreCrud'
import { notifyDeleted, notifySaved, promiseFunc } from 'src/Modules/Notif'
import { ruleRequired } from 'src/Modules/Globals'
import { RoleEnum } from 'src/client'
import { useRouteQuery } from '@vueuse/router'



const route = useRoute()
const router = useRouter()

const store = useMainStore()
const storeAuth = useAuthStore()
const { company: item } = storeToRefs(store)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const tab = useRouteQuery("tab", "company")


const summReadonly = computed(() => !storeAuth.hasRole(RoleEnum.BUH_INN))

const itemId = computed(() => route.params.id as unknown as string)

// const isExists = computed(() => Boolean(item.value?.id))


const infoData = computed(() => {
  if (!item.value) {
    return []
  }
  return [
      {
        label: "Автор",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value: item.value.author?.name,
      },
  ]
})

const defaultData = {
  name: "",
}

function loadData() {
  if (itemId.value == "new") {
    item.value = Object.assign({}, defaultData)
    return
  }
  const prom = store.companyLoad(parseInt(itemId.value))
  promiseSetLoading(prom, loading)
}


function saveData() {
  const payload = Object.assign({}, item.value, {
    landfill_id: item.value?.landfill?.id,
  })
  if (!payload.ticket_template){
    delete payload.ticket_template
  }


  const prom = store.companyUpdate(payload.id, payload)

  promiseSetLoading(prom, saving)
  void prom.then((resp) => {

    promiseFunc(prom, notifySaved)
  })
}


function onDelete() {
  if (!item.value){
    return
  }
  const prom = store.companyDelete(item.value.id)

  promiseSetLoading(prom, deleting)
  void prom.then(() => {
    notifyDeleted()
    router.go(-1)
  })
}


onMounted(() => loadData())

</script>