export const assign = (target, ...sources) => {
  return Object.assign({}, target, ...sources)
}

export const isEmpty = (obj) => {
  return !Object.getOwnPropertyNames(obj).length
}

// 解析歌词
export const parseLyric = (lyric) => {
  var result = []
  var lines = lyric.split('\n')

  lines.forEach((line) => {
    var times = []

    line = line.replace(/\[(\d+):(\d+?(\.)?\d+)\]/g, ($0, m, s) => {
      times.push(parseInt(m) * 60 + parseFloat(s))
      return ''
    })

    // 循环歌词
    times.forEach((time, i) => {
      result.push({
        time: time,
        text: line
      })
    })
  })

  result = result.sort((a, b) => {
    return a.time - b.time
  })

  return result
}
