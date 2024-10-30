<template>
  <!-- Top section -->
  <div class="main-container q-mt-md">
    <section class="text-bold top__section">
      <div class="text-h6 text-bold top__title text-center">
        Акт № _____ <br>
        о несоответствии виду отходов, <br>
        указанному в настоящем договоре и Талоне
      </div>

      <div class="text-container q-mt-lg">
        Наименование Заказчика ___________ по договору № <u>{{ company?.contract_num || templ(10) }}</u> от {{ date.formatDate(company.contract_date, "DD.MM.YYYY") || templ(8) }}
      </div>

      <div class="row justify-between text-container q-mt-md">
        <div class="">
          Дата: {{ fixDate(date.formatDate(reportDate, '"DD" MMMM YYYY')) }} г.
        </div>
        <div>Время: {{ date.formatDate(reportDate, "HH:mm") }}</div>
      </div>
    </section>

    <!-- Address section -->
    <section class="address q-mt-lg">
      <p class="text-p q-mb-xs">
        <b>Наименование объекта, осуществляющего сбор отходов</b>
        {{ ownerName }}
      </p>
      <p class="text-p">
        <b>Адрес объекта, осуществляющего сбор отходов</b>
        {{ landfill?.location || templ(10) }}
      </p>
    </section>

    <!-- Ticket info section -->
    <section class="ticket">
      <!-- Table ticket info -->
      <table class="text-p ticket__table">
        <thead>
          <tr>
            <th>Наименование отхода</th>
            <th>Код ФККО</th>
            <th>Ед. изм.</th>
            <th>Количество</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {{ ticket.short_name }}
            </td>
            <td>
              {{ ticket.fkko.name }}
            </td>
            <td />
            <td />
          </tr>
        </tbody>
      </table>

      <!-- Table car info -->
      <table class="text-p ticket__table q-mt-md">
        <thead>
          <tr>
            <th>Наименование транспортного средства (ТС)</th>
            <th>Объем кузова, м3</th>
            <th>Гос. номер ТС</th>
            <th>ФИО водителя ТС</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {{ report.car_model }}
            </td>
            <td />
            <td>
              {{ report.car_num }}
            </td>
            <td>
              {{ report.car_driver }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Description section -->
    <section class="description q-mt-md">
      <div class="text-p q-mb-xs">
        <p>При приеме по Талонам обнаружены отходы с наименованием, которые отличаются от фактически привезенных отходов.</p>
      </div>

      <div class="text-container">
        <div
          v-for="i of 12"
          :key="i"
          class="text-line"
        />
      </div>
      <div class="text-center">
        <i> (Описание ситуации) </i>
      </div>
    </section>

    <!-- Footer section -->

    <section class="footer">
      <div class="row items-end no-wrap q-gutter-x-sm text-container">
        <div class="col-5">
          Ответственное лицо <br>
          {{ ownerName }}
        </div>
        <div class="field__signature">
          {{ templ(20) }} <br>
        </div>
        <div class="q-mx-md text-signature-divider text-bold">
          /
        </div>
        <div class="field__fio">
          {{ templ(20) }} <br>
        </div>
      </div>

      <div class="row items-end no-wrap q-gutter-x-sm q-mt-md text-container">
        <div class="col-5">
          Представитель заказчика <br>
        </div>
        <div class="field__signature">
          {{ templ(20) }} <br>
        </div>
        <div class="q-mx-md text-signature-divider text-bold">
          /
        </div>
        <div class="field__fio">
          {{ templ(20) }} <br>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { date } from "quasar"
import { Company, Landfill, NonComplianceReport } from "src/client"
import { ComputedRef, PropType, computed, onMounted, ref } from "vue"

const props = defineProps({
  report: {
    type: Object as PropType<NonComplianceReport>,
    required: true,
  },
  autoPrint: {
    type: Boolean,
    default: false,
  }
})

const reportDate = computed(() => props.report.created_at)
const company = computed(() => props.report.ticket?.company as Company | null)
const ticket = computed(() => props.report.ticket)
const landfill = computed(() => props.report.ticket.landfill as Landfill | null)

const templ = (length = 10) => "_".repeat(length)
const ownerName = templ(20)

function fixDate(date_raw: string) {
  return date_raw.replace("ь", "я")
}

onMounted(() => {
  if (props.autoPrint.value){
    window.print()
  }
})
</script>

<style lang="scss">
$textIndent: 30; // In px

@media print {
  html,
  body {
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
  }
}
@media print {
  @page {
    margin: 0;
  }
  body {
    margin: 1.6cm;
  }
}

.main-container {
  font-family: Arial, Helvetica, sans-serif;
  text-align: justify;

  max-width: 1000px;
  margin: auto;

  p {
    text-indent: $textIndent * 1px;
  }
}

.text-container {
  width: 75%;
  margin-left: auto;
  margin-right: auto;
}

.text-signature-divider {
  font-size: 120%;
}

.text-line {
  content: "";
  width: 100%;
  height: 16px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    background-color: black;
    width: 100%;
    height: 1px;
    bottom: 0;
  }
}

.text-p {
  width: calc(75% + (#{$textIndent * 2px}));
  margin-left: auto;
  margin-right: auto;
}

.top {
  &__title {
    line-height: 120%;
  }
}

.ticket {
  &__table {
    &,
    th,
    td {
      border: 1px solid black;
      text-align: center;
      border-collapse: collapse;
    }

    td {
      height: 75px;
    }
  }
}

.field {
  &__signature,
  &__fio {
    position: relative;

    &::after {
      content: "(Подпись)";
      position: absolute;
      text-align: center;
      bottom: -100%;
      width: 100%;
      font-style: italic;
    }
  }

  &__signature {
    &::after {
      content: "(Подпись)";
    }
  }
  &__fio {
    &::after {
      content: "(ФИО)";
    }
  }
}
</style>
