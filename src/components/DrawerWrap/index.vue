<template>
	<el-drawer
			ref="drawer"
			:title="title"
			:visible.sync="drawerVisible"
			:direction="direction"
			:size="size"
			:modal="true"
			:close-on-press-escape="true"
			:destroy-on-close="false"
			:close-on-click-modal="true"
			@closed="handleClosed"
			@close="handleClose"
		>
		<slot />
	</el-drawer>
</template>

<script>
	export default {
		name: 'DrawerWrap',
		props: {
			title: {
				type: String,
				default() {
					return 'drawer';
				}
			},
			visible: {
				type: Boolean,
				default() {
					return false;
				}
			},
			size: {
				type: String,
				default() {
					return 'auto';
				}
			},
			type: {
				type: String,
				default() {
					return 'normal';
				}
			},
			direction: {
				type: String,
				default() {
					return 'rtl';
				}
			}
		},
		data() {
			return {
				isCallback: true,
				drawerVisible: false,
				drawerInit: false
			};
		},
		watch: {
			drawerVisible() {
				if (this.drawerVisible) {
					this.initEmit();
				}
				this.$emit('update:visible', this.drawerVisible);
			},
			visible() {
				this.drawerVisible = this.visible;
			}
		},
		created() {
			this.drawerVisible = this.visible;
		},
		mounted() {

		},
		methods: {
			handleClosed() {
				this.isCallback && this.$emit('closed');
			},
			handleClose() {
				this.isCallback && this.$emit('close');
			},
			show(callback) {
				this.drawerVisible = true;
				this.$nextTick(callback);
			},
			hide(isCallback = true) {
				this.isCallback = isCallback;
				this.drawerVisible = false;
			},
			initEmit() {
				if (!this.drawerInit && this.type === 'normal') {
					this.$nextTick(() => {
						const instance = this.$children[0].$children[0];
						instance && instance.$on('drawer-close', () => {
							this.drawerVisible = false;
						});
					});
					this.drawerInit = true;
				}
			}
		}
	};
</script>

<style lang="scss">
</style>
