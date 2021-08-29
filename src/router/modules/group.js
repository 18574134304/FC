import Layout from '@/layout';

const groupRouter = {
	path: '/group',
	component: Layout,
	name: 'Group',
	meta: {
		title: '拼团管理',
		icon: 'el-icon-goods',
		roles: ['group']
	},
	children: [
		{
			path: 'list',
			component: () => import('@/views/group/index'),
			name: 'GroupList',
			meta: { title: '拼团列表', icon: 'list', roles: ['groupList'] }
		}
	]
};

export default groupRouter;
