<template>
  <collapsable-card
    :title="$t('app.general.title.temperatures')"
    icon="$fire"
    layout-path="dashboard.printer-sezer-card"
  >
    <sezer />
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import sezer from '@/components/widgets/deneme/sezer.vue'

@Component({
  components: {
    sezer
  }
})
export default class SezerCard extends Vue {
}
</script>
