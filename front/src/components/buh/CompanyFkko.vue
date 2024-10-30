<template>
  <div
    v-if="model.fkko"
    style="max-width: 100%;"
  >
    <q-table
      style="max-width: 100%"
      :rows="model.fkko"
      :columns="columns"
      flat
      wrap-cells
      binary-state-sort
    >
      <template #body-cell-code="props_temp">
        <q-td
          key="code"
          :props="props_temp"
        >
          {{ props_temp.value }}
          <q-popup-edit
            v-slot="scope"
            v-model="props_temp.row.code"
            title="Редактировать код"
            auto-save
          >
            <q-input
              v-model.number="scope.value"
              type="number"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
      </template>
      <template #body-cell-name="props_temp">
        <q-td
          key="name"
          :props="props_temp"
        >
          {{ props_temp.value }}
          <q-popup-edit
            v-slot="scope"
            v-model="props_temp.row.name"
            title="Редактировать название"
            auto-save
          >
            <q-input
              v-model="scope.value"
              type="textarea"
              dense
              autofocus
              counter
              autogrow
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
      </template>
      <template #body-cell-price="props_temp">
        <q-td
          key="price"
          :props="props_temp"
        >
          {{ props_temp.value }}
          <q-popup-edit
            v-slot="scope"
            v-model="props_temp.row.price"
            title="Редактировать цену"
            auto-save
          >
            <q-input
              v-model.number="scope.value"
              type="number"
              dense
              autofocus
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
        </q-td>
      </template>
      <template #body-cell-actions="props_temp">
        <q-td
          key="actions"
          :props="props_temp"
        >
          <q-btn
            icon="delete"
            color="negative"
            size="xs"
            unelevated
            dense
            round
            @click="removeCode(props_temp.rowIndex)"
          />
        </q-td>
      </template>
    </q-table>
    <div>
      <q-btn
        class="q-mt-md"
        label="Добавить код"
        color="primary"
        icon="add"
        size="sm"
        no-caps
        @click="newCode()"
      />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { QTableProps } from 'quasar';
import { ruleRequired } from 'src/Modules/Globals';
import { Company } from 'src/client';
import { PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object as PropType<Company>,
    required: true,
  }
})

const model = useVModel(props)

const defaultFKKO = {
  id: null,
  name: "",
  code: "",
  security_class: "",
  price: 0,
  created_at: null,
  updated_at: null,
}

const columns: QTableProps["columns"] = [
  {
    name: 'id',
    label: 'IO',
    field: 'id',
    style: 'width: 50px',
    align: 'left',
  },
  {
    name: 'code',
    field: 'code',
    label: 'Код',
    style: 'width: 100px',
    align: 'left',
  },
  {
    name: 'name',
    field: 'name',
    label: 'Название',
    align: 'left',
  },
  {
    name: 'price',
    field: 'price',
    label: 'Цена',
    style: 'width: 100px',
    align: 'left',
  },
  {
    name: 'actions',
    label: '',
    field: null,
    style: 'width: 50px',
    align: 'left',
  },
]

function newCode(){
  const newFKKO = Object.assign({}, defaultFKKO, {company: model.value.id})
  // @ts-expect-error custom creation
  model.value.fkko?.push(newFKKO)
}

function removeCode(idx: number){
  model.value.fkko?.splice(idx, 1)
}

</script>