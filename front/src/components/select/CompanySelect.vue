<template>
  <q-select
    v-model="model"
    :loading="loading"
    :options="companies || []"
    label="Заказчик"
    options-dense
    option-label="name"
    option-value="id"
    map-options
    outlined
    use-input
    v-bind="$attrs"
    style="max-width: 100%"
    @filter="onFilter"
  />
</template>

<script setup lang="ts">
import { PropType, computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { promiseSetLoading } from 'src/Modules/StoreCrud';
import { useMainStore } from 'src/stores/main';

const props = defineProps({
  modelValue: {
    type: Number,
    required: false,
    default: undefined,
  },
})

const $emit = defineEmits(['update:model-value'])

const store = useMainStore()
const {companies} = storeToRefs(store)

const loading = ref(false)
const search = ref("")

const model = computed({
  get(){
    return props.modelValue
  },
  set(val){
    $emit('update:model-value', val)
  }
})

function loadData() {
  const payload = {
    search: search.value,
  }
  const prom = store.loadCompanies(payload)
  promiseSetLoading(prom, loading)
  return prom;
}

function onFilter(value: string, update: CallableFunction){
  search.value = value
  update(() => {
    void loadData()
  })
}

onMounted(() => loadData())

</script>