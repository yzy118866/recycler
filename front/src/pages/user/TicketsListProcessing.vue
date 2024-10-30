<template>
  <q-page padding>
    <tickets-table
      :filter-status="TicketStatusEnum.PR"
      title="Талоны в работе"
    />
  </q-page>
</template>
<script setup lang="ts">
import { TicketStatusEnum } from 'src/client';
import TicketsTable from '../../components/table/TicketsTable.vue'

</script>