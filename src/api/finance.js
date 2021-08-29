import request from '@/utils/request';

// 资金流水列表
export function getStatementList(params) {
	return request({
		url: '/finance/userStatement',
		method: 'get',
		params
	});
}

// ----------- End --------

// 提现列表
export function getWithdrawList(params) {
	return request({
		url: '/finance/userWithdraw',
		method: 'get',
		params
	});
}

export function updateUserWithdraw(data) {
	return request({
		url: '/finance/userWithdraw/' + data.id,
		method: 'put',
		data
	});
}

// ----------- End --------
// 用户报表
export function getUserReport(params) {
	return request({
		url: '/finance/getUserReport',
		method: 'get',
		params
	});
}
// 订单报表
export function getOrderReport(params) {
	return request({
		url: '/finance/getOrderReport',
		method: 'get',
		params
	});
}
// 红包报表
export function getRedPackReport(params) {
	return request({
		url: '/finance/getRedPackReport',
		method: 'get',
		params
	});
}
// 奖励报表
export function getRewardReport(params) {
	return request({
		url: '/finance/getRewardReport',
		method: 'get',
		params
	});
}
// 分红报表
export function getDividendsReport(params) {
	return request({
		url: '/finance/getDividendsReport',
		method: 'get',
		params
	});
}
// 下载报表
export function downloadReport(params) {
	return request({
		url: '/finance/downloadReport',
		method: 'get',
		params
	});
}
