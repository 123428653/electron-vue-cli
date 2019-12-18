/**
 * @Author ：zhangy
 * @Descp  ：工具类-读取文件
 * @Date   ：2019-12-04 21:58:05
 */
const lineReader = require('line-reader')
var PathKit = require('path')
var fs = require('fs')

const CodeValidator = {
  // 目录A的绝对路径
  pathOfDirA: null,
  // 目录B的绝对路径
  pathOfDirB: null,
  // 这当中的文件名将被忽略，类似：{.Ds_Store:true}
  nameIgnore: {},
  // 这个路径的文件以及文件夹将被忽略,类似{/user/t:true}将被忽略t文件夹
  pathIgnore: {},
  // 满足条件的后缀才对比
  validFileSurffix: {},
  // 当验证完毕
  onFinished: function (repeatRate, totalLinesOfRepeat, totalLinesOfB, differenceRate, totalLinesOfA) {},
  // 当验证开始
  onStart: function () {},
  // 当读取到某个文件
  onReadFileA: function () {},
  onReadFileB: function () {},
  // 当出现一条重复记录
  onRepeat: function (path, index, line, repeatRate, totalLinesOfRepeat, totalLinesOfB, differenceRate, totalLinesOfA) {},
  trim: function (line) {
    var key = line.replace(/ /g, '')
    key = key.replace(/\n/g, '')
    key = key.replace(/\t/g, '')
    // 去掉所有的换行符
    key = key.replace(/\r\n/g, '')
    key = key.replace(/\n/g, '')
    // 去掉所有的空格（中文空格、英文空格都会被替换）
    key = key.replace(/\s/g, '')
    return key
  },
  dirAFinished: 1,
  dirBFinished: 1,
  // 读取并验证文件
  run: function () {
    CodeValidator.reset()
    if (CodeValidator.onStart) {
      CodeValidator.onStart()
    }
    var eachLineOfDirA = function (path, index, line, logLevel) {
      CodeValidator.dirAFinished = 1
      var key = CodeValidator.trim(line)
      if (key === '' || key === undefined || key === null) {
        CodeValidator.log(path + ' 第 ' + index + ' 行空不加A')
        return
      }
      CodeValidator.addLinesA(key, path, index, line, logLevel)
    }
    var eachFileOfDirA = function (path, msg) {
      if (CodeValidator.onReadFileA) {
        CodeValidator.onReadFileA(path, msg)
      }
    }
    // 异步读取
    FileReader.syncEnable = false
    // 读取A目录所有文件
    FileReader.readFileByLineSync(CodeValidator.pathOfDirA, eachLineOfDirA, eachFileOfDirA, CodeValidator.nameIgnore, CodeValidator.folderIgnore, CodeValidator.validFileSurffix, 0)

    // 读取B目录的数据
    var eachLineOfDirB = function (path, index, line, logLevel) {
      CodeValidator.dirBFinished = 1
      var key = CodeValidator.trim(line)
      if (key === '' || key === undefined || key === null) {
        CodeValidator.log(path + ' 第 ' + index + ' 行空不加B')
        return
      }
      CodeValidator.addLinesB(key, path, index, line, logLevel)
    }
    var eachFileOfDirB = function (path, msg) {
      if (CodeValidator.onReadFileB) {
        CodeValidator.onReadFileB(path, msg)
      }
    }
    FileReader.readFileByLineSync(CodeValidator.pathOfDirB, eachLineOfDirB, eachFileOfDirB, CodeValidator.nameIgnore, CodeValidator.folderIgnore, CodeValidator.validFileSurffix, 0)

    CodeValidator.runTimerToCheckFinished()
  },
  // 当连个文件都读取完成后，会回调这个方法
  onDirReadFinished: function () {
    // 计算目录A的所有数据
    for (var lineA in CodeValidator.linesOfDirA) {
      CodeValidator.totalLinesOfA++
      CodeValidator.log(lineA)
    }
    CodeValidator.log('A的总数' + CodeValidator.totalLinesOfA)
    for (var lineB in CodeValidator.linesOfDirB) {
      if (lineB) {
        CodeValidator.totalLinesOfB++
      }
    }
    CodeValidator.log('B的总数' + CodeValidator.totalLinesOfB)
    var totalLinesOfRepeat = ''
    var totalLinesOfA = ''
    var totalLinesOfB = ''
    var repeatRate = ''
    var differenceRate = ''
    // 循环项目B的所有代码，检查项目B在项目A中出现的比率
    for (var key in CodeValidator.linesOfDirB) {
      var value = CodeValidator.linesOfDirB[key]
      var path = value.path
      var line = value.line
      var index = value.index
      if (!CodeValidator.isLineExistInDirA(key)) {
        CodeValidator.log(path + ' 第 ' + index + ' 行不重复')
        continue
      }
      CodeValidator.log(path + ' 第 ' + index + ' 行重复 key:' + key)
      CodeValidator.addRepeatLine(key, line, path, index)
      if (CodeValidator.onRepeat) {
        totalLinesOfRepeat = CodeValidator.getTotalLinesOfRepeat()
        totalLinesOfA = CodeValidator.getTotalLinesOfA()
        // 差异百分比
        differenceRate = 1 - (totalLinesOfRepeat / totalLinesOfA)
        totalLinesOfB = CodeValidator.getTotalLinesOfB()
        repeatRate = totalLinesOfRepeat / totalLinesOfB
        // CodeValidator.onRepeat(path, index, line, repeatRate, totalLinesOfRepeat, totalLinesOfA)
        CodeValidator.onRepeat(path, index, line, repeatRate, totalLinesOfRepeat, totalLinesOfB, differenceRate, totalLinesOfA)
      }
    }
    if (CodeValidator.onFinished) {
      // 总的重复的行数
      totalLinesOfRepeat = CodeValidator.getTotalLinesOfRepeat()
      // 整个项目的代码总数
      totalLinesOfA = CodeValidator.getTotalLinesOfA()
      differenceRate = 1 - (totalLinesOfRepeat / totalLinesOfA)

      totalLinesOfB = CodeValidator.getTotalLinesOfB()
      repeatRate = totalLinesOfRepeat / totalLinesOfB
      var percent = repeatRate * 100
      percent = percent.toFixed(2)

      CodeValidator.log('已验证完毕，已混淆项目中 ' + percent + '%的代码出现重复')
      CodeValidator.onFinished(repeatRate, totalLinesOfRepeat, totalLinesOfB, differenceRate, totalLinesOfA)
      // CodeValidator.log('已验证完毕，重复比率为：' + percent + '%')
      // CodeValidator.onFinished(repeatRate, totalLinesOfRepeat, totalLinesOfA)
    }
  },
  runTimerToCheckFinished: function () {
    setTimeout(function () {
      // 5秒钟后，仍然没有eachLineOfDirA被调用，表示A目录读取完成
      var finishedTime = 5
      CodeValidator.dirAFinished++
      CodeValidator.dirBFinished++
      if (CodeValidator.dirAFinished === finishedTime) {
        CodeValidator.log('目录A读取完毕')
      }
      if (CodeValidator.dirBFinished === finishedTime) {
        CodeValidator.log('目录B读取完毕')
      }
      if (CodeValidator.dirAFinished === finishedTime && CodeValidator.dirBFinished === finishedTime) {
        CodeValidator.log('目录A以及目录B读取完毕')
        CodeValidator.onDirReadFinished()
      } else {
        CodeValidator.log('没有全部读取完成，继续检查')
        CodeValidator.runTimerToCheckFinished()
      }
    }, 1000)
  },
  log: function (msg) {
    Logger.logger(LogType.CodeValidateLog, msg)
  },
  reset: function () {
    CodeValidator.linesOfDirA = {}
    CodeValidator.linesOfDirB = {}
    CodeValidator.totalLinesOfA = 0
    CodeValidator.totalLinesOfB = 0
    CodeValidator.linesOfExistInDirA = {}
    CodeValidator.totalLinesOfRepeat = 0
  },
  // 目录A的总数
  totalLinesOfA: 0,
  // 目录B的总数
  totalLinesOfB: 0,
  // 重复的数量
  totalLinesOfRepeat: 0,
  addLinesA: function (key, path, index, line, logLevel) {
    CodeValidator.linesOfDirA[key] = line
  },
  addLinesB: function (key, path, index, line, logLevel) {
    CodeValidator.linesOfDirB[key] = { path: path, line: line, index: index }
  },
  // 添加目录A的数据
  addRepeatLine: function (key, line, path, index) {
    CodeValidator.totalLinesOfRepeat = CodeValidator.totalLinesOfRepeat + 1
    CodeValidator.linesOfExistInDirA[key] = {path: path, line: line, index: index}
  },
  // 目录A的代码行数
  getTotalLinesOfA: function () {
    return CodeValidator.totalLinesOfA
  },
  getTotalLinesOfB: function () {
    return CodeValidator.totalLinesOfB
  },
  // 重复的代码行数
  getTotalLinesOfRepeat: function () {
    return CodeValidator.totalLinesOfRepeat
  },
  // lines佛存在于目录A中
  isLineExistInDirA: function (key) {
    var value = CodeValidator.linesOfDirA[key]
    if (value !== undefined && value !== null && value.length > 0) {
      return true
    }
    return false
  },
  linesOfDirA: {},
  linesOfDirB: {},
  // 目录B中的代码，也在A中存在的部分,key是line去空格后的值，value是原line的值，以及所属文件path等信息
  linesOfExistInDirA: {
    key: {
      path: '', // 重复的文件
      line: '', // 重复的行的value
      index: ''// 重复行所在的行
    }
  }
}
const Logger = {
  logger: function (logType, logMsg) {
    console.log(logMsg)
  },
  logLevel: function (logType, level, msg) {
    if (!FileReader.syncEnable) {
      Logger.logger(logType, msg)
      return
    }
    var prefix = ''
    for (var i = 0; i < level; i++) {
      prefix = '    ' + prefix
    }
    var logMsg = prefix + msg
    if (Logger.logger) {
      Logger.logger(logType, logMsg)
    }
  }
}

const LogType = {
  ReadFileLog: 1,
  CodeValidateLog: 2,
  Renderer: 3,
  ReadPath: 4
}
const FileReader = {
  syncEnable: false,
  LOG: function (level, msg) {
    Logger.logLevel(LogType.ReadFileLog, level, msg)
  },
  readFileByLineSync: function (path, eachLine, eachFile, nameIgnore, pathIgnore, validFileSurffix, level) {
    var ignorePath = pathIgnore[path]
    if (ignorePath === true) {
      FileReader.LOG(level, '忽略路径：' + path)
      if (eachFile) {
        eachFile('忽略路径', path)
      }
      return
    }
    // 修改为异步读取
    fs.lstat(path, function (err, stat) {
      if (err) {
        console.log(err)
      }
      if (stat.isDirectory()) {
        FileReader.LOG(level, '读取目录：' + path)
        fs.readdir(path, null, function (err, files) {
          if (err) {
            console.log(err)
          }
          if (files === null || files === undefined) {
            return
          }
          for (var i = 0; i < files.length; i++) {
            var fileSubPath = path + '/' + files[i]
            FileReader.LOG(level, '读子文件:' + fileSubPath)
            FileReader.readFileByLineSync(fileSubPath, eachLine, eachFile, nameIgnore, pathIgnore, validFileSurffix, level + 1)
          }
        })
        return
      }

      var fileName = path.split('/').pop()
      var ignoreName = nameIgnore[fileName]
      if (ignoreName === true) {
        FileReader.LOG(level, '忽略名字：' + path)
        // 当开始读取文件时调用
        if (eachFile) {
          eachFile('忽略名字', path)
        }
        return
      }
      var extName = PathKit.extname(fileName)
      var surffixValid = validFileSurffix[extName]
      if (surffixValid !== true) {
        FileReader.LOG(level, '忽略后缀：' + path)
        if (eachFile) {
          eachFile('忽略后缀', path)
        }
        return
      }
      FileReader.LOG(level, '读取文件：' + path)
      if (eachFile) {
        eachFile('正在读取', path)
      }
      var sepStart = '['
      var sepEnd = ']:'

      var i = 1
      lineReader.eachLine(path, function (line) {
        FileReader.LOG(level + 1, sepStart + path + sepEnd + line)
        if (eachLine) {
          eachLine(path, i, line, level)
        }
        i++
      })
    })
  }
}
module.exports = {
  FileReader: FileReader,
  LogType: LogType,
  Logger: Logger,
  CodeValidator: CodeValidator
}
