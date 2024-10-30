<template>
  <template v-if="item">
    <report-print
      :report="item"
      :auto-print="true"
    />
  </template>
  <q-inner-loading v-if="loading" />
</template>

<script setup lang="ts">
import ReportPrint from '../../components/buh/ReportPrint.vue'
import { storeToRefs } from "pinia"
import { promiseSetLoading } from "src/Modules/StoreCrud"
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import { useMainStore } from 'src/stores/main'

const route = useRoute()

const store = useMainStore()
const { report: item } = storeToRefs(store)
const loading = ref(false)

const itemId = computed(() => route.params.id as unknown as string)

function loadData() {
  const prom = store.nonComplianceReportLoad(parseInt(itemId.value))
  promiseSetLoading(prom, loading)
}

onMounted(() => loadData())


</script>
