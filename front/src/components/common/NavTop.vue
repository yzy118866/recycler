<template>
  <div class="row items-center q-mb-md">
    <div
      v-if="backShow"
      class="q-mr-md"
    >
      <slot name="back_btn">
        <q-btn
          label="Назад"
          color="grey"
          icon="arrow_back"
          size="sm"
          :to="backTo"
          @click="onBack"
        />
      </slot>
    </div>
    <div v-if="navShow">
      <slot name="nav">
        <nav-breadcrumbs>
          <slot name="default" />
        </nav-breadcrumbs>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import NavBreadcrumbs from './NavBreadcrumbs.vue'



const props = defineProps({
  backShow: {
    type: Boolean,
    default: true,
  },
  backTo: {
    type: Object,
    default: null,
  },
  backDefault: {
    type: Boolean,
    default: true,
  },
  navShow: {
    type: Boolean,
    default: true,
  },
})

const $router = useRouter()

const emits = defineEmits(["back"])

function onBack(){
  if (props.backDefault){
    $router.go(-1)
  } else {
    emits("back")
  }
}

</script>