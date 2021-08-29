import dialogWrap from './index';

export default {
	install(vue) {
		vue.component(dialogWrap.name, dialogWrap);
		const DialogConstructor = vue.extend(dialogWrap);
		// const DialogConstructor = this.$options._base.extend(quickDialog);
		vue.prototype.$dialog = function(title = '', component, props = {}, option = {}) {
			if (!component) {
				return new Error('缺少参数：component');
			}
			let dialogInstance = new DialogConstructor({
				propsData: { title, visible: false, option },
				store: this.$store,
				router: this.$router,
				i18n: this.$i18n
				// el:document.createElement('div')
			});
			this.$children.push(dialogInstance);
			dialogInstance.$mount();
			this.$el.appendChild(dialogInstance.$el);
			const ComponentConstructor = vue.extend(component);
			// const ComponentConstructor = this.$options._base.extend(component);
			let componentInstance = new ComponentConstructor({
				propsData: props,
				store: this.$store,
				router: this.$router,
				i18n: this.$i18n
			});
			const wrap = dialogInstance.$children[0];
			wrap.$children.push(componentInstance);
			componentInstance.$mount();
			// dialogInstance.$slots.default = componentInstance._vnode;
			dialogInstance.show(() => {
				wrap.$el.querySelector('.el-dialog__body').appendChild(componentInstance.$el);
				// dialogInstance.$el.querySelector('.el-dialog__body').appendChild(componentInstance.$el);
			});
			dialogInstance.$on('closed', () => {
				// this.$children.splice(this.$children.indexOf(n=>n._uid==dialogInstance._uid));
				// debugger
				componentInstance.$el.remove();
				componentInstance.$destroy();
				componentInstance = null;
				dialogInstance.$el.remove();
				dialogInstance.$destroy();
				dialogInstance = null;
			});
			dialogInstance.$on('close', () => {
				componentInstance.$onClose && componentInstance.$onClose();
				componentInstance.$emit('close');
			});
			componentInstance.$on('dialog-close', (isCallback = true) => {
				dialogInstance.hide(isCallback);
			});
			return componentInstance;
		};
	}
};
