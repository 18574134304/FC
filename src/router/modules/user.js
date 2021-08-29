import Layout from '@/layout';

const userRouter = {
	path: '/users',
	component: Layout,
	name: 'Users',
	meta: {
		title: '用户管理',
		icon: 'el-icon-user',
		roles: ['user']
	},
	children: [
		{
			path: 'list',
			component: () => import('@/views/users/list'),
			name: 'List',
			meta: { title: '用户列表', icon: 'list', roles: ['userList'] }
		},
		{
			path: 'level',
			component: () => import('@/views/users/level'),
			name: 'UsersLevel',
			meta: { title: '等级列表', icon: 'list', roles: ['levelList'] }
		}
	]
};

export default userRouter;

