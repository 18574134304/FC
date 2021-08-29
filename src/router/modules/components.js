/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout';

const componentsRouter = {
	path: '/components',
	component: Layout,
	redirect: 'noRedirect',
	name: 'ComponentDemo',
	meta: {
		title: '组件',
		icon: 'component'
	},
	children: [
		{
			path: 'tinymce',
			component: () => import('@/demo/components-demo/tinymce'),
			name: 'TinymceDemo',
			meta: { title: '富文本编辑器' }
		},
		{
			path: 'markdown',
			component: () => import('@/demo/components-demo/markdown'),
			name: 'MarkdownDemo',
			meta: { title: 'Markdown' }
		},
		{
			path: 'json-editor',
			component: () => import('@/demo/components-demo/json-editor'),
			name: 'JsonEditorDemo',
			meta: { title: 'JSON 编辑器' }
		},
		{
			path: 'split-pane',
			component: () => import('@/demo/components-demo/split-pane'),
			name: 'SplitpaneDemo',
			meta: { title: 'SplitPane' }
		},
		{
			path: 'avatar-upload',
			component: () => import('@/demo/components-demo/avatar-upload'),
			name: 'AvatarUploadDemo',
			meta: { title: '头像上传' }
		},
		{
			path: 'dropzone',
			component: () => import('@/demo/components-demo/dropzone'),
			name: 'DropzoneDemo',
			meta: { title: 'Dropzone' }
		},
		{
			path: 'sticky',
			component: () => import('@/demo/components-demo/sticky'),
			name: 'StickyDemo',
			meta: { title: 'Sticky' }
		},
		{
			path: 'count-to',
			component: () => import('@/demo/components-demo/count-to'),
			name: 'CountToDemo',
			meta: { title: 'Count To' }
		},
		{
			path: 'mixin',
			component: () => import('@/demo/components-demo/mixin'),
			name: 'ComponentMixinDemo',
			meta: { title: '小组件' }
		},
		{
			path: 'back-to-top',
			component: () => import('@/demo/components-demo/back-to-top'),
			name: 'BackToTopDemo',
			meta: { title: '返回头部' }
		},
		{
			path: 'drag-dialog',
			component: () => import('@/demo/components-demo/drag-dialog'),
			name: 'DragDialogDemo',
			meta: { title: '拖拽 Dialog' }
		},
		{
			path: 'drag-select',
			component: () => import('@/demo/components-demo/drag-select'),
			name: 'DragSelectDemo',
			meta: { title: '拖拽 Select' }
		},
		{
			path: 'dnd-list',
			component: () => import('@/demo/components-demo/dnd-list'),
			name: 'DndListDemo',
			meta: { title: '列表拖拽' }
		},
		{
			path: 'drag-kanban',
			component: () => import('@/demo/components-demo/drag-kanban'),
			name: 'DragKanbanDemo',
			meta: { title: '可拖拽看板' }
		}
	]
};

export default componentsRouter;
