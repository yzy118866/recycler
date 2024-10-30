<template>
  <!-- Select list -->

  <div class="row">
    <div class="col-12 col-sm-6 col-md-4 justify-stretch">
      <q-list
        class="q-mb-md"
        bordered
      >
        <q-item
          v-for="contract of company.contracts"
          :key="contract.id"
          :active="contract.id === contractOpen"
          active-class="bg-teal text-white"
          clickable
          @click="contractOpen = contract.id"
        >
          <q-item-section>
            <q-item-label>
              {{ contract.name }}
              <q-badge
                v-if="contractFKKOCount(contract)"
                align="top"
                color="secondary"
              >
                {{ contractFKKOCount(contract) }}
                <q-tooltip>
                  Количество распознанных ФККО
                </q-tooltip>
              </q-badge>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row q-gutter-x-sm">
              <q-btn
                icon="open_in_new"
                color="primary"
                size="sm"
                dense
                round
                unelevated
                :href="contract.file"
                target="new"
              />
              <q-btn
                v-if="canEdit"
                icon="edit"
                color="primary"
                size="sm"
                dense
                round
                unelevated
                @click.stop="contractAskRename(contract)"
              >
                <q-tooltip>Переименовать договор</q-tooltip>
              </q-btn>
              <q-btn
                v-if="canEdit"
                icon="search"
                color="primary"
                size="sm"
                dense
                round
                unelevated
                @click.stop="contractParseFkko(contract)"
              >
                <q-tooltip>Распознать ФККО</q-tooltip>
              </q-btn>
              <q-btn
                v-if="canEdit"
                icon="delete"
                color="negative"
                size="sm"
                dense
                round
                unelevated
                @click.stop="contractAskDelete(contract)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div
      class="col-12 col-sm-6 col-md-8"
      style="min-height: 700px"
    >
      <template v-if="contractOpenData">
        <iframe
          v-if="canShowIframe"
          :src="contractOpenData?.file"
          width="100%"
          height="700px"
        />
        <template v-else>
          <div class="flex flex-center text-center">
            <h6>Предпросмотр файла не доступен. Можно просматривать только *.pdf</h6>
          </div>
        </template>
      </template>

      <template v-else>
        <div class="flex flex-center full-height">
          <div
            class="text-h6 text-center"
          >
            Выберите договор для просмотра
          </div>
        </div>
      </template>
    </div>
  </div>

  <!-- Upload new -->
  <template v-if="canEdit">
    <q-uploader
      ref="uploader"
      label="Выбрать файл договора"
      accept=".pdf,.docx"
      flat
      bordered
      hide-upload-btn
      @added="onContractAdded"
      @removed="onContractRemoved"
    />
    <q-btn
      class="q-mt-sm"
      label="Загрузить договор"
      color="secondary"
      :disable="!uploadContractFile"
      :loading="isLoading"
      unelevated
      no-caps
      @click="contractUpload()"
    />
  </template>
</template>

<script setup lang="ts">
import { QUploader, useQuasar } from 'quasar';
import { notifySuccess } from 'src/Modules/Notif';
import { promiseSetLoading } from 'src/Modules/StoreCrud';
import { Company, CompanyContract, CompanyContractRequest, PatchedCompanyContractRequest, RoleEnum } from 'src/client';
import { useAuthStore } from 'src/stores/auth';
import { useMainStore } from 'src/stores/main';
import { PropType, Ref, computed, ref } from 'vue';

const props = defineProps({
  company: {
    type: Object as PropType<Company>,
    required: true,
  }
})

const emit = defineEmits(["reload"])
const $q = useQuasar()
const store = useMainStore()
const storeAuth = useAuthStore()

const isLoading = ref(false)
const companyId = computed(() => props.company.id)
const uploadContractFile: Ref<Blob | null> = ref(null)

const uploader: Ref<InstanceType<typeof QUploader> | undefined> = ref()
const contractOpen: Ref<number | null> = ref(null)


const canEdit = computed(() => {
  return storeAuth.hasRole(RoleEnum.BUH_INN)
})

const contractOpenData = computed(() => {
  return props.company.contracts?.find(c => c.id === contractOpen.value)
})

const canShowIframe = computed(() => {
  return contractOpenData.value?.file?.endsWith(".pdf")
})

function contractFKKOCount(contract: CompanyContract){
  const contractId = contract.id;

  const fkkos = props.company.fkko?.filter(code => code.contract === contractId)
  return fkkos?.length
}

function onContractAdded(files: Blob[]){
  if (files.length > 0){
    uploadContractFile.value = files[0]
  }
}
function onContractRemoved(){
  uploadContractFile.value = null
}

function contractUpload(){
  if (!companyId.value || !uploadContractFile.value){
    return
  }
  const prom = store.contractUpload({
    file: uploadContractFile.value,
    company: companyId.value,
    name: "contract",
  })
  void prom.then(() => {
    emit("reload")
    if (uploader.value){
      uploader.value.reset()
    }
  })
  promiseSetLoading(prom, isLoading)
}

function contractDelete(id: number){
  const prom = store.contractDelete(id)
  void prom.then(() => {
    emit("reload")
  })
  promiseSetLoading(prom, isLoading)
}
function contractRename(contract: CompanyContract, name: string){
  const payload: PatchedCompanyContractRequest = {
    name: name,
  }
  const prom = store.contractUpdate(contract.id, payload)
  void prom.then(() => {
    emit("reload")
  })
  promiseSetLoading(prom, isLoading)
}

function contractParseFkko(contract: CompanyContract){
  const prom = store.contractParseFkko(contract.id)
  void prom.then(() => {
    emit("reload")
  })
  promiseSetLoading(prom, isLoading)
  void prom.then((resp) => {
    notifySuccess({
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      message: `Успешно распознано ${resp.count} ФККО`
    })
  })
}

function contractAskDelete(contract: CompanyContract){
  $q.dialog({
      message: `Вы уверены что хотите удалить этот договор '${contract.name}'?`,
      cancel: true,
    }).onOk(() => {
      contractDelete(contract.id)
    })
}
function contractAskRename(contract: CompanyContract){
  $q.dialog({
    title: "Переименовать договор",
    message: "Введите новое название договора",
    prompt: {
      model: contract.name,
      type: 'text',
    },
    cancel: true,
    persistent: true,
  }).onOk((data: string) => {
    contractRename(contract, data)
  })
}


</script>