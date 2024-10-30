<template>
  <q-img
    :src="computedSrc"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  src: {
    type: [String, Blob],
    default: null,
  }
})

const computedSrc = computed(() => {
  if (props.src && props.src instanceof Blob){
    return URL.createObjectURL(props.src)
  }
  return props.src
})
</script>