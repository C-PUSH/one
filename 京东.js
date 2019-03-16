window.onload = function () {
    /** 头部导航 */
    //获取轮播图高度
    var banner = document.querySelector(".jd_banner");
    var bannerHeight = banner.offsetHeight;
    // console.log(bannerHeight);
    //获取搜素框
    var search = document.querySelector(".search");
    window.onscroll = function () {
        //获取文本滚动的高度
        var offsetTop = document.documentElement.scrollTop;
        // console.log(offsetTop);
        //设置透明度
        var opacity = 0;
        if (offsetTop < bannerHeight) {
            opacity = offsetTop / bannerHeight;
            // console.log(opacity);
            //设置背景颜色
            // search.style.background = "rgba(225,35,34,"+opacity+")";
            search.style.background = `rgba(225,35,34,${opacity})`;
        }
    }

    /** 限时秒杀 */
    //设置初始时间 以秒为单位
    var totlaTime = 3400;
    getTime ();
    clock();
    function clock() {
        var spans = document.querySelector(".pTime").querySelectorAll("span");
        //添加定时器
            totlaTime--;
            if (totlaTime == 0) {
                //清除定时器
                // clearInterval(timerId);
                document.querySelector(".pTime").innerHTML = "活动已结束";
                document.querySelector(".pTime").style.color = "#666";
            }
            //获取小时
            var hour = Math.floor(totlaTime / 3600);
            //获取分钟
            var minute = Math.floor(totlaTime % 3600 / 60);
            //获取秒
            var second = Math.floor(totlaTime % 60);
            //将时间填充到span中
            spans[0].innerHTML = Math.floor(hour / 10);
            spans[1].innerHTML = Math.floor(hour % 10);

            spans[3].innerHTML = Math.floor(minute / 10);
            spans[4].innerHTML = Math.floor(minute % 10);

            spans[6].innerHTML = Math.floor(second / 10);
            spans[7].innerHTML = Math.floor(second % 10);
    }
    function getTime () {
        var timerId = setInterval(clock,1000);
    }

    /* 轮播图 */
    //获取图片容器
    var imgBox = document.querySelector(".jd_bannerImg");
    // console.log(imgBox);
    //获取原始第一张图片
    var first = imgBox.querySelector("li:first-of-type");
    //获取原始最后一张图片
    var last = imgBox.querySelector("li:last-of-type");
    //在首尾插入这两张图片
    imgBox.appendChild(first.cloneNode(true));
    //insertBefore(要插入的元素,插入的位置)
    imgBox.insertBefore(last.cloneNode(true), imgBox.firstChild);

    //获取li
    var lis = imgBox.querySelectorAll("li");
    //获取所有li的数量
    var count = lis.length;
    //获取容器的宽度
    var bannerWidth = banner.offsetWidth;
    //设置图片的宽度
    imgBox.style.width = count * bannerWidth + "px";
    for (var i = 0; i < lis.length; i++) {
        lis[i].style.width = bannerWidth + "px";
    }

    //定义图片索引
    var index = 1;

    //设置默认的偏移
    imgBox.style.left = -bannerWidth + "px";

    //当屏幕变化时 重新计算宽度
    window.onresize = function () {
        bannerWidth = banner.offsetWidth;
        imgBox.style.width = count * bannerWidth + "px";
        for (var i = 0; i < lis.length; i++) {
            lis[i].style.width = bannerWidth + "px";
        }
        //重新设置定位置
        imgBox.style.left = -index * bannerWidth + "px";
    }

    //实现点标记
    var setCircle = function (index) {
        var circle = banner.querySelector(".jd_circle").querySelectorAll("li");
        for (var i = 0; i < circle.length; i++) {
            circle[i].classList.remove("active");
        }
        circle[index - 1].classList.add("active");
    }

    //实现自动轮播
    var startTime;
    var zidongTime = function () {
        //开启定时器
        startTime = setInterval(function () {
            index++;
            // 添加过渡效果
            imgBox.style.transition = "left 0.5s ease-in-out";
            //设置偏移
            imgBox.style.left = (-index * bannerWidth) + "px";
            // console.log(-index * bannerWidth)
            //判断是否到最后一张
            setTimeout(function () {
                if (index == count - 1) {
                    index = 1;
                    imgBox.style.transition = "none";
                    imgBox.style.left = (-index * bannerWidth) + "px"
                }
            }, 500)
        }, 2000)
    }
    zidongTime();

    //实现手动轮播
    var startX, moveX, disX;
    /*标记当前过渡效果是否已经执行完毕*/
    var flag = true;
    // 为图片添加触摸开始事件
    imgBox.addEventListener("touchstart", function (e) {
        // 清除定时器
        clearInterval(startTime);
        // 获取手指的起始位置
        startX = e.targetTouches[0].clientX;
    });
    //添加触摸移动事件
    imgBox.addEventListener("touchmove", function (e) {
        if (flag == true) {
            console.log("touchmove");
            // 手指在滑动过程中的位置
            moveX = e.targetTouches[0].clientX;
            disX = moveX - startX;

            imgBox.style.transition = "none";

            imgBox.style.left = (-index * bannerWidth + disX) + "px";
        }
    });
    //添加触摸结束过程
    imgBox.addEventListener("touchend", function (e) {
        flag = false;
        console.log("touchend")
        // 判断滑动距离是否超过100
        if (Math.abs(disX) > 100) {
            // 判断滑动方向
            if (disX > 0) {
                //上一张
                index--;
            } else {
                //下一张
                index++;
            }
            //翻页
            imgBox.style.transition = "left 0.5s ease-in-out";
            imgBox.style.left = -index * bannerWidth + "px";
        } else if (Math.abs(disX) > 0) {
            imgBox.style.transition = "left 0.5s ease-in-out";
            imgBox.style.left = -index * bannerWidth + "px";
        }
        //重置
        startX = 0;
        moveX = 0;
        disX = 0;
    });

    // 过渡结束后触发
    imgBox.addEventListener("webkitTransitionEnd", function () {
        console.log("webkitTransitionEnd");
        //判断 如果到了最后一张回到索引1
        //如果到了第一张回到索引count-2
        if (index == count - 1) {
            index = 1;
            imgBox.style.transition = "none";
            imgBox.style.left = -index * bannerWidth + "px";
        } else if (index == 0) {
            index = count - 2;
            imgBox.style.transition = "none";
            imgBox.style.left = -index * bannerWidth + "px";
        }
        //设置标记
        setCircle(index);
        setTimeout(function () {
            flag = true;
            //清除之前的定时器
            clearInterval(startTime);
            //重新开启定时器
            zidongTime();
        }, 100);
    });
}