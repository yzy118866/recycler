<template>
  <q-breadcrumbs v-bind="$attrs">
    <q-breadcrumbs-el
      :to="{name: 'index'}"
      label="Главная"
      icon="home"
    />
    <slot />
  </q-breadcrumbs>
</template>