import Layout from '@/layout';

const detectionRouter = {
	path: '/detection',
	component: Layout,
	name: 'Detection',
	meta: {
		title: '发现管理',
		icon: 'list',
		roles: ['detection']
	},
	children: [
		{
			path: 'list',
			component: () => import('@/views/detection/list'),
			name: 'DetectionList',
			meta: { title: '发现列表', icon: 'list', roles: ['detectionList'] }
		},
		{
			path: 'category',
			component: () => import('@/views/detection/category'),
			name: 'DetectionCategoryList',
			meta: { title: '发现分类', icon: 'list', roles: ['detectionCategoryList'] }
		},
		{
			path: 'edit/:id?',
			component: () => import('@/views/detection/edit'),
			name: 'DetectionEdit',
			meta: { title: '发现编辑', icon: 'edit' },
			hidden: true
		}
	]
};

export default detectionRouter;

