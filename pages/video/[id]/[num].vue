<template>
    <div class="video-page">
        <div class="video-top-wrap">
            <div class="blurbg-wrap"><div class="blurbg-image" :style="style"></div></div>
            <div class="video-title">第{{route.params.num}}话 {{route.query.name + ' ' +  route.query.season}}</div>
            <div class="video-wrap" @mouseover="hoverVideo = true" @mouseleave="hoverVideo = false">
                <video class="video-player"
                    ref="videoPlayer"
                    preload="metadata"
                    :src="source[playSourceIndex]"
                    @click="clickPlay(!playStatus)"
                    @error="videoError"
                    @loadeddata="videoLoadeddata"
                    @progress="videoProgress"
                    @canplay="videoCanplay">
                </video>
                <Transition name="fade">
                    <div class="player-tools-wrap" v-if="!playStatus || hoverVideo">
                        <div class="player-mask" @click="clickPlay(!playStatus)"></div>
                        <div class="player-tools">
                            <div class="player-bar-wrap">
                                <div class="player-bar-time" v-show="hoverPlayBar" :style="{ left: `${playBarTextOffset - 22}px` }">{{playBarTextTime}}</div>
                                <div class="player-bar">
                                    <div class="player-loaded" :style="{ width: `${loadedPercent}%` }"></div>
                                    <div class="player-played" :style="{ width: `${playedPercent}%` }">
                                        <span class="player-thumb" :style="{ transform: `scale(${hoverPlayBar ? 1 : 0})` }"></span>
                                    </div>
                                    <div class="player-bar-event"
                                        ref="playerBarWrap"
                                        @mouseover="playBarMouseover"
                                        @mouseleave="playBarMouseleave"
                                        @mousedown.prevent="playBarMousedown"></div>
                                </div>
                            </div>
                            <div class="player-tools-bottom">
                                <div class="player-tools-left-wrap">
                                    <button class="video-icon play-btn" v-show="!playStatus" @click.stop="clickPlay(1)">
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 16 32"><path d="M15.552 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z"></path></svg>
                                    </button>
                                    <button class="video-icon play-btn" v-show="playStatus" @click.stop="clickPlay(0)">
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 17 32"><path d="M14.080 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048zM2.88 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048z"></path></svg>
                                    </button>
                                    <div class="volume-btn-wrap" @mouseover="hoverVoiceHandle" @mouseleave="leaveVoiceHandle">
                                        <button class="video-icon volume-btn" @click="clickVolume">
                                            <svg v-if="voiceOffset === 48" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8z"></path></svg>
                                            <svg v-else-if="voiceOffset <= 9" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32">
                                                <path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528zM25.152 16q0 2.72-1.536 5.056t-4 3.36q-0.256 0.096-0.448 0.096-0.48 0-0.832-0.352t-0.32-0.8q0-0.704 0.672-1.056 1.024-0.512 1.376-0.8 1.312-0.96 2.048-2.4t0.736-3.104-0.736-3.104-2.048-2.4q-0.352-0.288-1.376-0.8-0.672-0.352-0.672-1.056 0-0.448 0.32-0.8t0.8-0.352q0.224 0 0.48 0.096 2.496 1.056 4 3.36t1.536 5.056z"></path>
                                            </svg>
                                            <svg v-else xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 21 32"><path d="M13.728 6.272v19.456q0 0.448-0.352 0.8t-0.8 0.32-0.8-0.32l-5.952-5.952h-4.672q-0.48 0-0.8-0.352t-0.352-0.8v-6.848q0-0.48 0.352-0.8t0.8-0.352h4.672l5.952-5.952q0.32-0.32 0.8-0.32t0.8 0.32 0.352 0.8zM20.576 16q0 1.344-0.768 2.528t-2.016 1.664q-0.16 0.096-0.448 0.096-0.448 0-0.8-0.32t-0.32-0.832q0-0.384 0.192-0.64t0.544-0.448 0.608-0.384 0.512-0.64 0.192-1.024-0.192-1.024-0.512-0.64-0.608-0.384-0.544-0.448-0.192-0.64q0-0.48 0.32-0.832t0.8-0.32q0.288 0 0.448 0.096 1.248 0.48 2.016 1.664t0.768 2.528z"></path></svg>
                                        </button>
                                        <div class="player-ctrl-volume-box"
                                            ref="volumeBox"
                                            v-show="hoverVoice" 
                                            @mouseover="hoverVoiceHandle"
                                            @mouseleave="leaveVoiceHandle">
                                            <div class="voice-num" ref="voiceNum">{{parseInt(100 * (1 - voiceOffset / 48))}}</div>
                                            <div class="vertical-bar">
                                                <div class="vertical-track-wrap">
                                                    <div class="track-bar" :style="{ transform: `scaleY(${1 - voiceOffset / 48})` }"></div>
                                                </div>
                                                <div :style="{ transform: `translateY(${voiceOffset}px)`}"
                                                    class="thumb-dot"
                                                    ref="thumbDot"
                                                    @mousedown.prevent="voiceBarMousedown"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="player-time">
                                        <span class="player-stime">{{currentTime}}</span> /
                                        <span class="player-etime">{{duration}}</span>
                                    </span>
                                </div>
                                <div class="player-tools-right-wrap">
                                    <button class="video-icon" style="margin-right: 12px;">
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 33"><path d="M24.965 24.38h-18.132c-1.366 0-2.478-1.113-2.478-2.478v-11.806c0-1.364 1.111-2.478 2.478-2.478h18.132c1.366 0 2.478 1.113 2.478 2.478v11.806c0 1.364-1.11 2.478-2.478 2.478zM6.833 10.097v11.806h18.134l-0.002-11.806h-18.132zM2.478 28.928h5.952c0.684 0 1.238-0.554 1.238-1.239 0-0.684-0.554-1.238-1.238-1.238h-5.952v-5.802c0-0.684-0.554-1.239-1.238-1.239s-1.239 0.556-1.239 1.239v5.802c0 1.365 1.111 2.478 2.478 2.478zM30.761 19.412c-0.684 0-1.238 0.554-1.238 1.238v5.801h-5.951c-0.686 0-1.239 0.554-1.239 1.238 0 0.686 0.554 1.239 1.239 1.239h5.951c1.366 0 2.478-1.111 2.478-2.478v-5.801c0-0.683-0.554-1.238-1.239-1.238zM0 5.55v5.802c0 0.683 0.554 1.238 1.238 1.238s1.238-0.555 1.238-1.238v-5.802h5.952c0.684 0 1.238-0.554 1.238-1.238s-0.554-1.238-1.238-1.238h-5.951c-1.366-0.001-2.478 1.111-2.478 2.476zM32 11.35v-5.801c0-1.365-1.11-2.478-2.478-2.478h-5.951c-0.686 0-1.239 0.554-1.239 1.238s0.554 1.238 1.239 1.238h5.951v5.801c0 0.683 0.554 1.237 1.238 1.237 0.686 0.002 1.239-0.553 1.239-1.236z"></path></svg>
                                    </button>
                                    <button class="video-icon" @click="fullScreenHandle">
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 33"><path d="M6.667 28h-5.333c-0.8 0-1.333-0.533-1.333-1.333v-5.333c0-0.8 0.533-1.333 1.333-1.333s1.333 0.533 1.333 1.333v4h4c0.8 0 1.333 0.533 1.333 1.333s-0.533 1.333-1.333 1.333zM30.667 28h-5.333c-0.8 0-1.333-0.533-1.333-1.333s0.533-1.333 1.333-1.333h4v-4c0-0.8 0.533-1.333 1.333-1.333s1.333 0.533 1.333 1.333v5.333c0 0.8-0.533 1.333-1.333 1.333zM30.667 12c-0.8 0-1.333-0.533-1.333-1.333v-4h-4c-0.8 0-1.333-0.533-1.333-1.333s0.533-1.333 1.333-1.333h5.333c0.8 0 1.333 0.533 1.333 1.333v5.333c0 0.8-0.533 1.333-1.333 1.333zM1.333 12c-0.8 0-1.333-0.533-1.333-1.333v-5.333c0-0.8 0.533-1.333 1.333-1.333h5.333c0.8 0 1.333 0.533 1.333 1.333s-0.533 1.333-1.333 1.333h-4v4c0 0.8-0.533 1.333-1.333 1.333z"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
        <div class="video-bottom-wrap">
            <h4 class="comment-label">剧集</h4>
            <div class="episode-wrap">
                <HomeEpisodeItem v-for="index in endProgress"
                    :key="index"
                    :index="index"
                    :mediaInfo="mediaInfo">
                </HomeEpisodeItem>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router'
import { transTime } from '@/libs/utils'
import { axiosFetchHomeItemById } from '@/libs/api/home.js'

const route = useRoute()

useHead({
    titleTemplate: (productCategory) => {
        return `${route.query.name} ${route.query.season} 第${route.params.num}话 - ${shortName}`
    }
})

const hoverVoice = ref(false)
const hoverVideo = ref(false)
const hoverPlayBar = ref(false)
const playStatus = ref(0)
const duration = ref('00:00')
const currentTime = ref('00:00')
const playBarTextTime = ref('00:00')
const timeInterval = ref(null)
const voiceTimeout = ref(null)
const voiceOffset = ref(0)
const latestVoiceOffset = ref(0)
const latestPlayedPercent = ref(0)
const loadedPercent = ref(0)
const playedPercent = ref(0)
const playBarTextOffset = ref(0)
const startY = ref(null)
const playBarStartX = ref(null)
const videoPlayer = ref(null)
const playerBarWrap = ref(null)
const changeVoiceLock = ref(false)
const dragPlayBarStatus = ref(false)
const playBtnDisAbleStatus = ref(true)
const playBarWidth = ref(1)
const playSourceIndex = ref(0)
const volumeBox = ref(null)
const thumbDot = ref(null)
const voiceNum = ref(null)
const mediaInfo = ref({})

const endProgress = computed(() => {
    let { endProgress = '', episodes = '' } = mediaInfo.value
    endProgress = parseInt(episodes) || parseInt(endProgress) || 0
    return endProgress
})

const source = computed(() => {
    const index = route.params.num
    const source = mediaInfo.value.source || {}
    return source[index] || []
})

const style = computed(() => {
    if (mediaInfo.value.cover) {
        return {
            backgroundImage: `url(${mediaInfo.value.cover})`
        }
    }
    return {}
})

onMounted(async () => {
    playBarWidth.value = playerBarWrap.value.clientWidth
    let res = await axiosFetchHomeItemById({
        id: route.params.id,
    })
    mediaInfo.value = res.data.data
})

const videoError = (e) => {
    ElMessage({
        message: '视频已失效！',
        type: 'error',
        offset: 150,
    })
}
const videoLoadeddata = () => {
    let minutes = parseInt(videoPlayer.value.duration / 60)
    minutes = minutes < 10 ? `0${minutes}` : minutes
    let secons = parseInt(videoPlayer.value.duration % 60)
    secons = secons < 10 ? `0${secons}` : secons
    duration.value = `${minutes}:${secons}`
}
const videoProgress = () => {
    if (videoPlayer.value.buffered.length) {
        loadedPercent.value = videoPlayer.value.buffered.end(0) / videoPlayer.value.duration * 100
    }
}
const videoCanplay = () => {
    if (videoPlayer.value.readyState >= 2) {
        playBtnDisAbleStatus.value = false
    }
}

const hoverVoiceHandle = () => {
    clearTimeout(voiceTimeout.value)
    hoverVoice.value = true
}
const leaveVoiceHandle = () => {
    if (!changeVoiceLock.value) {
        voiceTimeout.value = setTimeout(() => {
            hoverVoice.value = false
        }, 500)
    }
}
const clickPlay = (status) => {
    if (playBtnDisAbleStatus.value) return
    playStatus.value = status
    if (status) {
        videoPlayer.value.play()
        timeInterval.value = setInterval(getCurrentVideoTime.value, 500)
    } else {
        videoPlayer.value.pause()
        clearInterval(timeInterval.value)
    }
}
const getCurrentVideoTime = () => {
    currentTime.value = transTime(videoPlayer.value.currentTime)
    playedPercent.value = videoPlayer.value.currentTime / videoPlayer.value.duration * 100
}
const playBarMouseover = (e) => {
    hoverPlayBar.value = true
    playBarTextOffset.value = e.offsetX
    playBarTextTime.value = transTime(e.offsetX / playBarWidth.value * videoPlayer.value.duration)
    if (playerBarWrap.value) {
        playerBarWrap.value.addEventListener('mousemove', playBarTextMousemove)
    }
}
const playBarTextMousemove = (e) => {
    playBarTextOffset.value = e.offsetX
    playBarTextTime.value = transTime(e.offsetX / playBarWidth.value * videoPlayer.value.duration)
}
const playBarMouseleave = (e) => {
    hoverPlayBar.value = false
    if (playerBarWrap.value) {
        playerBarWrap.value.removeEventListener('mousemove', playBarTextMousemove)
    }
}
const playBarMousedown = (e) => {
    playBarStartX.value = e.clientX
    playedPercent.value = e.offsetX / playBarWidth.value * 100
    latestPlayedPercent.value = playedPercent.value
    document.addEventListener('mousemove', playBarMousemove)
    document.addEventListener('mouseup', playBarMouseup)
}
const playBarMousemove = (e) => {
    playedPercent.value = (e.clientX - playBarStartX.value) / playBarWidth.value * 100 + latestPlayedPercent.value
    if (playedPercent.value > 100) playedPercent.value = 100
    if (playedPercent.value < 0) playedPercent.value = 0
}
const playBarMouseup = (e) => {
    videoPlayer.value.currentTime = videoPlayer.value.duration * playedPercent.value / 100
    currentTime.value = transTime(videoPlayer.value.currentTime)
    document.removeEventListener('mousemove', playBarMousemove)
    document.removeEventListener('mouseup', playBarMouseup)
}
const clickVolume = (e) => {
    if (voiceOffset.value === 48) {
        voiceOffset.value = 0
    } else {
        voiceOffset.value = 48
    }
    videoPlayer.value.volume = voiceOffset.value / 48
}
const voiceBarMousedown = (e) => {
    startY.value = e.clientY
    latestVoiceOffset.value = voiceOffset.value
    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)
    changeVoiceLock.value = true
}
const mousemove = (e) => {
    voiceOffset.value = latestVoiceOffset.value + e.clientY - startY.value
    if (voiceOffset.value > 48) voiceOffset.value = 48
    if (voiceOffset.value < 0) voiceOffset.value = 0
    videoPlayer.value.volume = voiceOffset.value / 48
}
const mouseup = (e) => {
    document.removeEventListener('mousemove', mousemove)
    document.removeEventListener('mouseup', mouseup)
    changeVoiceLock.value = false
    if (e.target !== volumeBox.value && e.target !== thumbDot.value && e.target !== voiceNum.value) {
        hoverVoice.value = false
    }
}
const fullScreenHandle = (e) => {
    if (videoPlayer.value.requestFullScreen) {
        videoPlayer.value.requestFullScreen()
    } else if (videoPlayer.value.mozRequestFullScreen) {
        videoPlayer.value.mozRequestFullScreen()
    } else if (videoPlayer.value.webkitRequestFullScreen) {
        videoPlayer.value.webkitRequestFullScreen()
    }
}
</script>

<style scoped>
.video-page {
    height: 100%;
    overflow-y: auto;
}
.video-top-wrap {
    position: relative;
    padding: 0 20px;
}
.video-back.navigation-btn {
    padding: 12px 0 12px 16px;
}
.video-wrap {
    position: relative;
    overflow: hidden;
}
.video-title {
    position: relative;
    font-size: 16px;
    color: white;
    line-height: 26px;
    padding: 8px 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.video-player {
    width: 100%;
    height: 100%;
    background: #000;
    display: block;
}
.player-tools-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    color: white;
    height: 51px;
}
.player-mask {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==) repeat-x bottom;
    height: 98px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
}
.player-tools {
    position: absolute;
    left: 6px;
    right: 6px;
    bottom: 0;
    z-index: 2;
}
.player-tools-bottom {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 6px 0 4px;
}
.player-tools-left-wrap {
    display: flex;
    align-items: center;
    height: 38px;
}
.player-tools-right-wrap {
    display: flex;
    align-items: center;
    height: 38px;
}
.video-icon {
    width: 32px;
    height: 28px;
    border: none;
    background-color: transparent;
    outline: none;
    cursor: pointer;
    vertical-align: middle;
    box-sizing: border-box;
    display: inline-block;
    opacity: 0.8;
    transition: all ease .3s;
}
.video-icon:hover {
    opacity: 1;
}
.video-wrap svg {
    width: 100%;
    height: 100%;
}
.video-wrap svg circle, .video-wrap svg path {
    fill: #fff;
}
.play-btn {
    width: 26px;
    margin-right: 3px;
}
.fade-enter-active {
    transition: all 0.3s ease-out;
}
.fade-leave-active {
    transition: all 0.3s ease-out;
}
.fade-enter-from, .fade-leave-to {
    transform: translateY(51px);
    opacity: 0;
}
.blurbg-wrap {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    overflow: hidden;
}
.blurbg-wrap::before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.3);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
}
.blurbg-image {
    position: absolute;
    background-size: cover;
    background-position: 50%;
    width: 110%;
    min-width: 1120px;
    height: 100%;
    top: 50%;
    left: 50%;
    margin: -29.3% -55%;
    z-index: 10;
    background-repeat: no-repeat;
    filter: blur(40px);
}
.volume-btn-wrap {
    position: relative;
    margin-right: 12px;
}
.volume-btn {
    width: 42px;
}
.voice-num {
    text-align: center;
    font-size: 12px;
    margin: 8px 0;
}
.player-ctrl-volume-box {
    background: hsla(0, 0%, 8%, .9);
    border-radius: 2px;
    bottom: 41px;
    height: 100px;
    left: 50%;
    margin-left: -16px;
    position: absolute;
    width: 32px;
}
.vertical-bar {
    width: 100%;
}
.vertical-track-wrap {
    background: #e7e7e7;
    border-radius: 1.5px;
    position: absolute;
    width: 2px;
    height: 60px;
    left: 15px;
}
.track-bar {
    background: #00aeec;
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform-origin: 0 100%;
}
.thumb-dot {
    background-color: #00aeec;
    border-radius: 50%;
    height: 12px;
    width: 12px;
    cursor: pointer;
    position: relative;
    bottom: 0;
    left: 10px;
    height: 12px;
    width: 12px;
}
.player-bar-wrap {
    padding: 5px 0;
    cursor: pointer;
    width: 100%;
    height: 3px;
}
.player-bar-time {
    position: absolute;
    left: 0;
    height: 25px;
    line-height: 25px;
    top: -26px;
    border-radius: 4px;
    padding: 0 7px;
    background-color: rgba(0, 0, 0, .62);
    color: #fff;
    font-size: 12px;
    text-align: center;
    opacity: 1;
    transition: opacity .1s ease-in-out;
    word-wrap: normal;
    word-break: normal;
    z-index: 2;
    pointer-events: none;
}
.player-bar {
    position: relative;
    height: 3px;
    width: 100%;
    background: hsla(0, 0%, 100%, .2);
}
.player-loaded {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    height: 3px;
    background: hsla(0, 0%, 100%, .4);
    transition: all .5s ease;
}
.player-played {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    height: 3px;
    background: rgb(183, 218, 255);
}
.player-thumb {
    background: #b7daff;
    position: absolute;
    top: 0;
    right: 5px;
    margin-top: -4px;
    margin-right: -10px;
    height: 11px;
    width: 11px;
    border-radius: 50%;
    cursor: pointer;
    transition: all .3s ease-in-out;
    transform: scale(0);
}
.player-bar-event {
    position: absolute;
    left: 0;
    right: 0;
    top: -5px;
    height: 3px;
    padding: 5px 0;
}
.video-bottom-wrap {
    margin: 0 20px;
}
.comment-label {
    font-size: 18px;
    font-weight: 700;
    margin: 12px 0;
}
.episode-wrap {
    display: flex;
    flex-wrap: wrap;
    border-radius: 2px;
    background-color: #f4f5f7;
    padding: 12px;
    padding-bottom: 0;
    margin-bottom: 12px;
}
.episode-wrap .episode-item {
    margin: 0 12px 12px 0;
}
</style>
