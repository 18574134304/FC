const steps = [
	{
		element: '#hamburger-container',
		popover: {
			title: '菜单栏',
			description: '展开和收缩菜单栏',
			position: 'bottom'
		}
	},
	/* {
		element: '#breadcrumb-container',
		popover: {
			title: '面包屑导航',
			description: '指示当前页面位置',
			position: 'bottom'
		}
	},*/
	{
		element: '#header-search',
		popover: {
			title: '功能搜索',
			description: '功能搜索，快速导航',
			position: 'left'
		}
	},
	{
		element: '#screenfull',
		popover: {
			title: '全屏',
			description: '打开全屏',
			position: 'left'
		}
	},
	/* {
		element: '#size-select',
		popover: {
			title: 'Switch Size',
			description: 'Switch the system size',
			position: 'left'
		}
	},*/
	{
		element: '.avatar-container',
		popover: {
			title: '个人',
			description: '点击此处查看更多个人功能',
			position: 'left'
		},
		/*
		onHighlightStarted: (Element) => {
			console.log(Element, Element.node);
			Element.node.find('.avatar-wrapper').click();
		},
		*/
		padding: 0
	},
	{
		element: '#tags-view-container',
		popover: {
			title: '标签',
			description: '您访问的标签的历史记录',
			position: 'bottom'
		},
		padding: 0
	}
];

export default steps;
