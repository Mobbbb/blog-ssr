import axios from '@/utils/api.request'

export const fetchMovieListData = async () => {
    const response = await useFetch('/resource/movie-assets/movie-data.json')
    return response.data.value || []
}

export const axiosFetchMovieListData = () => {
    return axios.request({
        url: '/resource/movie-assets/movie-data.json',
        method: 'get',
    })
}

export const fetchMovieItemByName = async (name) => {
    const { data: response, pending } = await useLazyFetch('/api/blog/movie/getMovieByName', {
        query: {
            name,
        },
        method: 'get',
        key: `movie:${name}`,
    })
    return {
        response,
        pending,
    }
}
