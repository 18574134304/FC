import request from '@/utils/request';

// 控制面板
export function getIndex() {
	return request({
		url: '/index',
		method: 'get'
	});
}
