<template>
  <collapsable-card
    :title="$t('app.general.title.limit')"
    icon="$limits"
    draggable
    layout-path="dashboard.printer-limit-card"
  >
    <printer-limit />
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PrinterLimit from '@/components/widgets/denemee/PrinterLimit.vue'

@Component({
  components: {
    PrinterLimit
  }
})
export default class PrinterLimitCard extends Vue {
}
</script>
