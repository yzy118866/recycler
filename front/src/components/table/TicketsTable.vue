<template>
  <q-card
    v-if="createBtn && canCreate"
    class="row q-mb-lg"
    flat
    bordered
  >
    <q-card-section>
      <q-btn
        label="Создать талон"
        color="positive"
        icon="add"
        size="sm"
        unelevated
        @click="onCreateNew"
      />
    </q-card-section>
  </q-card>

  <div class="scroll-container">
    <fast-table
      title="Талоны"
      :columns="tableColumns"
      :data="data"
      :filters="filters"
      :load="loadData"
      v-bind="$attrs"
      @row-click="onRowClick"
      style="display: block;"
    >
      <template #body-cell-approve_status="props">
        <q-td :props="props">
          <template v-if="props.value == true">
            <q-icon
              name="done"
              color="positive"
              size="md"
            />
          </template>
          <template v-else-if="props.value == false">
            <q-icon
              name="block"
              color="negative"
              size="md"
            />
          </template>
          <template v-else>
            <q-icon
              name="remove"
              color="orange"
              size="md"
            />
          </template>
        </q-td>
      </template>
    </fast-table>
  </div>
</template>

<script setup lang="ts">
import { QTableProps, useQuasar } from 'quasar';
import FastTable from '../form/FastTable.vue'
import { useMainStore } from 'src/stores/main';
import { ComputedRef, PropType, computed, ref, Ref } from 'vue';
import { RoleEnum, Ticket, TicketStatusEnum } from 'src/client';
import { formatDateTime } from 'src/Modules/Utils';
import { useRouter } from 'vue-router';
import { TicketStatusNames } from 'src/Modules/Globals';
import { useAuthStore } from 'src/stores/auth';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
const props = defineProps({
  filterCompany: {
    type: Number,
    default: null,
  },
  filterStatus: {
    type: String as PropType<TicketStatusEnum>,
    default: null,
  },
  filterAuthorCurrent: {
    type: Boolean,
    default: false,
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
const data: Ref<Ticket[] | null> = ref(null)
const { company: item } = storeToRefs(store)
const filters = computed(() => {
  return {
    company: props.filterCompany,
    status: props.filterStatus,
    author: props.filterAuthorCurrent ? storeAuth?.account?.id : null,
  }
})


const tableColumnsMobile = [
// {
//     name: 'id',
//     label: 'ID',
//     field: 'id',
//     required: true,
//     sortable: true,
//     style: 'width: 20px'
//   },
{
    name: 'num',
    label: 'Номер',
    field: 'num',
    required: true,
    sortable: true,
    style: 'width: 20px'
  },
  {
    name: 'company',
    field(row: Ticket){
      return row.company.name
    },
    label: 'Заказчик',
    style: 'width: 20px'
  },
  {
    name: 'status',
    label: 'Статус',
    field(row: Ticket){
      return TicketStatusNames.get(row.status)
    },
    style: 'width: 20px'
  },
  {
    name: 'approve_status',
    field: 'approve_status',
    label: 'Подтверждение',
    style: 'width: 20px',
    align: 'left',
  },
  {
    name: 'date',
    label: 'Дата',
    field(row: Ticket) {
        return formatDateTime(row.created_at)
    },
    style: 'width: 20px'
  },
  {
    name: 'short_name',
    field: 'short_name',
    label: 'Отход (кратко)',
    style: 'width: 20px'
  },
  {
    name: 'fkko_code',
    label: 'Код ФККО',
    field(row: Ticket){
      return row.fkko.code
    },
    style: 'width: 20px'
  },
  {
    name: 'fkko_security_class',
    label: 'Класс опасности',
    field(row: Ticket){
      return row.fkko.security_class
    },
    style: 'width: 20px'
  },
  {
    name: 'ticket_volume',
    field: 'ticket_volume',
    label: 'Объем в талоне',
    style: 'width: 20px'
  },
  {
    name: 'actual_volume',
    field: 'actual_volume',
    label: 'Объем фактический',
    style: 'width: 20px'
  },
  {
    name: 'mass_empty',
    field: 'mass_empty',
    label: 'Масса пустая',
    style: 'width: 20px'
  },
  {
    name: 'mass_full',
    field: 'mass_full',
    label: 'Масса полная',
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

const tableColumnsDesktop = [
  // {
  //   name: 'id',
  //   label: 'ID',
  //   field: 'id',
  //   required: true,
  //   sortable: true,
  //   style: 'width: 20px'
  // },
  {
    name: 'num',
    label: 'Номер',
    field: 'num',
    required: true,
    sortable: true,
    style: 'width: 20px'
  },
  {
    name: 'status',
    label: 'Статус',
    field(row: Ticket){
      return TicketStatusNames.get(row.status)
    },
    style: 'width: 20px'
  },
  {
    name: 'approve_status',
    field: 'approve_status',
    label: 'Подтверждение',
    style: 'width: 20px',
    align: 'left',
  },
  {
    name: 'date',
    label: 'Дата',
    field(row: Ticket) {
        return formatDateTime(row.created_at)
    },
    style: 'width: 20px'
  },
  {
    name: 'short_name',
    field: 'short_name',
    label: 'Отход (кратко)',
    style: 'width: 20px'
  },
  {
    name: 'fkko_code',
    label: 'Код ФККО',
    field(row: Ticket){
      return row.fkko.code
    },
    style: 'width: 20px'
  },
  {
    name: 'fkko_security_class',
    label: 'Класс опасности',
    field(row: Ticket){
      return row.fkko.security_class
    },
    style: 'width: 20px'
  },
  {
    name: 'ticket_volume',
    field: 'ticket_volume',
    label: 'Объем в талоне',
    style: 'width: 20px'
  },
  {
    name: 'actual_volume',
    field: 'actual_volume',
    label: 'Объем фактический',
    style: 'width: 20px'
  },
  {
    name: 'mass_empty',
    field: 'mass_empty',
    label: 'Масса пустая',
    style: 'width: 20px'
  },
  {
    name: 'mass_full',
    field: 'mass_full',
    label: 'Масса полная',
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


const tableColumns: ComputedRef<QTableProps["columns"]> = computed(() => {
  if ($q.screen.gt.sm){
    return tableColumnsDesktop
  } else {
    return tableColumnsMobile
  }
})

const canCreate = computed(() => {
  return storeAuth.hasRole([RoleEnum.BUH_EXT, RoleEnum.OUTLEN])
})

function loadData(payload: object){
  const prom = store.ticketsLoad(payload)
  void prom.then(resp => {
    data.value =resp.results
  })
  return prom
}



function onRowClick(e, data: Ticket){
  void router.push({name: 'ticket', params: {id: data.id}})
}

function onCreateNew(){
  void router.push({name: 'ticket', params: {id: "new"}})

}


//function onCreateNew() {
//  if (item.value && item.value.sum_actual !== null && item.value.sum_actual !== undefined) {
//    void router.push({ name: 'ticket', params: { id: 'new' } });
//  } else {
//    $q.notify({
//      color: 'negative',
//      message: 'Для создания талона бухгалтер должен заполнить фактическую сумму!',
//      icon: 'error',
//    });
//  }
//}


</script>