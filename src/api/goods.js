import request from '@/utils/request';

export function getCategoriesList(params) {
	return request({
		url: '/goods/getCategoriesList',
		method: 'get',
		params
	});
}

export function getCategories(params) {
	return request({
		url: '/goods/getCategories',
		method: 'get',
		params
	});
}

export function editCategories(data) {
	return request({
		url: '/goods/editCategories',
		method: 'post',
		data
	});
}

export function removeCategories(id) {
	return request({
		url: '/goods/removeCategories',
		method: 'post',
		data: { id }
	});
}

export function getGoodsList(params) {
	return request({
		url: '/goods/getList',
		method: 'get',
		params
	});
}

export function getGoods(id) {
	return request({
		url: '/goods/getInfo',
		method: 'get',
		params: { id }
	});
}

export function editGoods(data) {
	return request({
		url: '/goods/edit',
		method: 'post',
		data
	});
}
