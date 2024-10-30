<template>
  <div class="q-mb-lg">
    <q-btn
      label="Назад"
      color="grey"
      icon="arrow_back"
      size="sm"
      v-bind="$attrs"
      @click="$router.go(-1)"
    />
  </div>
</template>