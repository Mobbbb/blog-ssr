<template>
    <div class="home-header-wrap">
        <template v-if="searchFlag">
            <div class="home-header">
                <span>搜索结果</span>
                <div class="search-tips">共找到<span>{{showAnimationList.length}}</span>条记录</div>
            </div>
            <div class="date-picker-wrap">
                <SortPopover v-model="_selectedSortType" :data="sortListConfig"></SortPopover>
            </div>
        </template>
        <template v-else>
            <div class="home-header">
                <span class="home-header-title">番剧评价</span>
                <div v-for="item in months"
                    class="month-item"
                    :key="item.value" 
                    :class="monthClass(item.value)"
                    @click="selectedMonth(item.value)">{{item.name}}</div>
            </div>
            <div class="date-picker-wrap">
                <el-button  title="left date picker"
                            :icon="DArrowLeft" 
                            class="header-icon-btn change-date-icon border-none-btn" 
                            @click="changeYearsByStep(-1)" :disabled="prevYearBtnDisabled">
                </el-button>
                <el-date-picker v-model="selectedYears"
                                type="year"
                                size="small"
                                placeholder="日期选择"
                                style="width: 100px;"
                                :clearable="false"
                                :disabled-date="disabledDate"
                                value-format="YYYY"
                                @change="changeYears">
                </el-date-picker>
                <el-button  title="right date picker"
                            :icon="DArrowRight" 
                            class="header-icon-btn change-date-icon border-none-btn" 
                            @click="changeYearsByStep(1)" :disabled="nextYearBtnDisabled">
                </el-button>
            </div>
        </template>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { DArrowLeft, DArrowRight } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
import { sortCallback } from 'umob'

export default {
    name: 'home-header',
    data() {
        return {
            months,
            sortListConfig,
            DArrowLeft: markRaw(DArrowLeft),
            DArrowRight: markRaw(DArrowRight),
        }
    },
    computed: {
        ...mapState('home', [
            'activeMonth',
            'selectedSortType',
            'availableDate',
        ]),
        ...mapState('app', [
            'searchFlag',
        ]),
        ...mapGetters('home', [
            'showAnimationList',
        ]),
        selectedYears: {
            get() {
                return this.$store.state.home.selectedYears
            },
            set(value) {
                this.updateYears(value)
            },
        },
        disabledDate() {
            return (time) => {
                return !this.availableDate.years.includes(time.getFullYear().toString())
            }
        },
        prevYearBtnDisabled() {
            const minYear = this.availableDate.years[0]
            const monthArr = this.availableDate.yearMonths[minYear] || []
            const minMonth = [...monthArr].sort(sortCallback({ type: 'asc' }))[0]

            return (minYear > this.selectedYears) ||
                (minYear === this.selectedYears && Number(this.activeMonth) <= Number(minMonth))
        },
        nextYearBtnDisabled() {
            const maxYear = this.availableDate.years[this.availableDate.years.length - 1]
            const monthArr = this.availableDate.yearMonths[maxYear] || []
            const maxMonth = [...monthArr].sort(sortCallback())[0]

            return (maxYear < this.selectedYears) ||
                (maxYear === this.selectedYears && Number(this.activeMonth) >= Number(maxMonth))
        },
        monthClass() {
            return (month) => {
                let className = ''
                if (!this.availableDate.months[`${this.selectedYears}-${month}`]) {
                    className += 'month-disable-link'
                }
                if (this.activeMonth === month) {
                    className += ' active-link'
                }
                return className
            }
        },
        _selectedSortType: {
            get() {
                return this.selectedSortType
            },
            set(value) {
                this.updateSelectedSortType(value)
                this.sortDataBySortType()
            }
        },
    },
    methods: {
        ...mapMutations('home', [
            'updateActiveMonth',
            'updateYears',
            'updateSelectedSortType',
        ]),
        ...mapActions('home', [ 
            'changeYearsHandle',
            'sortDataBySortType',
        ]),
        changeYearsByStep(value) {
            this.changeYearsHandle(value)
        },
        selectedMonth(value) {
            if (this.availableDate.months[`${this.selectedYears}-${value}`]) {
                this.updateActiveMonth(value)
            }
        },
        changeYears() {
            if (!this.availableDate.months[`${this.selectedYears}-${this.activeMonth}`]) {
                const monthArr = this.availableDate.yearMonths[this.selectedYears] || []
                this.updateActiveMonth([...monthArr].sort(sortCallback({ type: 'asc' }))[0])
            }
        },
    },
}
</script>

<style scoped>
.home-header-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
}
.home-header > span{
    font-size: 20px;
    color: #222;
    line-height: 26px;
    margin-right: 20px;
}
.home-header .search-back {
    position: absolute;
    left: 0;
}
.home-header .search-tips {
    display: inline-block;
    color: #909399;
    font-size: 12px;
    margin-left: -8px;
}
.home-header .search-tips span {
    color: #4c8fe8;
    margin: 0 4px;
    font-weight: 700;
}
.home-header .month-item {
    font-size: 12px;
    margin-right: 24px;
    line-height: 20px;
    cursor: pointer;
    position: relative;
    vertical-align: top;
    display: inline-block;
}
.home-header .month-item:last-of-type {
    margin-right: 0;
}
.home-header .month-item:hover {
    color: #00a1d6;
}
.home-header .month-disable-link {
    cursor: not-allowed;
    color: var(--el-text-color-placeholder);
}
.home-header .month-disable-link:hover {
    color: var(--el-text-color-placeholder);
}
.home-header .active-link {
    color: #00a1d6;
    border-bottom: 1px solid #00a1d6;
}
.home-header .active-link::before {
    content: "";
    display: block;
    position: absolute;
    left: 50%;
    margin-left: -4px;
    bottom: -1px;
    width: 0;
    height: 0;
    border-bottom: 4px solid #00a1d6;
    border-top: 0;
    border-left: 4px dashed transparent;
    border-right: 4px dashed transparent;
}

.date-picker-wrap {
    display: flex;
    align-items: center;
}
.header-icon-btn {
    font-size: 16px;
    cursor: pointer;
    transition: color .2s ease,background-color .2s ease;
    height: 16px;
}
.change-date-icon {
    color: #DCDFE6;
}
.change-date-icon:hover {
    color: #C0C4CC;
}
.change-date-icon:first-of-type {
    margin-right: 6px;
}
.change-date-icon:last-of-type {
    margin-left: 6px;
}
</style>
