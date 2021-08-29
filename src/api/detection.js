import request from '@/utils/request';

export function getDetectionList(params) {
	return request({
		url: '/detection/detection',
		method: 'get',
		params
	});
}
export function getDetectionDetail(id) {
	return request({
		url: '/detection/detection/' + id,
		method: 'get'
	});
}
export function createdDetection(data) {
	return request({
		url: '/detection/detection',
		method: 'post',
		data
	});
}
export function updateDetection(data) {
	return request({
		url: '/detection/detection/' + data.id,
		method: 'put',
		data
	});
}
export function delDetection(id) {
	return request({
		url: '/detection/detection/' + id,
		method: 'delete'
	});
}
export function restoreDetection(data) {
	return request({
		url: '/detection/detection',
		method: 'post',
		data
	});
}
// -----------------END

// 分类
export function getDetectionCategoryList(params) {
	return request({
		url: '/detection/detectionCategory',
		method: 'get',
		params
	});
}
export function getDetectionCategoryDetail(id) {
	return request({
		url: '/detection/detectionCategory/' + id,
		method: 'get'
	});
}
export function createdDetectionCategory(data) {
	return request({
		url: '/detection/detectionCategory',
		method: 'post',
		data
	});
}
export function updateDetectionCategory(data) {
	return request({
		url: '/detection/detectionCategory/' + data.id,
		method: 'put',
		data
	});
}
export function delDetectionCategory(id) {
	return request({
		url: '/detection/detectionCategory/' + id,
		method: 'delete'
	});
}
export function restoreDetectionCategory(data) {
	return request({
		url: '/detection/detection',
		method: 'post',
		data
	});
}
