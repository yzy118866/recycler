<template>
  <q-select
    v-model="model"
    :loading="loading"
    :options="options || []"
    label="Код ФККО"
    options-dense
    :option-label="optionLabel"
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
import { Company, FKKO } from 'src/client';

const props = defineProps({
  modelValue: {
    type: Array as PropType<number[]>,
    required: true,
    default: undefined,
  },
  company: {
    type: Object as PropType<Company | null>,
    default: null,
    required: false,
  }
})

const $emit = defineEmits(['update:model-value'])

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


const options = computed(() => {
  if (search.value){
    return props.company?.fkko?.filter(code => code.code.indexOf(search.value) !== -1 || code.name.indexOf(search.value) !== -1) || []
  } else {
    return props.company?.fkko || []
  }
})

function optionLabel(option: FKKO | null){
  if (!option || Object.keys(option).length === 0
){
    return undefined
  }
  return `${option.name} (${option.code} класс ${option.security_class || ''})`
}

function onFilter(value: string, update: CallableFunction){
  search.value = value
  update(() => {
    //
  })
}

</script>