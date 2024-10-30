<template>
  <q-banner
    rounded
    class="bg-orange text-white"
  >
    <template #avatar>
      <q-icon
        name="warning"
        color="white"
      />
    </template>

    <div class="text-h6">
      <slot />
    </div>
  </q-banner>
</template>