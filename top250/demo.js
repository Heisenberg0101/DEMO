const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')

//类 电影 保存电影的信息    影名 评分 电影类型 年份 国家
const Movie = function() {
    this.name = ""
    this.score = 0
    this.types = []
    this.years = ""
    this.country = []
}


/*
    <div id="item14179138" class="doulist-item">
    <div class="mod">
      
  <div class="hd">
      <span class="pos">1</span>
  </div>

      
  
  

  <div class="bd doulist-subject">
      
        <div class="doulist-video-items">
          <span class="title">播放全片</span>
            
            <a class="doulist-video-item" target="_blank" href="http://v.qq.com/x/cover/1o29ui77e85grdr.html?ptag=douban.movie"><span class="icon-circle"><img src="https://img3.doubanio.com/f/movie/0a74f4379607fa731489d7f34daa545df9481fa0/pics/movie/video-qq.png"></span> 腾讯视频</a>

            
            <a class="doulist-video-item" target="_blank" href="http://www.iqiyi.com/v_19rra0h3wg.html?vfm=m_331_dbdy&amp;fv=4904d94982104144a1548dd9040df241"><span class="icon-circle"><img src="https://img3.doubanio.com/f/movie/7c9e516e02c6fe445b6559c0dd2a705e8b17d1c9/pics/movie/video-iqiyi.png"></span> 爱奇艺视频</a>

            
            <a class="doulist-video-item" target="_blank" href="http://film.sohu.com/album/1008593.html"><span class="icon-circle"><img src="https://img3.doubanio.com/f/movie/77358cffb08eb6750a0880136f0575c9e7e9a749/pics/movie/video-sohu.png"></span> 搜狐视频</a>

        </div>

    


    <div class="doulist-add-btn">
  

  

  
  <a href="javascript:void(0)" data-id="1292052" data-cate="1002" data-canview="True" data-url="https://movie.douban.com/subject/1292052/" data-isurlsubject="false" data-catename="电影" data-link="https://www.douban.com/people/192607003/doulists/all?add=1292052&amp;cat=1002" data-title="肖申克的救赎 The Shawshank Redemption" data-picture="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp" class="lnk-doulist-add" onclick="moreurl(this, { 'from-doulist':'doulist-btn-1002-1292052-192607003'})">
      <i></i>添加到豆列
  </a>
    </div>


    <div class="source">
      来自：豆瓣电影
    </div>
    
    <div class="post">
      <a href="https://movie.douban.com/subject/1292052/" target="_blank">
        <img width="100" src="https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.webp">
      </a>
    </div>
    <div class="title">
      <a href="https://movie.douban.com/subject/1292052/" target="_blank">
          <img style="width: 16px; vertical-align: text-top;" src="https://img3.doubanio.com/f/sns/5741f726dfb46d89eb500ed038833582c9c9dcdb/pics/sns/doulist/ic_play_web@2x.png">
        肖申克的救赎 The Shawshank Redemption
      </a>
    </div>
    
      <div class="rating">
          <span class="allstar50"></span>
          <span class="rating_nums">9.6</span>
          <span>(1346834人评价)</span>
      </div>
    <div class="abstract">
      
          导演: 弗兰克·德拉邦特
            <br>
          主演: 蒂姆·罗宾斯 / 摩根·弗里曼 / 鲍勃·冈顿
            <br>
          类型: 犯罪 / 剧情
            <br>
          制片国家/地区: 美国
            <br>
          年份: 1994
    </div>
  </div>


      
  
  <div class="ft">

    <div class="actions">

      <time class="time">
  <span title="2013-08-19 18:49:15">
    2013年8月19日
  </span>
</time>

        <a href="javascript: void 0;" class="btn btn-like " data-action-type="like">赞</a>
        <span class="count like-count" data-count="7">(7)</span>

      <a href="javascript: void 0;" class="btn btn-action-reply" data-action-type="showComments" data-count="0">回复</a>

    </div>

    <div class="others">
      <div class="comments">
        <div class="comments-items"></div>
        <a href="javascript:void(0);" class="btn" data-action-type="showComments" style="display: none;">加载更多</a>
          <form method="post" action="" class="comment-form"><div style="display:none;"><input type="hidden" name="ck" value="fe7M"></div>
            <input maxlength="280" type="text" name="text" class="comment-text" data-type="status-comment">
            <span class="bn-flat"><input type="submit" value="回复" data-type="status-comment"></span>
            <a href="javascript:void(0);" class="add-more-comments">继续回复</a>
          </form>
      </div>
    </div>
  </div>

  

  

    </div>
  </div>
*/
// 这个函数用来把一个保存了所有电影对象的数组保存到文件中
const saveMovies = function(movies) {
    const fs = require('fs')
    const path = 'douban.text'
    // 第三个参数是 缩进层次
    const s = JSON.stringify(movies, null, 2)
    fs.writeFile(path, s, function(error) {
        if (error !== null) {
             log('写入文件错误', error)
        } else {
            log('保存成功')
        }
    })
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

//在字符串中寻找年份 返回字符串
const searchYears = function(string) {
    var startStr = "年份: "
    var a = string.indexOf(startStr)
    var start = a + startStr.length
    var result = string.slice(start,start + 4)
    return result
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
    
    

// 这个函数来从一个电影 div 里面读取电影信息
const movieFromDiv = function(div) {
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
            log(' ERROR 请求失败 ', error, response.statusCode)
        }
    })
}

const __main = function() {
    //主函数 入口
    // moviesUrl() 
    url = `https://www.douban.com/doulist/2772079/?start=0&sort=seq&playable=0&sub_type=`
    // 下载网页, 解析出电影信息, 保存到文件
    moviesFromUrl(url)
}
__main()


