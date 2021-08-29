import request from '@/utils/request';

export function getArticleList(params) {
	return request({
		url: '/article/article',
		method: 'get',
		params
	});
}
export function getArticleDetail(id) {
	return request({
		url: '/article/article/' + id,
		method: 'get'
	});
}
export function createdArticle(data) {
	return request({
		url: '/article/article',
		method: 'post',
		data
	});
}
export function updateArticle(data) {
	return request({
		url: '/article/article/' + data.id,
		method: 'put',
		data
	});
}
export function delArticle(id) {
	return request({
		url: '/article/article' + id,
		method: 'delete'
	});
}
export function restoreArticle(data) {
	return request({
		url: '/article/article',
		method: 'post',
		data
	});
}
