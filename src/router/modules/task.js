import Layout from '@/layout';

const taskRouter = {
	path: '/task',
	component: Layout,
	name: 'Task',
	meta: {
		title: '任务管理',
		icon: 'skill',
		roles: ['task']
	},
	children: [
		{
			path: 'list',
			component: () => import('@/views/task/list'),
			name: 'TaskList',
			meta: { title: '任务列表', icon: 'list', roles: ['taskList'] }
		}
		/* {
			path: 'categories',
			component: () => import('@/views/task/categories'),
			name: 'TaskCategories',
			meta: { title: '任务分类', icon: 'component' }
		}*/
	]
};

export default taskRouter;
