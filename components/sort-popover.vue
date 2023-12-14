<template>
    <el-popover :visible="showPopover"
                popper-class="header-sort-popover"
                trigger="click"
                placement="left-start"
                :width="100"
                :offset="2"
                :show-arrow="false">
        <template #reference>
            <el-button class="header-icon-btn border-none-btn" @click.stop="popoverHandle" :icon="Sort"></el-button>
        </template>
        <div v-for="item in data" 
            :class="modelValue === item.value ? 'active-sort-item' : ''"
            :key="item.value" 
            class="sort-selection-item"
            @click.stop="selectSortType(item.value)">
            {{item.label}}
        </div>
    </el-popover>
</template>

<script>
import { Sort } from '@element-plus/icons-vue'

export default {
    name: 'sort-popover',
    props: {
        modelValue: {
            type: String,
            default: '',
        },
        data: {
            type: Array,
            default: [],
        },
    },
    setup(props, { emit }) {
        const showPopover = ref(false)

        const closePopver = () => {
            showPopover.value = false
            document.removeEventListener('click', closePopver)
        }
        
        const popoverHandle = () => {
            showPopover.value = true
            document.addEventListener('click', closePopver)
        }

        const selectSortType = (value) => {
            closePopver()
            emit('update:modelValue', value)
            emit('on-select', value)
        }

        return {
            showPopover,
            selectSortType,
            popoverHandle,
            Sort: markRaw(Sort),
        }
    },
}
</script>

<style scoped>
.header-icon-btn {
    font-size: 16px;
    cursor: pointer;
    transition: color .2s ease,background-color .2s ease;
    height: 16px;
    color: var(--el-color-primary);
}
.sort-selection-item {
    font-size: 14px;
    padding: 6px 12px;
}
.sort-selection-item:hover {
    cursor: pointer;
    background-color: #ecf5ff;
    color: #66b1ff;
}
.active-sort-item {
    color: #409eff;
}
</style>

<style>
.el-popover.el-popper.header-sort-popover {
    min-width: 10px!important;
    padding: 6px 0!important;
}
</style>
