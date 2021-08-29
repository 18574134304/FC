import Layout from '@/layout';

const financeRouter = {
	path: '/Finance',
	component: Layout,
	name: 'Finance',
	meta: {
		title: '财务管理',
		icon: 'el-icon-money',
		roles: ['finance']
	},
	children: [
		{
			path: 'statement',
			component: () => import('@/views/finance/statementList'),
			name: 'StatementList',
			meta: { title: '财务列表', icon: 'list', roles: ['statement'] }
		},
		{
			path: 'withdraws',
			component: () => import('@/views/finance/withdrawList'),
			name: 'WithdrawList',
			meta: { title: '提现列表', icon: 'list', roles: ['withdraws'] }
		},
		{
			path: 'userReport',
			component: () => import('@/views/finance/userReportList'),
			name: 'UserReportList',
			meta: { title: '用户报表', icon: 'list', roles: ['userReport'] }
		},
		{
			path: 'orderReport',
			component: () => import('@/views/finance/orderReportList'),
			name: 'OrderReportList',
			meta: { title: '订单报表', icon: 'list', roles: ['orderReport'] }
		},
		{
			path: 'redReportList',
			component: () => import('@/views/finance/redReportList'),
			name: 'RedReportList',
			meta: { title: '红包报表', icon: 'list', roles: ['redReportList'] }
		},
		{
			path: 'rewardReport',
			component: () => import('@/views/finance/rewardReportList'),
			name: 'RewardReport',
			meta: { title: '奖金报表', icon: 'list', roles: ['rewardReport'] }
		},
		{
			path: 'dividendsReport',
			component: () => import('@/views/finance/dividendsReportList'),
			name: 'DividendsReport',
			meta: { title: '分红报表', icon: 'list', roles: ['dividendsReport'] }
		}
	]
};

export default financeRouter;

