import Layout from '@/layout';

const goodsRouter = {
	path: '/goods',
	component: Layout,
	name: 'Goods',
	meta: {
		title: '商品管理',
		icon: 'el-icon-goods',
		roles: ['goods']
	},
	children: [
		{
			path: 'add',
			component: () => import('@/views/goods/edit'),
			name: 'AddGoods',
			hidden: true,
			meta: { title: '添加商品', activeMenu: '/goods/list' }
		},
		{
			path: 'edit',
			component: () => import('@/views/goods/edit'),
			name: 'EditGoods',
			hidden: true,
			meta: { title: '编辑商品', activeMenu: '/goods/list' }
		},

		{
			path: 'list',
			component: () => import('@/views/goods/list'),
			name: 'GoodsList',
			meta: { title: '商品列表', icon: 'list', roles: ['goodsList'] }
		},
		{
			path: 'categories',
			component: () => import('@/views/goods/categories'),
			name: 'GoodsCategories',
			meta: { title: '商品分类', icon: 'component', roles: ['goodsCategories'] }
		}
	]
};

export default goodsRouter;
