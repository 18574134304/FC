import request from '@/utils/request';

export function getUserList(params) {
	return request({
		url: '/user/user',
		method: 'get',
		params
	});
}

export function updateUser(data) {
	return request({
		url: '/user/user/' + data.id,
		method: 'put',
		data
	});
}

export function createUser(data) {
	return request({
		url: '/user/user/',
		method: 'post',
		data
	});
}

export function delUser(id) {
	return request({
		url: '/user/user/' + id,
		method: 'delete'
	});
}

export function restoreUser(data) {
	return request({
		url: '/user/user/',
		method: 'post',
		data
	});
}

// 获取下级代理
export function getUserAgentList(id) {
	return request({
		url: '/user/userAgent/' + id,
		method: 'get'
	});
}

// ----------- End --------

// 获取收货地址
export function getUserAddrList(params) {
	return request({
		url: '/user/userAddresses',
		method: 'get',
		params
	});
}

export function createUserAddr(data) {
	return request({
		url: '/user/userAddresses/',
		method: 'post',
		data
	});
}

export function updateUserAddr(data) {
	return request({
		url: '/user/userAddresses/' + data.id,
		method: 'put',
		data
	});
}

export function delUserAddr(id) {
	return request({
		url: '/user/userAddresses/' + id,
		method: 'delete'
	});
}

export function restoreUserAddr(data) {
	return request({
		url: '/user/userAddresses/',
		method: 'post',
		data
	});
}

// ----------- End --------

// 获取用户提现信息
export function getUserWithdrawAccountList(params) {
	return request({
		url: '/user/userWithdrawAccount',
		method: 'get',
		params
	});
}

export function createUserWithdrawAccount(data) {
	return request({
		url: '/user/userWithdrawAccount/',
		method: 'post',
		data
	});
}

export function updateUserWithdrawAccount(data) {
	return request({
		url: '/user/userWithdrawAccount/' + data.id,
		method: 'put',
		data
	});
}

export function delUserUserWithdrawAccount(id) {
	return request({
		url: '/user/userWithdrawAccount/' + id,
		method: 'delete'
	});
}

export function restoreUserWithdrawAccount(data) {
	return request({
		url: '/user/userWithdrawAccount/',
		method: 'post',
		data
	});
}
// ----------- End --------

// 获取资金流水
export function getUserRechargeList(params) {
	return request({
		url: '/user/userRecharge',
		method: 'get',
		params
	});
}

// ----------- End --------

// 用户等级
export function getUserLevelsList(params) {
	return request({
		url: '/user/userLevel',
		method: 'get',
		params
	});
}

export function createLevel(data) {
	return request({
		url: '/user/userLevel/',
		method: 'post',
		data
	});
}

export function updateLevel(data) {
	return request({
		url: '/user/userLevel/' + data.id,
		method: 'put',
		data
	});
}

export function delLevel(id) {
	return request({
		url: '/user/userLevel/' + id,
		method: 'delete'
	});
}

