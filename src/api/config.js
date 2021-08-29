import request from '@/utils/request';

export function getConfigCategories(params) {
	return request({
		url: '/config/categories',
		method: 'get',
		params
	});
}

export function getConfig(params) {
	return request({
		url: '/config',
		method: 'get',
		params
	});
}

export function editConfig(data) {
	return request({
		url: '/config/' + data[0].id,
		method: 'put',
		data
	});
}

export function addConfig(data) {
	return request({
		url: '/config',
		method: 'post',
		data
	});
}

export function editConfigCategories(data) {
	return request({
		url: '/config/categories/' + data.id,
		method: 'put',
		data
	});
}

export function addConfigCategories(data) {
	return request({
		url: '/config/categories',
		method: 'post',
		data
	});
}
