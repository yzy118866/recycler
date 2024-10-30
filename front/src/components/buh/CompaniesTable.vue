<template>
  <dialog-company-create
    v-model="showCompanyCreate"
    @reload="reloadData()"
  />
  <q-card
    v-if="storeAuth.hasRole(RoleEnum.BUH_INN)"
    class="row q-mb-lg"
    flat
    bordered
  >
    <q-card-section>
      <q-btn
        label="Добавить компанию"
        color="positive"
        icon="add"
        size="sm"
        unelevated
        @click="onCreateNew"
      />
    </q-card-section>
  </q-card>

  <fast-table
    ref="table"
    title="Компании"
    :columns="tableColumns"
    :data="data"
    :load="loadData"
    @row-click="onRowClick"
  />
</template>

<script setup lang="ts">
import DialogCompanyCreate from './DialogCompanyCreate.vue'
import { Ref, computed, ref } from 'vue';
import FastTable from '../form/FastTable.vue'
import {useMainStore} from 'src/stores/main'
import { Company, RoleEnum } from 'src/client';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth';

const router = useRouter()
const store = useMainStore()

const storeAuth = useAuthStore()

const data = computed(() => store.companies)
const showCompanyCreate = ref(false)

const table: Ref<InstanceType<typeof FastTable> | undefined> = ref()

const tableColumns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    required: true,
    sortable: true,
    style: 'width: 20px'
  },
  {
    name: 'name',
    label: 'Название',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'contract_num',
    label: 'Номер договора',
    field: 'contract_num',
    align: 'left',
    sortable: true,
  },
]


function loadData(payload: object){
  const prom = store.loadCompanies(payload)
  return prom
}

function reloadData(){
  console.debug("Reloading data", table.value)
  if (table.value){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    table.value.loadData()
  }
}

function onRowClick(e, data: Company){
  void router.push({
    name: 'company', params: {id: data.id}
  })
}


function onCreateNew(){
  showCompanyCreate.value = true
}


</script>