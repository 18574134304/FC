import drawerWrap from './index';

export default {
	install(vue) {
		vue.component(drawerWrap.name, drawerWrap);
		const DrawerConstructor = vue.extend(drawerWrap);
		vue.prototype.$drawer = function(title = '', component, props = {}) {
			if (!component) {
				return new Error('缺少参数：component');
			}
			let drawerInstance = new DrawerConstructor({
				propsData: { title },
				store: this.$store,
				router: this.$router,
				i18n: this.$i18n
			});
			this.$children.push(drawerInstance);
			drawerInstance.$mount();
			this.$el.appendChild(drawerInstance.$el);
			const ComponentConstructor = vue.extend(component);
			let componentInstance = new ComponentConstructor({
				propsData: props,
				store: this.$store,
				router: this.$router,
				i18n: this.$i18n
			});
			const wrap = drawerInstance.$children[0];
			wrap.$children.push(componentInstance);
			componentInstance.$mount();
			drawerInstance.show(() => {
				wrap.$el.querySelector('.el-drawer__body').appendChild(componentInstance.$el);
			});
			drawerInstance.$on('closed', () => {
				// debugger
				componentInstance.$el.remove();
				componentInstance.$destroy();
				componentInstance = null;
				drawerInstance.$el.remove();
				drawerInstance.$destroy();
				drawerInstance = null;
			});
			drawerInstance.$on('close', () => {
				componentInstance.$onClose && componentInstance.$onClose();
				componentInstance.$emit('close');
			});
			componentInstance.$on('drawer-close', (isCallback = true) => {
				drawerInstance.hide(isCallback);
			});
			return componentInstance;
		};
	}
};
