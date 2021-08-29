import request from '@/utils/request';

export function getUserData(params) {
	return request({
		url: '/statistics/userData',
		method: 'get',
		params
	});
}
export function getOrderData(params) {
	return request({
		url: '/statistics/orderData',
		method: 'get',
		params
	});
}
export function getFinanceData(params) {
	return request({
		url: '/statistics/financeData',
		method: 'get',
		params
	});
}
