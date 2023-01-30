/*
 * @Author: peso12345
 * @LastEditors: peso12345
 * @Date: 2023-01-26 13:46:00
 * @Version: 0.0.1
 * @Description: 描述sec
 */
import { createApp, ref, onMounted, computed, watch, onBeforeUnmount } from '../../vue/vue.esm.js';
const app = createApp({
    setup(props) {
        let showBtn = ref(true)
        console.log('object');
        let deg = ref('190px')
        let rate = ref(190)
        let styleAll = ref(`--filter-rotate: ${rate.value}deg;`)

        let timer = 0;



        const clickW = () => {
            // 
            showBtn.value = !showBtn.value
            // 
            if (timer && showBtn.value) {
                clearInterval(timer)
                console.log(timer);
                // rate.value = 0
                return
            }
            //
            timer = setInterval(() => {
                styleAll.value = `--filter-rotate:${rate.value}deg;`
                rate.value += 1
                // console.log(timer, rate.value);
                rate.value > 720 ? rate.value = 0 : ''
            }, 50)
        }

        const playerRef = ref(null)
        console.log(playerRef.value);

        //        获取需要的标签
        var video = document.querySelector('video');
        //          播放按钮
        var playBtn = document.querySelector('.switch');
        //          当前进度条
        var currProgress = document.querySelector('.curr-progress');
        //          当前时间
        var currTime = document.querySelector('.curr-time');
        //          总时间
        var totalTime = document.querySelector('.total-time');
        //          全屏
        var extend = document.querySelector('.extend');

        //    播放暂停
        const playVideo = () => {
            const video = document.querySelector('video');
            if (video.paused) {
                video.play()
            } else {
                video.pause()

            }
        }

        // 时间
        let allTime = ref(0)

        const getTimeforma = (time) => {
            var h = Math.floor(time / 3600);
            //            分钟
            var m = Math.floor(time % 3600 / 60);
            //            秒
            var s = Math.floor(time % 60);

            h = h >= 10 ? h : "0" + h;
            m = m >= 10 ? m : "0" + m;
            s = s >= 10 ? s : "0" + s;
            return h + ":" + m + ":" + s
        }

        const getDuration = () => {
            allTime.value = playerRef.value.duration
            console.log(allTime.value);
            console.log(playerRef.value.currentTime);

            // //          将总秒数 转换成 时分秒的格式：00：00:00
            // //            小时
            // var h = Math.floor(allTime.value / 3600);
            // //            分钟
            // var m = Math.floor(allTime.value % 3600 / 60);
            // //            秒
            // var s = Math.floor(allTime.value % 60);

            // h = h >= 10 ? h : "0" + h;
            // m = m >= 10 ? m : "0" + m;
            // s = s >= 10 ? s : "0" + s;


            allTime.value = getTimeforma(allTime.value);

        }

        // let currentTime = computed(() => {
        //     return playerRef.value.currentTime
        // })
        let currentTime = ref('00:00:00')

        const getCurrentTime = () => {
            let time = Math.floor(playerRef.value.currentTime)

            currentTime.value = getTimeforma(time)

            // console.log(playerRef.value.currentTime, playerRef.value.duration);
            // console.log((playerRef.value.currentTime.toFixed(4)/playerRef.value.duration).toFixed(4));
            setProgress(playerRef.value.currentTime / playerRef.value.duration)
        }

        // let currentProgress = 0;
        const setProgress = (value) => {
            // if (!currentProgress) {
            let currentProgress = document.querySelector('.curr-progress');
            // }
            // console.dir(currentProgress.style.width = `${value}%`);
            currentProgress.style.cssText = `width:${value * 100}%`

        }

        // 控制台显示/隐藏
        const displayVideo = () => {
            // if()\
            console.log('控制台显示/隐藏');
            var player = document.querySelector('.player');

            player.addEventListener('mouseenter', toMoveIn)
            player.addEventListener('mousemove', toMove)
            player.addEventListener('mouseleave', toMoveOut)
        }
        const toMoveIn = () => {
            // console.log('mouseenter');
            var controls = document.querySelector('.controls');
            controls.style = `opacity: 1;`
            // setTimeout(() => {
            //     controls.style = `opacity: 1;`
            // }, 200);
        }
        let timeout = 0;
        let times = 0;

        const toMove = () => {
            // 节流(throttle)，一段时间内只响应一次事件
            let wait = 1000
            let now = +new Date()
            if (now - timeout > wait) {
                // console.log(now);

                timeout = now
                var controls = document.querySelector('.controls');
                controls.style = `opacity: 1;`
            }


            times && clearTimeout(times)
            times = setTimeout(() => {
                var controls = document.querySelector('.controls');
                controls.style = `opacity: 0;`
            }, +wait+1200);


            // 防抖(debounce)，一段时间内无输入则执行函数，不适合
            /*  timeout && clearTimeout(timeout)
             timeout = setTimeout(() => {
                 console.log('mousemove');
 
                 var controls = document.querySelector('.controls');
 
                 // console.log(typeof controls.style.opacity);
                 if (controls.style.opacity == '1') {
                     return
                 }
                 controls.style = `opacity: 1;`
             }, 200); */
        }
        const toMoveOut = () => {
            // console.log('mouseleave');
            var controls = document.querySelector('.controls');
            // controls.style = `display:none;`
            setTimeout(() => {
                controls.style = `opacity: 0;`
            }, 500);

        }


        // 全屏
        const fullScreen = () => {
            const video = document.querySelector('video');
            video.requestFullscreen()
        }


        let widthVideo = ref(800)
        onMounted(() => {
            console.dir(playerRef.value);
            let adio = 16 / 9;
            let width = widthVideo.value;
            // let width = 800;
            playerRef.value.style.cssText = `width:${width}px;height:${width / adio}px;`

            displayVideo()
            // addEventListener('mousemove')
        })
        onBeforeUnmount(() => {
            var player = document.querySelector('.player');
            player.removeEventListener('mouseenter', toMoveIn)
            player.removeEventListener('mouseleave', toMoveOut)
            player.removeEventListener('mousemove', toMove)

        })


        return { showBtn, deg, styleAll, clickW, playerRef, playVideo, fullScreen, allTime, getDuration, currentTime, getCurrentTime }
    },
})
app.mount('#app')