import request from '@/utils/request';

export function getMerchantList(params) {
	return request({
		url: '/shop/merchant',
		method: 'get',
		params
	});
}

export function updateMerchant(data) {
	return request({
		url: '/shop/merchant/' + data.id,
		method: 'put',
		data
	});
}

export function createMerchant(data) {
	return request({
		url: '/shop/merchant/',
		method: 'post',
		data
	});
}

export function delMerchant(id) {
	return request({
		url: '/shop/merchant/' + id,
		method: 'delete'
	});
}

export function restoreMerchant(data) {
	return request({
		url: '/shop/merchant/',
		method: 'post',
		data
	});
}

// ----------- End --------

// 店铺列表
export function getShopList(params) {
	return request({
		url: '/shop/shop',
		method: 'get',
		params
	});
}

// export function updateShop(data) {
// 	return request({
// 		url: '/shop/shop/' + data.id,
// 		method: 'put',
// 		data
// 	});
// }

export function updateShop(params) {
	return request({
		url: '/shop/changeStatus',
		method: 'post',
		params
	});
}

export function updateShopProfit(data) {
	return request({
		url: '/shop/shop/' + data.id,
		method: 'put',
		data
	});
}

export function createShop(data) {
	return request({
		url: '/shop/shop/',
		method: 'post',
		data
	});
}

export function delShop(id) {
	return request({
		url: '/shop/shop/' + id,
		method: 'delete'
	});
}

export function restoreShop(data) {
	return request({
		url: '/shop/shop/',
		method: 'post',
		data
	});
}

// ----------- End --------

// 店铺认证信息
export function getShopProfile(id) {
	return request({
		url: '/shop/shopProfile/' + id,
		method: 'get'
	});
}
