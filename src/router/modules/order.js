import Layout from '@/layout';

const orderRouter = {
	path: '/order',
	component: Layout,
	name: 'Order',
	meta: {
		title: '订单管理',
		icon: 'list',
		roles: ['order']
	},
	children: [
		{
			path: 'order',
			component: () => import('@/views/order/orderList'),
			name: 'OrderList',
			meta: { title: '订单列表', icon: 'list', roles: ['orderList'] }
		}
	]
};

export default orderRouter;

