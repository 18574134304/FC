import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/* Router Modules */
import componentsRouter from './modules/components';
import chartsRouter from './modules/charts';
import tableRouter from './modules/table';
import nestedRouter from './modules/nested';
import goodsRouter from '@/router/modules/goods';
import configRouter from '@/router/modules/config';
import orderRouter from '@/router/modules/order';
import financeRouter from '@/router/modules/finance';
import shopRouter from '@/router/modules/shop';
import userRouter from '@/router/modules/user';
import statisticsRouter from '@/router/modules/statistics';
import articleRouter from '@/router/modules/articles';
import taskRouter from '@/router/modules/task';
import detectionRouter from '@/router/modules/detection';
import groupRouter from '@/router/modules/group';
import adminRouter from '@/router/modules/admin';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
	{
		path: '/redirect',
		component: Layout,
		hidden: true,
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('@/demo/redirect/index')
			}
		]
	},
	{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true
	},
	{
		path: '/auth-redirect',
		component: () => import('@/views/login/auth-redirect'),
		hidden: true
	},
	{
		path: '/404',
		component: () => import('@/demo/error-page/404'),
		hidden: true
	},
	{
		path: '/401',
		component: () => import('@/demo/error-page/401'),
		hidden: true
	},
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		children: [
			{
				path: 'dashboard',
				component: () => import('@/views/dashboard/index'),
				name: 'Dashboard',
				meta: { title: '??????', icon: 'dashboard', affix: true }
			}
		]
	},
	...(process.env.NODE_ENV === 'development' ? [{
		path: '/documentation',
		component: Layout,
		children: [
			{
				path: 'index',
				component: () => import('@/demo/documentation/index'),
				name: 'Documentation',
				meta: { title: '??????', icon: 'documentation' }
			}
		]
	},
	{
		path: '/guide',
		component: Layout,
		redirect: '/guide/index',
		children: [
			{
				path: 'index',
				component: () => import('@/demo/guide/index'),
				name: 'Guide',
				meta: { title: '?????????', icon: 'guide', noCache: true }
			}
		]
	}] : []),
	{
		path: '/profile',
		component: Layout,
		redirect: '/profile/index',
		hidden: true,
		children: [
			{
				path: 'index',
				component: () => import('@/demo/profile/index'),
				name: 'Profile',
				meta: { title: '????????????', icon: 'user', noCache: true }
			}
		]
	}
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
	userRouter,
	shopRouter,
	financeRouter,
	orderRouter,
	goodsRouter,
	groupRouter,
	statisticsRouter,
	articleRouter,
	taskRouter,
	detectionRouter,
	adminRouter,
	configRouter,

	...(process.env.NODE_ENV === 'development' ? [{
		path: '/test',
		component: Layout,
		children: [
			{
				path: 'index',
				component: () => import('@/views/test/index'),
				name: 'Test',
				meta: { title: '??????', icon: 'el-icon-cpu', noCache: true }
			}
		]
	}, {
		path: '/permission',
		component: Layout,
		redirect: '/permission/page',
		alwaysShow: true, // will always show the root menu
		name: 'Permission',
		meta: {
			title: '??????',
			icon: 'lock'
			// roles: ['admin', 'editor'] // you can set roles in root nav
		},
		children: [
			{
				path: 'page',
				component: () => import('@/demo/permission/page'),
				name: 'PagePermission',
				meta: {
					title: 'Page Permission',
					roles: ['admin'] // or you can only set roles in sub nav
				}
			},
			{
				path: 'directive',
				component: () => import('@/demo/permission/directive'),
				name: 'DirectivePermission',
				meta: {
					title: 'Directive Permission'
					// if do not set roles, means: this page does not require permission
				}
			},
			{
				path: 'role',
				component: () => import('@/demo/permission/role'),
				name: 'RolePermission',
				meta: {
					title: 'Role Permission',
					roles: ['admin']
				}
			}
		]
	},
	{
		path: '/icon',
		component: Layout,
		children: [
			{
				path: 'index',
				component: () => import('@/demo/icons/index'),
				name: 'Icons',
				meta: { title: '??????', icon: 'icon', noCache: true }
			}
		]
	},

	/** when your routing map is too long, you can split it into small modules **/
	componentsRouter,
	chartsRouter,
	nestedRouter,
	tableRouter,

	{
		path: '/example',
		component: Layout,
		redirect: '/example/list',
		name: 'Example',
		meta: {
			title: '????????????',
			icon: 'el-icon-s-help'
		},
		children: [
			{
				path: 'create',
				component: () => import('@/demo/example/create'),
				name: 'CreateArticle',
				meta: { title: '????????????', icon: 'edit' }
			},
			{
				path: 'edit/:id(\\d+)',
				component: () => import('@/demo/example/edit'),
				name: 'EditArticle',
				meta: { title: '????????????', noCache: true, activeMenu: '/example/list' },
				hidden: true
			},
			{
				path: 'list',
				component: () => import('@/demo/example/list'),
				name: 'DemoArticleList',
				meta: { title: '????????????', icon: 'list' }
			}
		]
	},

	{
		path: '/tab',
		component: Layout,
		children: [
			{
				path: 'index',
				component: () => import('@/demo/tab/index'),
				name: 'Tab',
				meta: { title: 'Tab', icon: 'tab' }
			}
		]
	},

	{
		path: '/error',
		component: Layout,
		redirect: 'noRedirect',
		name: 'ErrorPages',
		meta: {
			title: '????????????',
			icon: '404'
		},
		children: [
			{
				path: '401',
				component: () => import('@/demo/error-page/401'),
				name: 'Page401',
				meta: { title: '401', noCache: true }
			},
			{
				path: '404',
				component: () => import('@/demo/error-page/404'),
				name: 'Page404',
				meta: { title: '404', noCache: true }
			}
		]
	},

	{
		path: '/error-log',
		component: Layout,
		children: [
			{
				path: 'log',
				component: () => import('@/demo/error-log/index'),
				name: 'ErrorLog',
				meta: { title: '????????????', icon: 'bug' }
			}
		]
	},

	{
		path: '/excel',
		component: Layout,
		redirect: '/excel/export-excel',
		name: 'Excel',
		meta: {
			title: 'Excel',
			icon: 'excel'
		},
		children: [
			{
				path: 'export-excel',
				component: () => import('@/demo/excel/export-excel'),
				name: 'ExportExcel',
				meta: { title: '?????? Excel' }
			},
			{
				path: 'export-selected-excel',
				component: () => import('@/demo/excel/select-excel'),
				name: 'SelectExcel',
				meta: { title: '???????????????' }
			},
			{
				path: 'export-merge-header',
				component: () => import('@/demo/excel/merge-header'),
				name: 'MergeHeader',
				meta: { title: '??????????????????' }
			},
			{
				path: 'upload-excel',
				component: () => import('@/demo/excel/upload-excel'),
				name: 'UploadExcel',
				meta: { title: '?????? Excel' }
			}
		]
	},

	{
		path: '/zip',
		component: Layout,
		redirect: '/zip/download',
		alwaysShow: true,
		name: 'Zip',
		meta: { title: 'Zip', icon: 'zip' },
		children: [
			{
				path: 'download',
				component: () => import('@/demo/zip/index'),
				name: 'ExportZip',
				meta: { title: '?????? Zip' }
			}
		]
	},

	{
		path: '/pdf',
		component: Layout,
		redirect: '/pdf/index',
		children: [
			{
				path: 'index',
				component: () => import('@/demo/pdf/index'),
				name: 'PDF',
				meta: { title: 'PDF', icon: 'pdf' }
			}
		]
	},
	{
		path: '/pdf/download',
		component: () => import('@/demo/pdf/download'),
		hidden: true
	},

	{
		path: '/theme',
		component: Layout,
		children: [
			{
				path: 'index',
				component: () => import('@/demo/theme/index'),
				name: 'Theme',
				meta: { title: '??????', icon: 'theme' }
			}
		]
	},

	{
		path: '/clipboard',
		component: Layout,
		children: [
			{
				path: 'index',
				component: () => import('@/demo/clipboard/index'),
				name: 'ClipboardDemo',
				meta: { title: 'Clipboard', icon: 'clipboard' }
			}
		]
	},

	{
		path: 'external-link',
		component: Layout,
		children: [
			{
				path: 'https://github.com/PanJiaChen/vue-element-admin',
				meta: { title: '??????', icon: 'link' }
			}
		]
	},

	// 404 page must be placed at the end !!!
	{ path: '*', redirect: '/404', hidden: true }] : [])
];

const createRouter = () => new Router({
	// mode: 'history', // require service support
	scrollBehavior: () => ({ y: 0 }),
	routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
	const newRouter = createRouter();
	router.matcher = newRouter.matcher; // reset router
}

export default router;
