<template>
  <div id="app">
    <top-bar />
    <router-view :class="{mac: isMac}"></router-view>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import topBar from '@/components/common/topBar'
  export default {
    name: 'Compare',
    data () {
      return {
        isMac: process.platform === 'darwin'
      }
    },
    components: {
      topBar
    },
    computed: {
      ...mapGetters(['list'])
    },
    watch: {
      list (val) {
        console.log(val)
      }
    },
    mounted () {
      this.fetchList()
    },
    methods: {
      ...mapActions(['fetchList'])
    }
  }
</script>
