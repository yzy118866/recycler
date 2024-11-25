<template>
  <q-page padding>
    <tickets-table
      :filter-status="TicketStatusEnum.PN"
      title="Талоны на выгрузке"
    />
  </q-page>
</template>
<script setup lang="ts">
import { TicketStatusEnum } from 'src/client';
import TicketsTable from '../../components/table/TicketsTable.vue'

</script>