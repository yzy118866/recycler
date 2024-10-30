<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Эко-контроль
        </q-toolbar-title>
        <user-menu-btn />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="220"
      :breakpoint="1200"
      show-if-above
      bordered
    >
      <q-list class="flex column text-grey-9 full-height">
        <main-aside-menu />

        <q-space />

        <q-item
          clickable
          @click="toggleDark"
        >
          <q-item-section avatar>
            <q-icon :name="darkIcon" />
          </q-item-section>
          <q-item-section> Тёмная тема </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import MainAsideMenu from '../components/layout/MainAsideMenu.vue'
import { computed, ref } from 'vue';
import UserMenuBtn from '../components/layout/UserMenuBtn.vue'
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';

type darkMode = "auto" | true | false

const store = useAuthStore()
const $q = useQuasar()

const darkModes:darkMode[] = ["auto", true, false]
const leftDrawerOpen = ref(false)
const preferredMode = $q.localStorage.getItem("preferredMode") as darkMode

if (preferredMode !== null) {
  $q.dark.set(preferredMode)
}
const darkIcon = computed(() => {
  const mode = $q.dark.mode
  switch (mode) {
    case false:
      return "light_mode"
    case true:
      return "dark_mode"
    case "auto":
      return "brightness_auto"
    default:
      return "dark_mode"
  }
})



function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function toggleDark() {
  const mode = $q.dark.mode
  const idxCurr = darkModes.indexOf(mode)
  let idxNew = idxCurr + 1
  if (idxNew >= darkModes.length) {
    idxNew = 0
  }
  const newMode:darkMode = darkModes[idxNew]
  // set
  $q.dark.set(newMode)
  $q.localStorage.set("preferredMode", newMode)
}

</script>
