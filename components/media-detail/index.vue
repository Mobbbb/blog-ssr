<template>
    <div class="media-header-wrap">
        <BackBtn class="media-detail-navigation-btn"></BackBtn>
        <div class="blurbg-wrap"><div class="blurbg-image" :style="style"></div></div>
        <div class="media-content-wrap">
            <div class="detail-img-wrap">
                <img :src="imageUrl" class="content-image">
                <div class="detail-versions-icon" v-if="!params.waitToScore">
                    {{rateScoreConfig.formatTooltip(params.score, true)}}
                </div>
            </div>
            <div class="media-content-right">
                <div class="media-header-title-wrap">
                    <span class="media-header-title">{{params.name}} <span v-if="params.season">{{params.season}}</span></span>
                </div>
                <div v-if="maxWidth544" class="marginTop8 more-than-width544">
                    <CardItemDescLabel :name="item.name" v-for="item in descLabel" :key="item.name"></CardItemDescLabel>
                </div>
                <div class="media-info-count-wrap">
                    <div class="media-info-count-left">
                        <div class="media-info-count-item">
                            <div>开播日期</div>
                            <div>{{params.years}}年<span v-if="params.month">{{params.month}}月</span></div>
                        </div>
                        <div class="media-info-count-item">
                            <div>地区 / 国家</div>
                            <div>{{params.country}}</div>
                        </div>
                        <div class="media-info-count-item">
                            <div>媒体类型</div>
                            <div>{{mediaType}}</div>
                        </div>
                    </div>
                    <div class="media-info-count-right">
                        <div class="wait-to-score" v-if="params.waitToScore">待评分~</div>
                        <template v-else>
                            <span class="media-info-score">{{params.score}}</span>
                            <div class="media-info-score-wrap">
                                <el-rate class="media-rate" :model-value="params.score" disabled text-color="#ff9900"></el-rate>
                                <div class="media-info-score-label">{{scoreTime}}</div>
                            </div>
                        </template>
                    </div>
                </div>
                <div class="more-than-width544" v-if="maxWidth544">
                    <div class="actor-wrap" v-if="params.actors">
                        演员：<span v-for="item in params.actors" :key="item" class="actor-label">{{item}}</span>
                    </div>
                    <div class="score-wrap" v-if="isAnimation && (scoreLabel.length || isFullCredit)">
                        计分项：
                        <span v-for="item in scoreLabel" :key="item" class="actor-label">{{item}}</span>
                        <span v-if="isFullCredit" class="actor-label">暂无</span>
                    </div>
                    <div class="progress-wrap" v-if="isAnimation">
                        <span>{{progressLabel}}</span><i></i><span>{{episodes}}</span>
                    </div>
                    <div class="description-wrap">简介：{{params.description || '暂无'}}</div>
                </div>
            </div>
        </div>
        <div class="less-than-width544" v-if="!maxWidth544">
            <div class="label-wrap">
                <span class="label-title">标签：</span>
                <CardItemDescLabel :name="item.name" v-for="item in descLabel" :key="item.name"></CardItemDescLabel>
            </div>
            <div class="label-wrap" v-if="params.actors">
                <span class="label-title">演员：</span>
                <CardItemDescLabel v-for="item in params.actors" :key="item" :name="item"></CardItemDescLabel>
            </div>
            <div class="label-wrap" v-if="isAnimation && (scoreLabel.length || isFullCredit)">
                <span class="label-title">计分项：</span>
                <CardItemDescLabel v-for="item in scoreLabel" :key="item" :name="item"></CardItemDescLabel>
                <CardItemDescLabel v-if="isFullCredit" name="暂无"></CardItemDescLabel>
            </div>
            <div class="progress-wrap" v-if="isAnimation">
                <span>{{progressLabel}}</span><i></i><span>{{episodes}}</span>
            </div>
            <div class="description-wrap">
                <div class="description-title">简介</div>
                <div class="description-content">{{params.description || '暂无'}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { sequelCheck } from '@/libs/data-processing'

export default {
    name: 'media-detail',
    props: {
        params: {
            default: () => {
                return {}
            },
            type: Object,
        },
        animationList: {
            default: () => {
                return []
            },
            type: Array,
        }
    },
    data() {
        return {
            rateScoreConfig,
            mediaTypeConfig,
        }
    },
    computed: {
        descLabel() {
            const hoverShowLabel = this.params.hoverShowLabel || []
            return hoverShowLabel.map(item => ({ name: item }))
        },
        scoreLabel() {
            let sequelIndex = -1
            const { scoreLabel = [] } = this.params
            scoreLabel.forEach((item, index) => {
                if (specialScoreLabel.noEnding.includes(item)) {
                    if (sequelCheck({ data: this.animationList, currentData: this.params })) { // 有续集
                        sequelIndex = index
                    }
                }
            })  

            if (sequelIndex > -1) { // 有续集，去除无续集计分标签
                scoreLabel.splice(sequelIndex, 1)
                return scoreLabel
            }
            
            return scoreLabel
        },
        imageUrl() {
            return this.params.cover || ''
        },
        mediaType() {
            let label = ''
            this.mediaTypeConfig.forEach(item => {
                if (item.value === this.params.type) {
                    label = item.label
                }
            })
            return label
        },
        isAnimation() {
            return this.params.type === animationConfig.value
        },
        progressLabel() {
            let label = ''
            if (this.params.endProgress === this.params.episodes) {
                label = '已看完'
            } else if (this.params.watching) {
                label = `观看至${this.params.endProgress}话`
            } else {
                label = `终止于${this.params.endProgress}话`
            }

            return label
        },
        episodes() {
            return Number.isFinite(Number(this.params.episodes)) ? `共${this.params.episodes}话` : '连载中'
        },
        isFullCredit() {
            return !this.params.waitToScore && !this.scoreLabel.length
        },
        maxWidth544() {
            // const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
            return 1//width > 544
        },
        scoreTime() {
            const month = this.params.month < 10 ? `0${this.params.month}` : this.params.month
            return this.params.scoreTime || (month ? `${this.params.years}-${month}` : this.params.years)
        },
        style() {
            if (this.imageUrl) {
                return {
                    backgroundImage: `url(${this.imageUrl})`
                }
            }
            return {}
        },
    },
    methods: {

    },
}
</script>

<style scoped>
@import './media.css';
</style>
