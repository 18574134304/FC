import request from '@/utils/request';

export function getTaskList(params) {
	return request({
		url: '/task',
		method: 'get',
		params
	});
}

export function addTask(data) {
	return request({
		url: '/task',
		method: 'post',
		data
	});
}
