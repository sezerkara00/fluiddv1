<template>
  <v-card>
    <v-card-text>
      <p class="message-text">
        {{ latestConsoleMessage }}
      </p>

      <v-container>
        <v-row
          v-for="(heater, index) in heaters"
          :key="index"
          class="heater-item"
        >
          <v-col>
            <h3>{{ heater.name }}: {{ heater.temperature }}°C</h3>
          </v-col>
        </v-row>
      </v-container>

      <v-container class="button-container">
        <v-row>
          <!-- İlk Buton -->
          <v-col>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <app-btn
                  class="white--text responsive-btn"
                  v-bind="attrs"
                  color="primary"
                  v-on="on"
                >
                  İLK BUTON
                </app-btn>
              </template>
              <span>İlk buton için açıklama</span>
            </v-tooltip>
          </v-col>

          <!-- İkinci Buton -->
          <v-col>
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <app-btn
                  class="white--text responsive-btn"
                  v-bind="attrs"
                  color="secondary"
                  v-on="on"
                >
                  İKİNCİ BUTON
                </app-btn>
              </template>
              <span>İkinci buton için açıklama</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">

import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import BrowserMixin from '@/mixins/browser'
import type { KlipperPrinterSettings } from '@/store/printer/types'

@Component({})
export default class Sezer extends Mixins(StateMixin, BrowserMixin) {
  get consoleEntries (): KlipperPrinterSettings {
    return this.$store.getters['console/getConsoleEntries']
  }

  get latestConsoleMessage () {
    const lastEntry = this.consoleEntries[this.consoleEntries.length - 1]
    return lastEntry ? `Son Mesaj: ${lastEntry.message}` : 'Mesaj yok'
  }

  get heaters () {
    return this.$store.getters['printer/getHeaters']
  }
}
</script>
