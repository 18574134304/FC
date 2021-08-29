import request from '@/utils/request';

// 订单列表
export function getOrderList(params) {
	return request({
		url: '/order/order',
		method: 'get',
		params
	});
}

export function updateOrder(data) {
	return request({
		url: '/order/order/' + data.id,
		method: 'put',
		data
	});
}

export function RefundOrder(params) {
	return request({
		url: '/order/refund/' + params.id,
		method: 'get'
	});
}

export function updateOrderPrice(data) {
	return request({
		url: '/order/order/' + data.id,
		method: 'put',
		data
	});
}

export function updateOrderStatus(data) {
	return request({
		url: '/order/order/' + data.id,
		method: 'put',
		data
	});
}

// ----------- End --------
