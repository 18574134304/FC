import request from '@/utils/request';

export function getGroupList(params) {
	return request({
		url: '/group/groupBuy',
		method: 'get',
		params
	});
}

export function addGroup(data) {
	return request({
		url: '/group/groupBuy',
		method: 'post',
		data
	});
}

export function updateGroup(data) {
	return request({
		url: '/group/groupBuy/' + data.id,
		method: 'put',
		data
	});
}

// 获取团内人员列表
export function getGroupMemberList(id) {
	return request({
		url: '/group/groupMemberList/' + id,
		method: 'get'
	});
}

// 设置主团
export function setMaster(id) {
	return request({
		url: '/group/setMaster/' + id,
		method: 'get'
	});
}

// 取当前自动入团队列人数
export function autoSnapListLength() {
	return request({
		url: '/group/autoSnapListLength',
		method: 'get'
	});
}

// 获取会员列表
export function getSearchUser(phone_number) {
	return request({
		url: '/user/userSearch/' + phone_number,
		method: 'get'
	});
}

// 解散团
export function dissolutionGroup(params) {
	return request({
		url: '/group/dissolutionGroup/' + params.id,
		method: 'get'
	});
}

