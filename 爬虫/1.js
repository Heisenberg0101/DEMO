// 名字 评分 排名 类型 国家 年份
const Movie = function() {
    this.name = ""
    this.score = 0
    this.ranking = 0
    this.types = []
    this.country = []
    this.years = ""
}

const es = function(selector) {
    return document.querySelectorAll(selector)
}
const e = function(selector) {
    return document.querySelector(selector)
}

const log = function() {
    return console.log.apply(console, arguments)
}

const searchYears = function(string) {
    var startStr = "年份: "
    var a = string.indexOf(startStr)
    var start = a + startStr.length
    var result = string.slice(start,start + 4)
    return result
}

//分隔字符串 返回数组
var split = function(s, delimiter=' ') {
  var l = []
  // space 是分隔符的长度, 因为分隔符不一定长度为 1
  var space = delimiter.length
  // start 用来存储每次的开始下标
  var start = 0
  for(var i = 0; i < s.length; i++) {
      // 检查分隔符
      if(s.slice(i, i+space) === delimiter) {
          // 如果检查到了, 就存储一个数据
          l.push(s.slice(start, i))
          // 设置新的开始下标
          start = i + space
      }
  }
  // 把最后一个元素添加进去
  l.push(s.slice(start))
  return l
}

//作用 例'aaab b bccc'中取得aaa和ccc之间的字符串 第四个参数是有分隔需求的分隔符
const searchString = function(string, startStr, endStr, delimiter) {
    
    var a = string.indexOf(startStr)
    var start = a + startStr.length
    var end = string.indexOf(endStr)
    var str = string.slice(start,end)
    // 函数 字符串 分隔符  返回数组
    var result = split(str,delimiter)
    return result
}

const movieFromDiv = function(i) {
    // 这个函数来从一个电影 div 里面读取电影信息
    const movie = new Movie()

    // 然后就可以使用 querySelector 语法来获取信息了
    // .text() 获取文本信息 =innerText
    movie.name = es('.post+.title')[i].innerText
    movie.score = es('.rating_nums')[i].innerText
    // movie.quote = e('.inq').text()
    movie.ranking = es(".pos")[i].innerText
    //截取字符串 分隔 返回数组
    movie.types = searchString(es('.abstract')[i].innerText, "类型: ", "\n制片", " / ")
    movie.country = searchString(es('.abstract')[i].innerText, "地区: ", "\n年份", "/")
    //截取年份 searchYears(str)
    movie.years = searchYears( es('.abstract')[i].innerText )
    

    // const pic = e('.pic')
    // movie.ranking = pic.find('em').text()
    // // 元素的属性用 .attr('属性名') 确定
    // movie.coverUrl = pic.find('img').attr('src')
    return movie
}
var movies = []
const moviesFromUrl = function() {
    
    for(let i = 0; i < 25; i++) {    
        var m = movieFromDiv(i)
        movies.push(m)
    }
    
}

const __main = function() {
    //主函数
    moviesFromUrl()
}
__main()
