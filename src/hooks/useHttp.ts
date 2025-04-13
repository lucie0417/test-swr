import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import apiClient from "../utils/axiosInterceptors";

export interface FetchArgs {
	url: string,
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
	payload?: any,
	enabled?: boolean,
}

export const useHttp = () => {
	const fetcher = (url: string, method: 'get' | 'post' | 'put' | 'delete' = 'get', option?: any) => {
		return apiClient[method](url, option)
			.then((res) => res)
			.catch(err => {
				if (err.status === 404) {
					console.warn('Bad Request');
				} else if (err.status === 401) {
					console.warn('Unauthorized');
				} else if (err.status === 403) {
					console.warn('Forbidden');
				} else {
					throw err;
				}
			})
	}

	const postFetcher = (url: string, { arg }: { arg: any }) => {
		return fetcher(url, 'post', arg);
	}

	// const putFetcher = (url: string, { arg }: { arg: any }) => {
	// 	return fetcher(url, 'put', { data: arg });
	// }

	const putFetcher = (url: string, { arg }: { arg: any }) => {
		const finalUrl = `${url}/${arg.id}`;
		return fetcher(finalUrl, 'put', { data: arg });
	}

	return {
		getSwr: (
			url: string | null,
			config?: SWRConfiguration
		) => {
			return useSWR(url, fetcher, {
				...config
			});
		},
		postSwr: (
			url: string | null,
		) => {
			return useSWRMutation(url, postFetcher);
		},
		putSwr: (
			url: string | null
		) => {
			return useSWRMutation(url, putFetcher);
		},
	}

}