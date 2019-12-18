<template>
  <div class="index">
    <div class="mainWrap">
      <div class="leftBox">
        <div class="importFile">
          <div class="title">选择项目</div>
          <div class="files-btn">
            <van-button class="btn" type="info" icon="todo-list-o" size="small" @click="firstFileHandler">原项目</van-button>
            <van-button class="btn" type="info" icon="todo-list-o" size="small" @click="lastFileHandler">已混淆项目</van-button>
            <span class="error-msg" v-show="errorA">原项目不能为空，请选择！</span>
            <span class="error-msg" v-show="errorB">已混淆项目不能为空，请选择！</span>
          </div>
          <div class="validFileSurffix">
            <div class="title">添加验证的后缀名称</div>
            <div class="inputBox">
              <input type="text" placeholder="例如: .text (必填)" v-model.trim="suffixVal" @keydown.13="addItem(suffixNames, suffixVal, 'suffix')">
              <van-button class="btn" type="primary" size="small" @click="addItem(suffixNames, suffixVal, 'suffix')">添加</van-button>
              <span class="error-msg" v-show="suffixNamesError">请至少要添加一个需要验证的后缀文件。</span>
            </div>
            <div class="validFileSurffix-list tagList">
              <template v-for="(item, index) in suffixNames">
                <span
                  class="item"
                  :key="index"
                  v-if="index < 2">
                  <span>{{item}}</span>
                  <van-icon @click="delSuffix(index)" class="close" name="clear" />
                  <div class="tip">{{item}}</div>
                </span>
              </template>
              <span class="item more" v-if="suffixNames.length > 2" @click="showSuffix = true">
                查看更多({{suffixNames.length}})
              </span>
            </div>
          </div>
          <div class="validFileSurffix">
            <div class="title">添加忽略的文件名称</div>
            <div class="inputBox">
              <input type="text" placeholder="例如: index.js (选填)" v-model.trim="IgnoreNameVal" @keydown.13="addItem(IgnoreNames, IgnoreNameVal, 'ignore')" >
              <van-button class="btn" type="primary" size="small" @click="addItem(IgnoreNames, IgnoreNameVal, 'ignore')">添加</van-button>
            </div>
            <div class="validFileSurffix-list tagList">
              <template v-for="(item, index) in IgnoreNames">
                <span
                  class="item"
                  :key="index"
                  v-if="index < 2">
                  <span>{{item}}</span>
                  <van-icon @click="delIgnoreName(index)" class="close" name="clear" />
                  <div class="tip">{{item}}</div>
                </span>
              </template>
              <span class="item more" v-if="IgnoreNames.length > 2" @click="showFileName = true">
                查看更多({{IgnoreNames.length}})
              </span>
            </div>
          </div>
          <div class="title">选择忽略的目录</div>
          <div class="ignoreDir">
            <van-button class="btn" type="info" icon="credit-pay" size="small" @click="addIgnoreDir">添加目录 (可选)</van-button>
            <div class="ignoreList tagList" v-if="ignoreDir.length">
              <template v-for="(item, index) in ignoreDir">
                <span
                  :key="index"
                  class="item"
                  v-if="index < 2">
                  <span>{{item}}</span>
                  <van-icon @click="delIgnore(index)" class="close" name="clear" />
                  <div class="tip">{{item}}</div>
                </span>
              </template>
              <span class="item more" v-if="ignoreDir.length > 2" @click="showIgnoreDir = true">
                查看更多({{ignoreDir.length}})
              </span>
            </div>
          </div>
        </div>
        <div class="checked">
          <van-button :loading="isLoading" class="startBtn" type="primary" @click="start" :loading-text="loadingText" text="开始" size="large" />
          <van-button type="danger" @click="clear" text="清除" size="large" />
        </div>
      </div>
      <div class="rightBox">
        <div class="filePath">
          <div :title="firstFile"><strong>原项目目录:</strong> {{firstFile}}</div>
          <div :title="lastFile"><strong>已混淆项目目录:</strong> {{lastFile}}</div>
        </div>
        <div class="result" ref="result" @click="itemHandler">
          <ul v-if="result.length">
            <li v-for="(item, index) in result" :key="index" v-html="item"></li>
          </ul>
          <div v-else class="notCompare">
            没有对比的数据！
          </div>
        </div>
      </div>
    </div>
    <!-- 验证的后缀名称 -->
    <van-overlay :show="showSuffix">
      <div class="ignoreDirPopWrapper">
        <div class="ignoreDirPopList" @click.stop>
          <van-icon @click="showSuffix = false" class="closeIgnoreDir" name="clear" />
          <h3>验证的后缀名称</h3>
          <ul>
            <li class="dirItem" v-for="(item, index) in suffixNames" :key="index">
              {{item}}
              <span @click="delSuffix(index)">删除</span>
            </li>
            <li class="empty" v-if="!suffixNames.length">没有验证的后缀名称~~</li>
          </ul>
        </div>
      </div>
    </van-overlay>
    <!-- 忽略的文件夹名称 -->
    <van-overlay :show="showFileName">
      <div class="ignoreDirPopWrapper">
        <div class="ignoreDirPopList" @click.stop>
          <van-icon @click="showFileName = false" class="closeIgnoreDir" name="clear" />
          <h3>忽略的文件名称</h3>
          <ul>
            <li class="dirItem" v-for="(item, index) in IgnoreNames" :key="index">
              {{item}}
              <span @click="delIgnoreName(index)">删除</span>
            </li>
            <li class="empty" v-if="!IgnoreNames.length">没有忽略的文件名称~</li>
          </ul>
        </div>
      </div>
    </van-overlay>
    <!-- 忽略的目录 -->
    <van-overlay :show="showIgnoreDir">
      <div class="ignoreDirPopWrapper">
        <div class="ignoreDirPopList" @click.stop>
          <van-icon @click="showIgnoreDir = false" class="closeIgnoreDir" name="clear" />
          <h3>忽略的目录</h3>
          <ul>
            <li class="dirItem" v-for="(item, index) in ignoreDir" :key="index">
              {{item}}
              <span @click="delIgnore(index)">删除</span>
            </li>
            <li class="empty" v-if="!ignoreDir.length">没有忽略的目录~</li>
          </ul>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script type="text/javascript">
  import { ipcRenderer } from 'electron'
  import Reader from '@/assets/js/reader'
  export default {
    data () {
      return {
        firstFile: '',
        lastFile: '',
        errorA: false,
        errorB: false,
        suffixNamesError: false,
        // isDisabled: true,
        isLoading: false,
        loadingText: '',
        suffixVal: '',
        IgnoreNameVal: '',
        suffixNames: [], // '.text', '.js', '.html', '.css', '.scss', '.vue'
        IgnoreNames: [],
        ignoreDir: [],
        result: [],
        showIgnoreDir: false,
        showSuffix: false,
        showFileName: false,
        looping: false
      }
    },
    mounted () {
      ipcRenderer.on('selected-directory', (event, obj) => {
        if (obj.files) {
          Reader.CodeValidator.pathOfDirA = obj.files[0]
          this.firstFile = obj.files[0]
          this.errorA = false
        }
      })
      ipcRenderer.on('last-selected-directory', (event, obj) => {
        if (obj.files) {
          Reader.CodeValidator.pathOfDirB = obj.files[0]
          this.lastFile = obj.files[0]
          this.errorB = false
        }
      })
      ipcRenderer.on('getIgnore', (event, files) => {
        if (files) {
          this.ignoreDir.push(files[0])
        }
      })
    },
    watch: {
      suffixNames (arr) {
        if (arr.length) {
          this.suffixNamesError = false
        }
      }
    },
    methods: {
      getMap (arr) {
        let maps = {}
        arr.map((item, index) => {
          maps[item] = true
        })
        return maps
      },
      itemHandler (e) {
        let li = document.querySelectorAll('.result li')
        let nodeName = e.target.nodeName
        li.forEach((item) => {
          item.classList.remove('active')
        })
        if (nodeName === 'LI' || nodeName !== 'SPAN' || nodeName !== 'STRONG') {
          if (nodeName === 'SPAN') {
            e.target.parentNode.classList.add('active')
          } else if (nodeName === 'STRONG') {
            e.target.parentNode.parentNode.classList.add('active')
          } else {
            e.target.classList.add('active')
          }
        } else {
          if (nodeName !== 'SPAN' && nodeName !== 'STRONG') {
            e.target.classList.remove('active')
          }
        }
        if (nodeName === 'SPAN') {
          e.target.parentNode.classList.add('itemShow')
        }
        if (nodeName === 'STRONG') {
          e.target.parentNode.parentNode.classList.remove('itemShow')
        }
      },
      addItem (arr, item, type) {
        if (!item) return
        arr.push(item)
        type === 'suffix' ? this.suffixVal = '' : this.IgnoreNameVal = ''
      },
      delSuffix (index) {
        this.suffixNames.splice(index, 1)
      },
      delIgnoreName (index) {
        this.IgnoreNames.splice(index, 1)
      },
      addIgnoreDir () {
        ipcRenderer.send('addIgnoreDir')
      },
      delIgnore (index) {
        this.ignoreDir.splice(index, 1)
      },
      clear () {
        this.firstFile = ''
        this.lastFile = ''
        this.isLoading = false
        this.loadingText = ''
        this.errorA = false
        this.errorB = false
        this.suffixNamesError = false
        this.suffixNames = []
        this.IgnoreNames = []
        this.ignoreDir = []
        this.result = []
      },
      start () {
        if (!this.firstFile) {
          this.errorA = true
          return
          // alert('请选择原项目的目录')
        }
        if (!this.lastFile) {
          this.errorB = true
          return
          // alert('请选择已混淆项目的目录')
        }
        if (!this.suffixNames.length) {
          this.suffixNamesError = true
          return
        }
        this.isLoading = true
        this.loadingText = '比较中...'
        this.result = []

        Reader.Logger.logger = (logType, logMsg) => {
          if (logType === Reader.LogType.ReadFileLog) {
            // console.log('|' , logMsg);
          }
          if (logType === Reader.LogType.CodeValidateLog) {
            // console.log('>' ,logMsg);
          }
          if (logType === Reader.LogType.Renderer) {
            console.log(':', logMsg)
            this.result.push(logMsg)
            if (!this.looping) {
              this.looping = true
              var setScrollTImer = setTimeout(() => {
                this.$refs.result.scrollTop = this.$refs.result.scrollHeight
                clearTimeout(setScrollTImer)
                this.looping = false
              }, 100)
            }
          }
        }
        Reader.CodeValidator.nameIgnore = Object.assign({'.DS_Store': true}, this.getMap(this.IgnoreNames))
        Reader.CodeValidator.validFileSurffix = this.getMap(this.suffixNames) // {'.c': true, '.h': true, '.m': true, '.yml': true}

        Reader.CodeValidator.folderIgnore = this.getMap(this.ignoreDir) // || {'/Users/minghao/Desktop/reader/idfa_check_server-2/ignore': true}
        // console.log('验证的名称后缀为=========>', Reader.CodeValidator.validFileSurffix)
        // console.log('忽略的文件名称为=========>', Reader.CodeValidator.nameIgnore)
        // console.log('忽略的目录为=========>', Reader.CodeValidator.folderIgnore)
        Reader.CodeValidator.onReadFileA = function (msg, path) {
          Reader.Logger.logger(Reader.LogType.Renderer, msg + ':' + path)
        }
        Reader.CodeValidator.onReadFileB = function (msg, path) {
          Reader.Logger.logger(Reader.LogType.Renderer, msg + ':' + path)
        }
        Reader.CodeValidator.onStart = function () {
          Reader.Logger.logger(Reader.LogType.Renderer, '开始验证...')
        }
        Reader.CodeValidator.onRepeat = function (path, index, line, repeatRate, totalLinesOfRepeat, totalLinesOfB, differenceRate, totalLinesOfA) {
          var percent = repeatRate * 100
          percent = percent.toFixed(2)
          Reader.Logger.logger(Reader.LogType.Renderer, /* '总数 ' + totalLinesOfA + ' 重复 ' + totalLinesOfRepeat +  */'已重复' + percent + '% ' + '  ' + path + ' 第 ' + index + ' 行重复。<span>查看重复内容</span>' + '<div class="contentLine">重复的内容为：' + line + '<strong>收起<strong></div>')
        }
        Reader.CodeValidator.onFinished = (repeatRate, totalLinesOfRepeat, totalLinesOfB, differenceRate, totalLinesOfA) => {
          var percent = repeatRate * 100
          percent = percent.toFixed(2)
          // console.log('differenceRate = ', differenceRate)
          // console.log('totalLinesOfA = ', totalLinesOfA)
          var difference = differenceRate * 100
          difference = difference.toFixed(2)
          Reader.Logger.logger(Reader.LogType.Renderer, '验证结束.... 已混淆项目中 ' + percent + '% 的代码出现重复, 其中与原项目差异的比率为：' + difference + '%' /* + '  ' + totalLinesOfRepeat + '  ' + totalLinesOfA */)
          this.isLoading = false
          this.loadingText = ''
        }
        Reader.CodeValidator.run()
      },
      firstFileHandler () {
        ipcRenderer.send('open-file-dialog')
      },
      lastFileHandler () {
        ipcRenderer.send('last-open-file-dialog')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .index {
    height: 100%;
    display: flex;
    justify-content: center;
    // align-items: center;
    // padding:30px 20px 20px;
    box-sizing: border-box;
    background-color: #3e113f;
    color: #fff;
  }
  .mainWrap {
    width: 100%;
    display: flex;
    align-items: stretch;
    overflow: hidden;
  }
  .error-msg {
    position: absolute;
    color: #f00;
    font-size: 11px;
    bottom: -17px;
    user-select: none;
    -webkit-user-select: none;
  }
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
    color:#ddd;
    user-select: none;
    -webkit-user-select: none;
  }
  .leftBox {
    width: 250px;
    margin: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .checked {
    > * {
      user-select: none;
      -webkit-user-select: none;
      cursor: pointer;
    }
    .startBtn {
      margin-bottom: 20px;
    }
  }
  .files-btn {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    position: relative;
    .btn {
      min-width: 100px;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
    }
  }
  .inputBox {
    // border: 1px solid #ddd;
    background-color: #fff;
    border-radius: 3px;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    margin-bottom: 20px;
    position: relative;
    input {
      border: none;
      flex: 1;
      color: #333;
      padding:0 8px;
      border-radius: 2px 0 0 2px;
      &::placeholder {
        font-size: 12px;
      }
    }
    .btn {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
    }
  }
  .validFileSurffix {
    margin-bottom: 5px;
  }
  .ignoreDir {
    .btn {
      display: block;
      width: 100%;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
    }
  }
  .tagList {
    margin-top: 20px;
    margin-right: -15px;
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    .item {
      position: relative;
      display: inline-block;
      margin-right: 10px;
      margin-bottom: 13px;
      height: 22px;
      cursor: default;
      &.more {
        margin-right: 0;
        // text-decoration: underline;
        cursor: pointer;
        line-height: 25px;
        user-select: none;
        -webkit-user-select: none;
      }
      span {
        display: inline-block;
        text-align: center;
        width: 65px;
        padding: 2px 5px;
        border-radius: 2px;
        border: 1px solid #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .close {
        position: absolute;
        top: -5px;
        right: -6px;
        background-color: #333;
        border-radius: 50%;
        cursor: pointer;
      }
      .tip {
        visibility: hidden;
        position: absolute;
        background: #fff;
        padding: 5px 10px;
        min-width: 65px;
        z-index: 1;
        border-radius: 5px;
        color: #000;
        top: 26px;
        left: 0;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: translate3d(0, -3px, 0);
        transition: all 0.3s 0.2s ease;
        &::after {
          content: '';
          width: 0;
          height: 0;
          border: 6px solid transparent;
          border-bottom-color: #fff;
          border-top-width: 0;
          position: absolute;
          left: 28px;
          top: -6px;
        }
      }
      &:hover .tip{
        visibility: visible;
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }
  }
  .rightBox {
    display: flex;
    flex: 1;
    padding: 20px;
    box-sizing: border-box;
    flex-direction: column;
    background-color: #fff;
  }
  .filePath {
    display: flex;
    justify-content: space-between;
    div {
      flex: 1;
      height: 48px;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      word-break: break-all;
      padding-right: 20px;
      color: #000;
    }
  }
  .result {
    flex: 1;
    border: 1px dashed #ccc;
    overflow: hidden;
    overflow-y: auto;
    margin-top: 20px;
    li {
      padding: 3px 10px;
      border-bottom: 1px solid #ccc;
      color: #000;
      word-break: break-all;
      &.active {
        background-color: #ecf1f8;
      }
    }
  }
  .notCompare {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #999;
    user-select: none;
    cursor: default;
  }
  .ignoreDirPopWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .ignoreDirPopList {
    background: #fff;
    width: 80%;
    height: 70%;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    position: relative;
    .closeIgnoreDir {
      position: absolute;
      right: -20px;
      top: -20px;
      font-size: 40px;
      background: rgba(0,0,0,0.9);
      border-radius: 50%;
      cursor: pointer;
    }
    h3 {
      color: #000;
      text-align: center;
      padding: 15px 0;
      font-size: 30px;
      height: 72px;
      box-sizing: border-box;
    }
    ul {
      flex: 1;
      padding: 10px;
      overflow: hidden;
      overflow-y: auto;
    }
    .dirItem {
      padding: 10px 50px 10px 10px;
      border-bottom: 1px solid #ccc;
      color: #000;
      word-break: break-all;
      position: relative;
      span {
        position: absolute;
        right: 10px;
        top: 10px;
        color: red;
        cursor: pointer;
      }
    }
    .empty {
      font-size: 30px;
      text-align: center;
      padding-top: 80px;
      color: #999;
    }
    
  }
</style>