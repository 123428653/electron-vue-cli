<style lang="scss" scoped>
.topBar {
  display: flex;
  height: 35px;
  justify-content: space-between;
  background-color: #fbfbfb;
  -webkit-app-region: drag;
  align-items: stretch;
  line-height: 35px;
}
.topBar-left {
  display: flex;
  user-select: none;
}
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8px;
}
.topBar-right {
  display: flex;
}
.topBar-right span{
  display: flex;
  align-items: center;
  transition: all .2s;
  font-size: 20px;
  font-style: normal;
  width: 35px;
  justify-content: center;
  -webkit-app-region: no-drag;
  i {
    transition: all .2s;
  }
  &:hover{
    background-color: #e5e5e5;
  }
  &.close:hover{
    background-color: #e81123;
    i {
      color: #fff;
    }
  }
  .icon-minus {
    display: inline-block;
    width: 12px;
    height: 2px;
    background: #666;
  }
}
</style>

<template>
  <div class="topBar">
    <div class="topBar-left">
      <div class="logo"><img width="26" src="~@/assets/logo-bar.png"></div>
      <div>{{appName}}</div>
    </div>
    <div class="topBar-right">
      <span @click="sendItem('minimize')">
        <i class="icon-minus"></i>
      </span>
      <span class="close" @click="sendItem('close')">
        <van-icon name="cross" />
      </span>
    </div>
  </div>
</template>

<script>
import { ipcRenderer, remote } from 'electron'
export default {
  data () {
    return {
      appName: remote.app.getName()
    }
  },
  methods: {
    sendItem (type) {
      ipcRenderer.send(type)
    }
  }
}
</script>
