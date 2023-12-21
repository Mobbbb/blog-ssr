export const homeRoute = {
    path: '/',
    name: 'home',
    meta: {
        level: 0,
        name: '首页',
        navSearchMutualExclusion: true,
    },
}

export const movieRoute = {
    path: "/movie/",
    name: "movie",
    meta: {
        level: 0,
        name: '电影',
    },
}

export const summaryRoute = {
    path: "/summary/",
    name: "summary",
    meta: {
        level: 0,
        name: '总结',
        navSearchMutualExclusion: false, // 页脚筛选是否与nav筛选互斥，同时也是是否显示页脚筛选的标志
    },
}

export const summaryDetailRoute = {
    path: "/summary/detail",
    name: "summary-detail-id",
    meta: {
        level: 1,
        name: '总结详情',
        parent: 'summary',
    },
}

export const movieDetailRoute = {
    path: "/movie/detail/:name",
    name: "movie-detail-name",
    meta: {
        level: 1,
        name: '电影详情',
        parent: 'movie',
    },
}

export const homeDetailRoute = {
    path: "/home/detail/:id",
    name: "home-detail-id",
    meta: {
        level: 1,
        name: '动漫详情',
        parent: 'index',
    },
}

export const videoPlayRoute = {
    path: "/video/:id/:index",
    name: "videoPlay",
    meta: {
        level: 2,
        name: '播放页',
        parent: '',
    },
}

export const notFoundRoute = {
    path: "/:pathMatch(.*)",
    name: '',
    meta: {
        level: -1,
    },
}

export const routeConfig = [
    homeRoute,
    homeDetailRoute,
    movieRoute,
    movieDetailRoute,
    summaryRoute,
    summaryDetailRoute,
    videoPlayRoute,
    notFoundRoute,
]

const _routeMap_: {[propName: string]: any} = {}
routeConfig.map(item => {
    _routeMap_[item.name] = item
})
_routeMap_.index = homeRoute
export const routeMap = _routeMap_
