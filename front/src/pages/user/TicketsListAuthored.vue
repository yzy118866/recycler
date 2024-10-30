<template>
  <q-page padding>
    <tickets-table
      filter-author-current
      title="Созданные талоны"
    />
  </q-page>
</template>
<script setup lang="ts">
import TicketsTable from '../../components/table/TicketsTable.vue'

</script>