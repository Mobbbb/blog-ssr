<template>
	<div class="not-found-page">
        <div class="not-found-content">
            <h1>{{ error.statusCode }}</h1>
            <blockquote>页面出错了. That's a {{errorArr.join('-')}}.</blockquote>
            <div class="back-text" @click="handleError">Take me home.</div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
  	error: Object
})

const map = {
	'0': 'Oh',
	'1': 'One',
	'2': 'Two',
	'3': 'Three',
	'4': 'Four',
	'5': 'Five',
	'6': 'Six',
	'7': 'Seven',
	'8': 'Eight',
	'9': 'Nine',
}

const errorCodeArr = props.error.statusCode.toString().split('')
const errorArr = []
errorCodeArr.forEach(item => {
	errorArr.push(map[item])
})

const handleError = () => clearError({ redirect: '/' })
</script>

<style scoped>
.not-found-page {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding-bottom: 20vh;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
}
h1 {
   color: #2c3e50;
   font-size: 32px;
   font-weight: 600;
}
blockquote {
    font-size: 16px;
    color: #999;
    border-left: 4px solid #dfe2e5;
    margin: 12px 0;
    padding: 8px 0 8px 12px;
}
.back-text {
    color: #3eaf7c;
    font-weight: 500;
    font-size: 16px;
    transition: color .2s ease;
}
.back-text:hover {
    cursor: pointer;    
    color: #79cea8;
}
.back-text:active {
    color: #198e59;
}
</style>
