<template>
  <div>
    <v-subheader id="auth">
      {{ $t('app.setting.title.authentication') }}
    </v-subheader>
    <v-card
      :elevation="5"
      dense
      class="mb-4"
    >
      <app-setting>
        <app-btn
          outlined
          small
          color="primary"
          class="mr-2"
          @click="handleApiKeyDialog"
        >
          <v-icon
            small
            left
          >
            $edit
          </v-icon>
          {{ $t('app.general.label.api_key') }}
        </app-btn>

        <app-btn
          outlined
          small
          color="primary"
          @click="handleAddUserDialog"
        >
          <v-icon
            small
            left
          >
            $plus
          </v-icon>
          {{ $t('app.setting.btn.add_user') }}
          <!-- usser -->
        </app-btn>
      </app-setting>

      <v-divider v-if="users.length > 0" />

      <template
        v-for="(user, i) in users"
      >
        <app-setting
          :key="`user-${user.username}`"
          :sub-title="
            user.username === currentUser ? $t('app.general.label.currsent_user') :
            user.source !== 'moonraker' ? $t('app.general.label.user_managed_source', { source: $t(`app.general.label.${user.source}`) }) :
            undefined
          "
          :r-cols="3"
        >
          <template #title>
            {{ user.username }}
          </template>

          <app-btn
            :disabled="user.username === currentUser || user.source !== 'moonraker'"
            icon
            @click.stop="handleRemoveUser(user)"
          >
            <v-icon dense>
              $delete
            </v-icon>
          </app-btn>
        </app-setting>

        <v-divider
          v-if="i < users.length - 1"
          :key="`divider-${user.username}`"
        />
      </template>

      <user-config-dialog
        v-if="userDialogState.open"
        v-model="userDialogState.open"
        :user="userDialogState.user"
        @save="userDialogState.handler"
      />

      <api-key-dialog
        v-if="apiKeyDialogState.open"
        v-model="apiKeyDialogState.open"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import type { AppUser } from '@/store/auth/types'
import { Component, Vue } from 'vue-property-decorator'
import UserConfigDialog from './UserConfigDialog.vue'
import ApiKeyDialog from './ApiKeyDialog.vue'

@Component({
  components: {
    UserConfigDialog,
    ApiKeyDialog
  }
})
export default class AuthSettings extends Vue {
  search = ''
  categoryId?: string = undefined

  userDialogState: any = {
    open: false,
    user: null,
    handler: null
  }

  apiKeyDialogState: any = {
    open: false
  }

  get users (): AppUser[] {
    return this.$store.state.auth.users
  }

  get currentUser () {
    const currentUser: AppUser | null = this.$store.state.auth.currentUser

    return currentUser?.username ?? ''
  }

  handleAddUserDialog () {
    this.userDialogState = {
      open: true,
      user: { username: '', password: '' },
      handler: this.handleSaveUser
    }
  }

  handleEditUserDialog (user: AppUser) {
    this.userDialogState = {
      open: true,
      user,
      handler: this.handleSaveUser
    }
  }

  handleApiKeyDialog () {
    this.apiKeyDialogState.open = true
  }

  async handleRemoveUser(user: AppUser) {
  try {
    const result = await this.$confirm(
      this.$t('app.general.simple_form.msg.confirm_remove_user', { username: user.username }).toString(),
      { title: this.$tc('app.general.label.confirm'), color: 'card-heading', icon: '$error' }
    );

    if (result) {
      await this.$store.dispatch('auth/removeUser', user);
      console.log('Silinen kullanıcı:', user); // Konsola silinen kullanıcıyı yazdır
    }
  } catch (error) {
    console.error('Kullanıcı silinirken hata oluştu:', error);
  }
}


  async handleSaveUser(user: AppUser) {
  try {
    await this.$store.dispatch('auth/addUser', user);
    
    console.log('Yeni eklenen kullanıcı:', user); // Kullanıcıyı konsola yazdır

    // Eğer eklenen ilk kullanıcıysa, güven kontrolü yap
    if (this.users.length === 0) {
      await this.$store.dispatch('auth/checkTrust');
    }
  } catch (error) {
    console.error('Kullanıcı eklenirken hata oluştu:', error);
  }
}

}
</script>
