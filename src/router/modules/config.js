import Layout from '@/layout';

const configRouter = {
	path: '/config',
	component: Layout,
	meta: { title: '系统管理', icon: 'el-icon-setting', roles: ['config'] },
	children: [
		{
			path: 'index',
			component: () => import('@/views/config/index'),
			name: 'Config',
			meta: { title: '系统配置', icon: 'el-icon-setting', roles: ['configIndex'] }
		}
	]
};

export default configRouter;
