<template>
  <div class="row justify-around">
    <slot name="before" />
    <q-btn
      v-if="btnSave"
      type="submit"
      :label="labelSave"
      color="positive"
      icon="save"
      unelevated
      no-caps
      :loading="saving"
      :disable="anyLoading"
      @click="$emit('save', $event)"
    />
    <slot name="center" />
    <q-btn
      v-if="btnDelete"
      :label="labelDelete || 'Удалить'"
      color="negative"
      icon="delete"
      unelevated
      no-caps
      :loading="deleting"
      :disable="anyLoading"
      @click="onDelete"
    />
    <slot name="after" />
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { computed } from 'vue';


const props = defineProps({
  btnSave: {
    type: Boolean,
    default: true,
  },
  btnDelete: {
    type: Boolean,
    default: true,
  },
  deleteConfirm: {
    type: Boolean,
    default: true
  },
  saving: {
    type: Boolean,
    default: false,
  },
  deleting: {
    type: Boolean,
    default: false,
  },
  isExists: {
    type: Boolean,
    default: null,
  },
  labelSave: {
    type: String,
    default: null,
  },
  labelDelete: {
    type: String,
    default: null,
  },
})

const $emit = defineEmits(["save", "delete"])

const $q = useQuasar()

const anyLoading = computed(() => {
  return props.saving || props.deleting
})

const labelSave = computed(() => {
  if (props.labelSave){
    return props.labelSave
  }
  if (props.isExists == false){
    return "Создать"
  }
  return "Сохранить"
})

function onDelete(e: Event){
  if (props.deleteConfirm){
    $q.dialog({
      message: "Вы уверены что хотите удалить этот объект?",
      cancel: true,
    }).onOk(() => {
      $emit('delete', e)
    })
  } else {
    $emit('delete', e)
  }
}

</script>