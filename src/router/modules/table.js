/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout';

const tableRouter = {
	path: '/table',
	component: Layout,
	redirect: '/table/complex-table',
	name: 'Table',
	meta: {
		title: '表格',
		icon: 'table'
	},
	children: [
		{
			path: 'dynamic-table',
			component: () => import('@/demo/table/dynamic-table/index'),
			name: 'DynamicTable',
			meta: { title: '动态 Table' }
		},
		{
			path: 'drag-table',
			component: () => import('@/demo/table/drag-table'),
			name: 'DragTable',
			meta: { title: '拖拽 Table' }
		},
		{
			path: 'inline-edit-table',
			component: () => import('@/demo/table/inline-edit-table'),
			name: 'InlineEditTable',
			meta: { title: 'table 内编辑' }
		},
		{
			path: 'complex-table',
			component: () => import('@/demo/table/complex-table'),
			name: 'ComplexTable',
			meta: { title: '综合 Table' }
		}
	]
};
export default tableRouter;
