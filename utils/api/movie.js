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

export const fetchMovieItemById = async (id) => {
    const { data: response, pending } = await useLazyFetch('/api/blog/movie/getMovieById', {
        query: {
            id,
        },
        method: 'get',
        key: `movie:${id}`,
    })
    return {
        response,
        pending,
    }
}
