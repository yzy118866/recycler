<template>
  <q-page
    class="flex column items-stretch"
    padding
  >
    <template v-if="storeAuth.hasRole([RoleEnum.BUH_INN])">
      <!-- Companies table -->
      <companies-table />
    </template>
    <template v-else-if="role == RoleEnum.OTV || role == RoleEnum.OUTLEN || role == RoleEnum.MAN">
      <!-- Company select -->
      <template v-if="store.companySelected">
        <div class="row items-center q-mb-md">
          <div class="q-mr-md">
            <q-btn
              label="Назад"
              color="grey"
              icon="arrow_back"
              size="sm"
              v-bind="$attrs"
              @click="store.companySelected = null"
            />
          </div>
          <div>
            <nav-breadcrumbs>
              <q-breadcrumbs-el
                :label="`Заказчик \'${store.companySelected.name}\'`"
              />
            </nav-breadcrumbs>
          </div>
        </div>
        <tickets-table
         v-if="role === RoleEnum.OTV"
         class="q-mt-sm"
         :filter-company="store.companySelected.id"
         :filter-status="TicketStatusEnum.PN"
         :create-btn="false"
         title="Талоны на выгрузке"
        />
        <template v-else>
         <tickets-table
           :filter-company="store.companySelected.id"
           :filter-status="TicketStatusEnum.PR"
           title="Талоны в работе"
         />
         <tickets-table
           class="q-mt-sm"
           :filter-company="store.companySelected.id"
           :filter-status="TicketStatusEnum.PN"
           :create-btn="false"
           title="Талоны на выгрузке"
         />
         <tickets-table
           class="q-mt-sm"
           :filter-company="store.companySelected.id"
           :filter-status="TicketStatusEnum.AR"
           :create-btn="false"
           title="Талоны в архиве"
         />
         <tickets-table
           class="q-mt-sm"
           :filter-company="store.companySelected.id"
           :create-btn="false"
           filter-author-current
           title="Созданные талоны"
         />
        </template>
      </template>
      <select-company-screen v-else />
    </template>
    <template v-else-if="role == RoleEnum.DISP || role == RoleEnum.BUH_EXT">
      <!-- Tickets list -->
      <div class="col-grow flex flex-center">
        <q-list>
          <menu-item
            :to="{name: 'tickets_processing'}"
            icon="hourglass_bottom"
            label="Талоны в работе"
          />
          <menu-item
            :to="{name: 'tickets_unload'}"
            icon="local_shipping"
            label="Талоны на выгрузке"
          />
          <menu-item
            :to="{name: 'tickets_archive'}"
            icon="archive"
            label="Талоны в архиве"
          />
        </q-list>
      </div>
    </template>
    <template v-else-if="role == null">
      <div class="col-grow flex flex-center">
        <banner-warning>
          Ваша роль не назначена администратором.
        </banner-warning>
      </div>
    </template>
    <template v-else>
      <div class="col-grow flex flex-center">
        <banner-warning>
          Роль "{{ role }}" не определена
        </banner-warning>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import NavBreadcrumbs from '../components/common/NavBreadcrumbs.vue'
import BackBtn from '../components/form/BackBtn.vue'
import TicketsTable from '../components/table/TicketsTable.vue'
import SelectCompanyScreen from '../components/user/SelectCompanyScreen.vue'
import MenuItem from '../components/layout/MenuItem.vue'
import CompaniesTable from '../components/buh/CompaniesTable.vue'
import { useIntervalFn } from '@vueuse/core';
import BannerWarning from '../components/common/BannerWarning.vue'
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth';
import { computed } from 'vue';
import { RoleEnum, TicketStatusEnum } from 'src/client';
import { useMainStore } from 'src/stores/main';

const store = useMainStore()
const storeAuth = useAuthStore();

const role = computed(() => {
  return storeAuth.userRole
})

useIntervalFn(() => {
  void storeAuth.loadAccountInfo()
}, 30_000)

</script>
