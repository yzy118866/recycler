<template>
  <!-- <q-card
    v-if="createBtn && canCreate"
    class="row q-mb-lg"
    flat
    bordered
  >
    <q-card-section>
      <q-btn
        label="Составить акт"
        color="positive"
        icon="add"
        size="sm"
        unelevated
        @click="onCreateNew"
      />
    </q-card-section>
  </q-card> -->

  <fast-table
    title="Акты о несоответствии"
    :columns="tableColumns"
    :data="data"
    :filters="filters"
    :load="loadData"
    wrap-cells
    v-bind="$attrs"
    @row-click="onRowClick"
  />
</template>

<script setup lang="ts">
import { QTableProps, useQuasar } from 'quasar';
import FastTable from '../form/FastTable.vue'
import { useMainStore } from 'src/stores/main';
import { ComputedRef, PropType, computed, ref, Ref } from 'vue';
import { NonComplianceReport, RoleEnum, Ticket, TicketStatusEnum } from 'src/client';
import { formatDateTime } from 'src/Modules/Utils';
import { useRouter } from 'vue-router';
import { TicketStatusNames } from 'src/Modules/Globals';
import { useAuthStore } from 'src/stores/auth';

const props = defineProps({
  filterCompany: {
    type: Number,
    default: null,
  },
  filterStatus: {
    type: String as PropType<TicketStatusEnum>,
    default: null,
  },
  createBtn: {
    type: Boolean,
    default: true,
  },
})

const $q = useQuasar()
const router = useRouter()
const store = useMainStore()
const storeAuth = useAuthStore()
const data: Ref<NonComplianceReport[] | null> = ref(null)

const filters = computed(() => {
  return {
    company: props.filterCompany,
    status: props.filterStatus,
  }
})


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
    name: 'ticket',
    field: (row: NonComplianceReport) => {return row.ticket.num},
    label: 'Талон',
    style: 'width: 20px'
  },
  {
    name: 'car_driver',
    field: 'car_driver',
    label: 'ФИО Водителя',
    style: 'width: 20px'
  },
  {
    name: 'car_model',
    field: 'car_model',
    label: 'Марка машины',
    style: 'width: 20px'
  },
  {
    name: 'car_num',
    field: 'car_num',
    label: 'Госномер машины',
    style: 'width: 20px'
  },

] as QTableProps["columns"]

const canCreate = computed(() => {
  return storeAuth.hasRole([RoleEnum.BUH_EXT, RoleEnum.OUTLEN])
})

function loadData(payload: object){
  const prom = store.nonComplianceReportsLoad(payload)
  void prom.then(resp => {
    data.value =resp.results
  })
  return prom
}



function onRowClick(e, data: NonComplianceReport){
  void router.push({name: 'report', params: {id: data.id}})
}

function onCreateNew(){
  void router.push({name: 'report', params: {id: "new"}})

}


</script>