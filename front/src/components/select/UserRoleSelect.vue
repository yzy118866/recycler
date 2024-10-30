<template>
  <q-select
    v-model="model"
    :options="options"
    label="Роль пользователя"
    options-dense
    map-options
    emit-value
    outlined
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { UserRoleNames } from 'src/Modules/Globals';
import { RoleEnum } from 'src/client';
import { TUserRole } from 'src/stores/auth';
import { PropType, computed } from 'vue';


const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  exclude: {
    type: Array as PropType<RoleEnum[]>,
    default: undefined,
  }
})

const emit = defineEmits(["update:model-value"])

const options = [

]

for (const [key, value] of UserRoleNames.entries()) {
  if (props.exclude && props.exclude.indexOf(key) !== -1) continue;
  options.push({
    label: value,
    value: key,
  })
}


const model = computed({
  get(){
    return props.modelValue
  },
  set(val){
    emit("update:model-value", val)
  }
})



</script>