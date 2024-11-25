<template>
  <q-markup-table
    flat
    bordered
    dense
  >
    <thead>
      <tr>
        <th>Номер талона</th>
        <th>Дата</th>
        <th>Наименование груза</th>
        <th>Цена</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item of archivedTickets"
        :key="item.id"
      >
        <td class="text-center">
          {{ item.num }}
        </td>
        <td>
          {{ formatDateTime(item.created_at) }}
        </td>
        <td>
          {{ item?.fkko?.name }}
        </td>
        <td>
          {{ item.price_actual }}
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>

<script setup lang="ts">
import { promiseSetLoading } from 'src/Modules/StoreCrud';
import { formatDateTime } from 'src/Modules/Utils';
import { useMainStore } from 'src/stores/main';
import { onMounted, ref, computed } from 'vue';
import { TicketStatusEnum } from 'src/client';

const props = defineProps({
  company: {
    type: Number,
    required: true,
  }
})

const store = useMainStore()
const isLoading = ref(false)
const archivedTickets = computed(() => {
  return (store.tickets || []).filter(ticket => 
    ticket.status === TicketStatusEnum.AR && ticket.approve_status !== false
  );
});

function loadHistory(){
  const prom = store.ticketsLoad({
    company: props.company,
    status: TicketStatusEnum.AR,
  })
  promiseSetLoading(prom, isLoading)
}

onMounted(() => loadHistory())
</script>