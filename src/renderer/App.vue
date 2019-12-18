<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'Compare'
  }
</script>

<style>
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
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: rgba(62, 17, 63, 0.079)
  }
    
  /*定义滑块 内阴影+圆角*/  
  ::-webkit-scrollbar-thumb  
  {  
    border-radius: 10px;  
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);  
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
</style>
