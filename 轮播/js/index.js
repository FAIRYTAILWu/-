~function () {
    //导入依赖
    const {
        toJSON
    } = window._utils

    //获取数据
    function getdata(callback) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '../json/data.json', false)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                callback(toJSON(this.responseText))
            }
        }
        xhr.send()
    }
    let $ = select => document.querySelector(select)
    //获取轮播视口
    let container = $('#container')

    //获取图片容器
    let wrapper = $('.wrapper')

    //获取焦点容器
    let focus = $('.focus')

    //渲染数据
    function apply(data) {
        let wrapperStr = ``;
        let focusStr = ``;

        data.forEach((item, index) => {
            wrapperStr += `<img src="${item.img}" alt="" />`
            focusStr += `<span class="${ index === 0 ? 'active' : '' }"></span> `
        });
        //额外拼接一张图片
        wrapperStr += `<img src="${data[0].img}" alt="" />`
        //将拼接好插入到页面中
        wrapper.innerHTML = wrapperStr
        focus.innerHTML = focusStr
    }

    getdata(apply)



    //获取一张图片的宽度
    let win = container.clientWidth

    //获取所有轮播图片

    let len = wrapper.getElementsByTagName('img').length

    //获取最后一张图片的索引

    let lastIndex = len - 1
    //记录当前索引
    container.step = 0


    //轮播核心功能
    function carousel(add) {

        if (!isNaN(add)) {
            container.step = add
        } else if (add === 'left') {
            --container.step
        } else {
            ++container.step
        }


        //右边边界判断
        if (container.step > lastIndex) {
            wrapper.style.left = 0;
            container.step = 1
        }

        //左边边界判断

        if (container.step < 0) {
            wrapper.style.left = lastIndex * -win + 'px'
            container.step = lastIndex - 1
        }

        $animate({
            ele: wrapper,
            target: {
                left: container.step * -win
            }
        })
        central(container.step)
    }

    //划入清除定时器
    container.onmouseover = function () {
        clearInterval(container.tiemID)
    }

    //划出时重启定时器
    container.onmouseout = function () {
        tiem()
    }

    //点击左右切换
    function cut() {
        let left = document.querySelector('.left')
        let right = document.querySelector('.right')

        right.onclick = function () {
            carousel()
        }
        left.onclick = function () {
            carousel('left')
        }
    }
    cut()

    const focusList = focus.getElementsByTagName('span')
    //实现焦点跟随
    function central(index) {
        index === lastIndex && (index = 0)
        for (let i = 0; i < focusList.length; i++) {
            focusList[i].className = i === index ? 'active' : ''
        }
    }
    //实现焦点点击跟随
    function point() {
        for (let j = 0; j < focusList.length; j++) {
            focusList[j].onclick = function(){
                carousel(j)
            }
        }
    }
    point()
    container.tiemID = null;
    //定时器
    function tiem() {
        container.tiemID = setInterval(carousel, 1000)
    }
    tiem()

}()