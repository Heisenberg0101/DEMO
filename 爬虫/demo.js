const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

const log = function() {
    return console.log.apply(console, arguments)
}

//类 电影 保存电影的信息    影名 评分 电影类型 年份 国家
const Movie = function() {
    this.name = ""
    this.score = 0
    this.types = []
    this.years = ""
    this.country = []
}

/*
  <div class="item">
                <div class="pic">
                    <em class="">1</em>
                    <a href="https://movie.douban.com/subject/1292052/">
                    <img width="100" alt="肖申克的救赎" src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp" class="">
                    </a>
                </div>
                <div class="info">
                    <div class="hd">
                        <a href="https://movie.douban.com/subject/1292052/" class="">
                            <span class="title">肖申克的救赎</span>
                            <span class="title">&nbsp;/&nbsp;The Shawshank Redemption</span>
                            <span class="other">&nbsp;/&nbsp;月黑高飞(港)  /  刺激1995(台)</span>
                        </a>


                        <span class="playable">[可播放]</span>
                    </div>
                    <div class="bd">
                        <p class="">
                            导演: 弗兰克·德拉邦特 Frank Darabont&nbsp;&nbsp;&nbsp;主演: 蒂姆·罗宾斯 Tim Robbins /...<br>
                            1994&nbsp;/&nbsp;美国&nbsp;/&nbsp;犯罪 剧情
                        </p>
                        <div class="star">
                                <span class="rating5-t"></span>
                                <span class="rating_num" property="v:average">9.6</span>
                                <span property="v:best" content="10.0"></span>
                                <span>1329584人评价</span>
                        </div>
                        <p class="quote">
                                <span class="inq">希望让人自由。</span>
                        </p>
                    </div>
                </div>
            </div>
*/

const saveMovies = function(movies) {
    // 这个函数用来把一个保存了所有电影对象的数组保存到文件中
    const fs = require('fs')
    const path = 'douban.text'
    // 第三个参数是 缩进层次
    const s = JSON.stringify(movies, null, 2)
    fs.writeFile(path, s, function(error) {
        if (error !== null) {
            log('*** 写入文件错误', error)
        } else {
            log('--- 保存成功')
        }
    })
}

//在字符串中寻找年份 返回字符串
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

const movieFromDiv = function(div) {
    // 这个函数来从一个电影 div 里面读取电影信息
    const movie = new Movie()
    // 使用 cheerio.load 函数来返回一个可以查询的特殊对象
    const e = cheerio.load(div)

    // 然后就可以使用 querySelector 语法来获取信息了
    // .text() 获取文本信息 =innertext
    movie.name = e('.title').text()
    movie.score = e('.rating_nums').text()
    // movie.quote = e('.inq').text()
    //截取年份 searchYears(str)
    movie.years = searchYears( e('.abstract').text() )
    //截取字符串 分隔 返回数组
    movie.country = searchString(e('.abstract').text(), "地区: ", "\n年份", "/")
    movie.types = searchString(e('.abstract').text(), "类型: ", "\n制片", " / ")
    // const pic = e('.pic')
    // movie.ranking = pic.find('em').text()
    // // 元素的属性用 .attr('属性名') 确定
    // movie.coverUrl = pic.find('img').attr('src')



    return movie
}

const moviesFromUrl = function(url) {
    // request 从一个 url 下载数据并调用回调函数
    request(url, function(error, response, body) {
        // 回调函数的三个参数分别是  错误, 响应, 响应数据
        // 检查请求是否成功, statusCode 200 是成功的代码
        if (error === null && response.statusCode == 200) {
            // cheerio.load 用字符串作为参数返回一个可以查询的特殊对象
            // body 就是 html 内容
            const e = cheerio.load(body)
            const movies = []
            // 查询对象的查询语法和 DOM API 中的 querySelector 一样
            const movieDivs = e('.doulist-subject')
            for(let i = 0; i < movieDivs.length; i++) {
                let element = movieDivs[i]
                // 获取 div 的元素并且用 movieFromDiv 解析
                // 然后加入 movies 数组中
                const div = e(element).html()
                const m = movieFromDiv(div)
                movies.push(m)
            }
            // 保存 movies 数组到文件中
            saveMovies(movies)
        } else {
            log('*** ERROR 请求失败 ', error, response.statusCode)
        }
    })
}

//循环调用moviesFromUrl(url)
const moviesUrl = function() {    
    for(let i = 0; i <= 225; i = i + 25) {
        url = `https://movie.douban.com/top250?start=${i}&filter=`
        // 下载网页, 解析出电影信息, 保存到文件
        moviesFromUrl(url)
    }    
}

const __main = function() {
    //主函数 入口
    // moviesUrl() 
    url = `https://movie.douban.com/top250?start=0&filter=`
    // 下载网页, 解析出电影信息, 保存到文件
    moviesFromUrl(url)
}
__main()


