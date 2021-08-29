/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout';

const chartsRouter = {
	path: '/charts',
	component: Layout,
	redirect: 'noRedirect',
	name: 'Charts',
	meta: {
		title: '图表',
		icon: 'chart'
	},
	children: [
		{
			path: 'keyboard',
			component: () => import('@/demo/charts/keyboard'),
			name: '键盘图表',
			meta: { title: 'Keyboard Chart', noCache: true }
		},
		{
			path: 'line',
			component: () => import('@/demo/charts/line'),
			name: '折线图',
			meta: { title: 'Line Chart', noCache: true }
		},
		{
			path: 'mix-chart',
			component: () => import('@/demo/charts/mix-chart'),
			name: '混合图表',
			meta: { title: 'Mix Chart', noCache: true }
		}
	]
};

export default chartsRouter;
