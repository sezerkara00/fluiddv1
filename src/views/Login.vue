<template>
  <v-row
    :dense="$vuetify.breakpoint.smAndDown"
    justify="center"
    align="center"
  >
    <v-col
      cols="12"
      md="4"
      lg="3"
      xl="2"
    >
      <!-- Kullanıcı Seçme Bölümü -->
      <div v-if="users.length > 0" class="text-center mb-6">
        <v-select
          v-model="selectedUser"
          :items="users"
          item-text="username"
          item-value="username"
          label="Kullanıcı Seç"
          filled
          dense
          hide-details="auto"
          class="mb-4"
        />
        <app-btn
          block
          large
          color="primary"
          :disabled="!selectedUser"
          @click="switchToUser"
        >
          Kullanıcı Değiştir
        </app-btn>
      </div>

      <v-divider v-if="users.length > 0" class="my-4" />

      <v-form
        @submit.prevent="handleLogin"
      >
        <div class="text-center">
          <p v-html="$t('app.general.msg.welcome_back')" />

          <v-alert
            v-if="error"
            type="error"
          >
            {{ $t('app.general.simple_form.error.credentials') }}
          </v-alert>

          <v-text-field
            v-model="username"
            :label="$t('app.general.label.username')"
            autocomplete="username"
            spellcheck="false"
            filled
            dense
            hide-details="auto"
            :disabled="loading"
            class="mb-4"
          />

          <v-text-field
            v-model="password"
            :label="$t('app.general.label.password')"
            autocomplete="current-password"
            filled
            dense
            type="password"
            hide-details="auto"
            :disabled="loading"
            class="mb-4"
          />

          <v-select
            v-if="availableSources.length > 1"
            v-model="source"
            :label="$t('app.general.label.auth_source')"
            filled
            dense
            hide-details="auto"
            :disabled="loading"
            :items="availableSources.map(value => ({ text: $t(`app.general.label.${value}`), value }))"
            class="mb-4"
          />

          <app-btn
            type="submit"
            :disabled="loading"
            large
            block
            class="mb-6"
          >
            <v-icon
              v-if="loading"
              class="spin mr-2"
            >
              $loading
            </v-icon>
            {{ $t('app.general.btn.login') }}
          </app-btn>

          <app-btn
            plain
            class="custom-transform-class text-none"
            :href="$globals.DOCS_AUTH_LOST_PASSWORD"
            target="_blank"
          >
            {{ $t('app.general.btn.forgot_password') }}
          </app-btn>

          <app-btn
            plain
            class="custom-transform-class text-none"
            :href="$globals.DOCS_AUTH"
            target="_blank"
          >
            {{ $t('app.general.btn.auth_unsure') }}
          </app-btn>
        </div>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { appInit } from '@/init'
import { consola } from 'consola'
import type { InstanceConfig } from '@/store/config/types'
import type { AppUser } from '@/store/auth/types'

@Component({})
export default class Login extends Vue {
  username = ''
  password = ''
  error = false
  loading = false
  source = 'moonraker'
  availableSources = [this.source]
  selectedUser = ''

  get users (): AppUser[] {
    return this.$store.state.auth.users.filter((user: AppUser) =>
      user.username !== '_TRUSTED_USER_' &&
      user.username !== this.$store.state.auth.currentUser?.username
    )
  }

  async switchToUser () {
    if (this.selectedUser) {
      this.username = this.selectedUser
      // Password alanına fokuslan
      const passwordField = this.$el.querySelector('input[type="password"]') as HTMLInputElement
      if (passwordField) {
        passwordField.focus()
      }
    }
  }

  @Watch('selectedUser')
  onSelectedUserChange (newValue: string) {
    if (newValue) {
      this.username = newValue
    }
  }

  async mounted () {
    const authInfo = await this.$store.dispatch('auth/getAuthInfo')
    this.source = authInfo.defaultSource ?? this.source
    this.availableSources = authInfo.availableSources ?? this.availableSources
  }

  async handleLogin () {
    this.error = false
    this.loading = true
    try {
      await this.$store.dispatch('auth/login', { username: this.username, password: this.password, source: this.source })
    } catch {
      this.error = true
    }
    this.loading = false

    // Re-init the app.
    if (!this.error) {
      const instance: InstanceConfig = this.$store.getters['config/getCurrentInstance']

      const config = await appInit(instance, this.$store.state.config.hostConfig)

      // Reconnect the socket with the new instance url.
      if (config.apiConnected && config.apiAuthenticated) {
        consola.debug('Activating socket with config', config)
        this.$socket.connect(config.apiConfig.socketUrl)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-card__actions {
    padding: 8px 16px;
  }
</style>
