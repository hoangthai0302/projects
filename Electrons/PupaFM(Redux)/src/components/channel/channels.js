const obj = {
  '0': '我的私人兆赫',
  '-10': '豆瓣精选兆赫',
  '1': '华语',
  '6': '粤语',
  '2': '欧美',
  '22': '法语',
  '17': '日语',
  '18': '韩语',
  '3': '70年代',
  '4': '80年代',
  '5': '90年代',
  '8': '民谣',
  '7': '摇滚',
  '13': '爵士',
  '27': '古典',
  '14': '电子',
  '16': 'R&B',
  '15': '说唱',
  '10': '电影原声',
  '20': '女声',
  '28': '动漫',
  '32': '咖啡',
  '26': '豆瓣音乐人'
}

let channels = []
const keys = Object.keys(obj)
keys.forEach((k) => {
  channels.push({ id: k, name: obj[k] })
})

export default channels
