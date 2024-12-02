<template>
  <!-- Everyone -->
  <menu-item
    :to="{name: 'index'}"
    icon="home"
    label="Главная"
    exact
  />

  <!-- Companies list -->
  <template v-if="store.hasRole([RoleEnum.ADMIN, RoleEnum.BUH_INN, RoleEnum.BUH_EXT])">
    <menu-item
      :to="{name: 'companies'}"
      label="Заказчики"
    />
  </template>

  <!--  -->
  <template v-if="store.hasRole([RoleEnum.ADMIN, RoleEnum.DISP, RoleEnum.BUH_INN])">
    <menu-item
      :to="{name: 'tickets_all'}"
      label="Талоны все"
    />
  </template>
  <template v-if="store.hasRole([RoleEnum.OUTLEN, RoleEnum.MAN])">
    <menu-item
      :to="{name: 'tickets_authored'}"
      label="Созданные талоны"
    />
  </template>
  <template v-if="store.hasRole(RoleEnum.DISP)">
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
  </template>
  <template v-if="store.hasRole([RoleEnum.ADMIN, RoleEnum.DISP, RoleEnum.BUH_EXT, RoleEnum.BUH_INN])">
    <menu-item
      :to="{name: 'reports'}"
      icon="report"
      label="Акты о несоответствии"
    />
  </template>

  <!-- Admin -->
  <template v-if="userRole == RoleEnum.ADMIN">
    <q-separator />
    <menu-item
      :to="{name: 'admin_users'}"
      icon="manage_accounts"
      label="Пользователи"
    />
  </template>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth';
import MenuItem from './MenuItem.vue'
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { RoleEnum } from 'src/client';

const store = useAuthStore()
const {userRole} = storeToRefs(store)

</script>