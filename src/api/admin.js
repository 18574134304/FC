import request from '@/utils/request';

export function getAdminList(params) {
	return request({
		url: '/admin/administrator',
		method: 'get',
		params
	});
}

export function updateAdmin(data) {
	return request({
		url: '/admin/administrator/' + data.id,
		method: 'put',
		data
	});
}

export function createAdmin(data) {
	return request({
		url: '/admin/administrator/',
		method: 'post',
		data
	});
}

export function delAdmin(id) {
	return request({
		url: '/admin/administrator/' + id,
		method: 'delete'
	});
}

export function restoreAdmin(data) {
	return request({
		url: '/admin/administrator/',
		method: 'post',
		data
	});
}

// 部门
export function getRoleList(params) {
	return request({
		url: '/admin/adminRole',
		method: 'get',
		params
	});
}

export function updateRole(data) {
	return request({
		url: '/admin/adminRole/' + data.id,
		method: 'put',
		data
	});
}

export function createRole(data) {
	return request({
		url: '/admin/adminRole/',
		method: 'post',
		data
	});
}

export function delRole(id) {
	return request({
		url: '/admin/adminRole/' + id,
		method: 'delete'
	});
}

export function restoreRole(data) {
	return request({
		url: '/admin/adminRole/',
		method: 'post',
		data
	});
}
