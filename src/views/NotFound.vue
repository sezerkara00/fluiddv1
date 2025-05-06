<template>
  <v-row
    :dense="$vuetify.breakpoint.smAndDown"
    justify="center"
    align="center"
  >
    <v-col>
      <center>
        <div class="text-h5">
          {{ $t('app.general.title.not_found') }}
        </div>
        <app-btn
          to="/"
          class="mt-5"
          @click="goToHome"
        >
          {{ $t('app.general.btn.return_dashboard') }}
        </app-btn>
      </center>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class NotFound extends Vue {
  goToHome () {
    if (this.$store.state.auth.currentUser?.username === '_TRUSTED_USER_') {
      console.log('user is trusted', this.$store.state.auth.currentUser)
      this.$router.push('/login')

    } else {
      console.log('user is not trusted', this.$store.state.auth.currentUser)
      this.$router.push('/home')
    }
  }
}
</script>
