import Layout from '@/layout';

const shopRouter = {
	path: '/shop',
	component: Layout,
	name: 'Shop',
	meta: {
		title: '商家管理',
		icon: 'el-icon-s-shop',
		roles: ['shop']
	},
	children: [
		{
			path: 'merchantList',
			component: () => import('@/views/shop/merchant'),
			name: 'merchantList',
			meta: { title: '商户列表', icon: 'list', roles: ['merchantList'] }
		},
		{
			path: 'list',
			component: () => import('@/views/shop/list'),
			name: 'ShopList',
			meta: { title: '店铺列表', icon: 'list', roles: ['shopList'] }
		}
	]
};

export default shopRouter;

