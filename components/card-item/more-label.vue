<template>
    <el-popover
        ref="popover"
        placement="top"
        :width="226"
        trigger="hover">
        <DescLabel  v-for="label in data.hoverShowLabel" 
                    :marginRight="descLabelMarginRight" 
                    :name="label"
                    :key="label">
        </DescLabel>
        <template #reference>
            <div class="more-label" :style="{ width: `${moreLabelWidth}px` }">
                <el-icon><More /></el-icon>
            </div>
        </template>
    </el-popover>
</template>

<script>
import DescLabel from './desc-label.vue'
import { More } from '@element-plus/icons-vue'

export default {
    name: 'more-label',
    props: ['style', 'data'],
    components: {
        DescLabel,
        More,
    },
    data() {
        return {
            ...this.style,
        }
    },
    methods: {
        
    }
}
</script>

<style scoped>
.more-label {
    height: 16px;
    line-height: 16px;
    font-size: 12px;
    display: inline-block;
    color: #c0c0c0;
    text-align: center;
    margin-bottom: 2px;
    overflow: hidden;
    transform: scale(1, 0.5);
    flex-shrink: 0;
}
.more-label:hover {
    cursor: pointer;
}
</style>
