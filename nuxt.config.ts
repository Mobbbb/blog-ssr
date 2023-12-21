import prismjs from 'vite-plugin-prismjs'
import { shortName, pageTitle } from './utils/constant'

const BabelConfigLanguages = ['javascript', 'css', 'markup', 'nginx', 'bash']
const APP_HOST = '//mobbbb.top'

const injectSw = process.env.NODE_ENV === 'production' ? {
	children: `window.addEventListener('load', function() {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/sw.js')
		}
	})`,
} : {}

export default defineNuxtConfig({
	app: {
		rootId: 'app',
		head: {
			title: pageTitle,
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no',
			meta: [
				{
					name: 'keywords',
					content: '动漫新番,动漫评价,电影评价,动漫推荐,新番推荐,动漫,新番,动画,日本动漫,番剧,番组,二次元,ANIME',
			  	},
			  	{
					name: 'description',
					content: 'Mobbbb,动漫新番,动漫推荐,新番推荐,电影评价,动漫评价',
				},
				{
					name: 'apple-mobile-web-app-title',
					content: shortName,
				},
				{
					name: 'theme-color',
					content: '#ede5e0',
				},
			],
			link: [
				{ rel: 'icon', href: '/favicon.jpg' },
				{ rel: 'manifest', href: '/manifest.json' },
				{ rel: 'apple-touch-icon', href: `${APP_HOST}/resource/home-assets/images/manifest-192x192.png` },
				{ rel: 'apple-touch-startup-image', href: `${APP_HOST}/resource/home-assets/images/setup.jpg` },
			],
			script: [injectSw],
		},
	},
	devtools: {
		enabled: true,
	},
	css: ['~/assets/css/index.css', '~/assets/css/media.css'],
	modules: [
		'@element-plus/nuxt',
		'@pinia/nuxt',
	],
	runtimeConfig: {
		public: {
			BabelConfigLanguages,
		},
	},
	vite: {
		plugins: [
			prismjs({
				languages: BabelConfigLanguages,
				plugins: ['line-numbers'],
				theme: 'solarizedlight', // default|coy|twillight|tomorrow|solarizedlight|okaidia|funky|dark
				css: true,
			}),
		],
		server: { // 本地请求服务器代理
			proxy: {
				'/resource': {
					target: `https:${APP_HOST}`,
					changeOrigin: true,
				},
				'/api': {
					target: `https:${APP_HOST}`,
					changeOrigin: true,
				},
			},
		},
	},
	nitro: {
		routeRules: { // 服务器请求代理
			'/resource/**': {
				proxy: `https:${APP_HOST}/resource/**`,
			},
			'/api/**': {
				proxy: `https:${APP_HOST}/api/**`,
			},
		},
	},
})
