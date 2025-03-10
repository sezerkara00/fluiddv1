<template>
  <app-dialog
    v-model="open"
    :title="$t('app.general.label.login')"
    :cancel-button-loading="loading"
    :save-button-loading="loading"
    max-width="500"
    @save="handleLogin"
  >
    <v-card-text class="pa-0">
      <template v-if="error">
        <v-alert
          type="error"
          text
          class="mx-4 mt-4"
        >
          {{ errorMessage }}
        </v-alert>

        <v-divider />
      </template>

      <app-setting :title="$t('app.general.label.username')">
        <v-text-field
          :value="username"
          filled
          dense
          readonly
          class="mt-0"
          hide-details="auto"
        />
      </app-setting>

      <v-divider />

      <app-setting :title="$t('app.general.label.password')">
        <v-text-field
          v-model="password"
          autocomplete="current-password"
          filled
          dense
          type="password"
          class="mt-0"
          hide-details="auto"
          :rules="[$rules.required]"
        />
      </app-setting>
    </v-card-text>
  </app-dialog>
</template>

<script lang="ts">
import { Component, Vue, VModel, Prop } from 'vue-property-decorator'
import { EventBus } from '@/eventBus'
import type { AxiosError } from 'axios'

interface ErrorResponse {
  error: {
    message: string;
    code: number;
  };
}

@Component({})
export default class UserLoginDialog extends Vue {
  @VModel({ type: Boolean })
  open?: boolean

  @Prop({ type: String, required: true })
  username!: string

  password = ''
  error = false
  loading = false
  errorMessage = ''

  async handleLogin () {
    try {
      this.loading = true
      this.error = false
      this.errorMessage = ''

      await this.$store.dispatch('auth/login', {
        username: this.username,
        password: this.password
      })

      this.open = false
      this.password = ''

      this.$emit('success')

      EventBus.$emit('app:notification', {
        type: 'success',
        text: this.$t('app.general.msg.login_success').toString()
      })
    } catch (err) {
      this.error = true

      // Hata mesajını belirle
      if (this.isAxiosError(err)) {
        if (err.response?.status === 401) {
          this.errorMessage = this.$t('app.general.msg.invalid_password').toString()
        } else if (err.response?.status === 404) {
          this.errorMessage = this.$t('app.general.msg.user_not_found').toString()
        } else {
          this.errorMessage = this.$t('app.general.msg.login_error').toString()
        }
      } else {
        this.errorMessage = this.$t('app.general.msg.login_error').toString()
      }

      EventBus.$emit('app:notification', {
        type: 'error',
        text: this.errorMessage
      })
    } finally {
      this.loading = false
    }
  }

  private isAxiosError (error: unknown): error is AxiosError<ErrorResponse> {
    return (error as AxiosError).response !== undefined
  }
}
</script>
