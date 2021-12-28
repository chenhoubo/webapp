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
    ...mapGetters(['username']),
    componentOn() {
      if (this.username === 'admin') {
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
