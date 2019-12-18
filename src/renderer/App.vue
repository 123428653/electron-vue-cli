<template>
  <div id="app">
    <div class="drag-bar">
      <div class="drag-bar-left">
        <div class="logo"><img width="26" src="./assets/logo1.png"></div>
        <div>{{appName}}</div>
      </div>
      <div class="drag-bar-right">
        <span @click="sendItem('minimize')">
          <i class="icon-minus"></i>
        </span>
        <span class="close" @click="sendItem('close')">
          <!-- <i>+</i> -->
          <van-icon name="cross" />
        </span>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import { ipcRenderer, remote } from 'electron'
  // import pak from '../../package.json'
  export default {
    name: 'Compare',
    data () {
      console.log(remote.app.getName())
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

<style lang="scss">
  /* CSS */
  * {
    padding: 0;
    margin: 0;
  }
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/  
  ::-webkit-scrollbar  
  {
    width: 10px;
    height: 10px;
    background-color: rgba(62, 17, 63, 0.079)
  }
    
  /*定义滚动条轨道 内阴影+圆角*/  
  ::-webkit-scrollbar-track  
  {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: rgba(62, 17, 63, 0.079)
  }
    
  /*定义滑块 内阴影+圆角*/  
  ::-webkit-scrollbar-thumb  
  {  
    border-radius: 10px;  
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
    background-color: #ccc;
  }
  html,body {
    height: 100%;
    padding: 0;
    margin: 0;
  }
  body {
    font-size: 14px;
  }
  #app {
    height: 100%;
  }
  .result span,
  .result strong {
    color: #1989fa;
    text-decoration: underline;
    cursor: pointer;
  }
  .result strong {
    font-weight: normal;
    margin-left: 10px;
  }
  .contentLine {
    display: none;
    margin: 10px;
  }
  .itemShow .contentLine{
    display: block;
  }
  .result .itemShow span {
    display: none;
  }
  .drag-bar {
    display: flex;
    height: 35px;
    justify-content: space-between;
    background-color: #fbfbfb;
    -webkit-app-region: drag;
    align-items: stretch;
    line-height: 35px;
  }
  .drag-bar-left {
    display: flex;
  }
  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 8px;
  }
  .drag-bar-right {
    display: flex;
  }
  .drag-bar-right span{
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
