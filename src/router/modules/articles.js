import Layout from '@/layout';

const articleRouter = {
	path: '/article',
	component: Layout,
	name: 'Article',
	meta: {
		title: '文章管理',
		icon: 'el-icon-list',
		roles: ['article']
	},
	children: [
		// {
		// 	path: 'list',
		// 	component: () => import('@/views/article/categorie'),
		// 	name: 'List',
		// 	meta: { title: '文章分类', icon: 'list' }
		// },
		{
			path: 'list',
			component: () => import('@/views/article/list'),
			name: 'ArticleList',
			meta: { title: '文章列表', icon: 'list', roles: ['articleList'] }
		},
		{
			path: 'edit/:id?',
			component: () => import('@/views/article/edit'),
			name: 'ArticleEdit',
			meta: { title: '文章编辑', icon: 'list' },
			hidden: true
		}
	]
};

export default articleRouter;

