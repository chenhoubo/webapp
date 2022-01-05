<template>
  <div class="homeBox">
    <components :is="componentOn" />
  </div>
</template>

<script>
import adminComponent from './admin'
import userComponent from './user'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['rolevalue']),
    componentOn() {
      if (this.rolevalue === 'admin') {
        return 'adminComponent'
      } else {
        return 'userComponent'
      }
    }
  },
  components: {
    adminComponent,
    userComponent
  }
}
</script>
