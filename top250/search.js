    //判断一个数组里是否有指定str
    var strInArr = function(arr,str) {
        for(let i = 0; i < arr.length; i++) {
            var s = arr[i]
            if(s == str) {
                return true
            }
        }
        return false
    }
//查找类型 
var searchType = function(str) {
    var result = 0
    for(let i = 0; i < data.length; i++) {
        var objTypes = data[i].types
        //判断一个数组里是否有指定str 有返回true
        if(strInArr(objTypes,str)) {
            result++
        }
    }
    return result
}



//矩形竖图data
var datas = []
var data = function() {
    this.name = "",
    this.value = this.country.length,
    this.children = []
}




//把所有的obj添加一个 value : 1
for(let i = 0; i < data.length; i++) {
    data[i].value = 1
}

//把相同国家的obj 添加进一个数组

    var strInArr = function(arr,str) {
        for(let i = 0; i < arr.length; i++) {
            var s = arr[i]
            if(s == str) {
                return true
            }
        }
        return false
    }

var searchCountry = function(str) {
    var result = []
    for(let i = 0; i < data.length; i++) {
        var objTypes = data[i].country
        //判断一个数组里是否有指定str 有返回true
        if(strInArr(objTypes,str)) {
            result.push(data[i])
        }
    }
    return result
}



//定义一个新的对象将name值 改成国家 children改成 数组
//添加进一个数组

