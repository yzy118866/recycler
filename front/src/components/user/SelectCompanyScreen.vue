<template>
  <div class="flex column flex-center items-stretch">
    <div class="text-h5 text-bold text-center q-mb-md">
      Выбор компании
    </div>

    <q-list class="q-gutter-y-md">
      <q-item
        v-for="company of companies"
        :key="company.id"
        flat
        bordered
        class="bg-grey-4 q-mx-auto"
        style="width: 400px;max-width: 80%"
        clickable
        @click="selectCompany(company)"
      >
        <q-item-section>
          {{ company.name }}
        </q-item-section>
      </q-item>
    </q-list>
    <q-inner-loading :showing="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { promiseSetLoading } from 'src/Modules/StoreCrud';
import { CompanyShort } from 'src/client';
import {useMainStore} from 'src/stores/main'
import { onMounted, ref } from 'vue';
const store = useMainStore()

const {companies} = storeToRefs(store)
const isLoading = ref(false)

function loadCompanies(){
  const prom = store.loadCompanies({pageSize: 1000})
  promiseSetLoading(prom, isLoading)
}

function selectCompany(company: CompanyShort){
  store.companySelected = company;
}

onMounted(() => loadCompanies())
</script>