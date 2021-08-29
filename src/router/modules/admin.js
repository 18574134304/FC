import Layout from '@/layout';

const adminRouter = {
	path: '/admin',
	component: Layout,
	meta: {
		title: '后台管理',
		icon: 'el-icon-user',
		roles: ['admin']
	},
	children: [
		{
			path: 'index',
			component: () => import('@/views/admin/index'),
			name: 'Index',
			meta: { title: '管理员列表', icon: 'el-icon-list', roles: ['adminList'] }
		},
		{
			path: 'department',
			component: () => import('@/views/admin/department'),
			name: 'Department',
			meta: { title: '部门列表', icon: 'el-icon-list', roles: ['adminDepartment'] }
		}
	]
};

export default adminRouter;
