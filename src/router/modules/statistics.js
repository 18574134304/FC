import Layout from '@/layout';

// 数据统计
const statisticsRouter = {
	path: '/statistics',
	component: Layout,
	name: 'Statistics',
	meta: {
		title: '数据概览',
		icon: 'el-icon-data-line',
		roles: ['statistics']
	},
	children: [
		{
			path: 'userData',
			component: () => import('@/views/statistics/userData.vue'),
			name: 'userData',
			meta: { title: '用户数据', icon: 'el-icon-user', roles: ['userData'] }
		},
		{
			path: 'orderData',
			component: () => import('@/views/statistics/orderData.vue'),
			name: 'orderData',
			meta: { title: '订单数据', icon: 'list', roles: ['orderData'] }
		},
		{
			path: 'financeData',
			component: () => import('@/views/statistics/financeData.vue'),
			name: 'financeData',
			meta: { title: '财务数据', icon: 'el-icon-money', roles: ['financeData'] }
		}
	]
};

export default statisticsRouter;
