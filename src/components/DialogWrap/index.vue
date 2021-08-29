<template>
	<el-dialog
			ref="dialog"
			v-el-drag-dialog="option"
			class="dialog-wrap dialog-ops-modal"
			:title="title"
			:width="option.width"
			:top="option.top"
			:modal="true"
			:visible.sync="dialogVisible"
			:close-on-press-escape="true"
			:destroy-on-close="false"
			:close-on-click-modal="true"
			:append-to-body="option.inBody"
			@closed="handleClosed"
			@close="handleClose"
		>
		<template slot="title">
			{{ title }}
		</template>
		<slot />
	</el-dialog>
</template>

<script>
	import elDragDialog from '@/directive/el-drag-dialog';

	export default {
		name: 'DialogWrap',
		directives: { elDragDialog },
		props: {
			title: {
				type: String,
				default() {
					return 'dialog';
				}
			},
			visible: {
				type: Boolean,
				default() {
					return false;
				}
			},
			type: {
				type: String,
				default() {
					return 'normal';
				}
			},
			option: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		data() {
			return {
				isCallback: true,
				dialogVisible: false,
				dialogInit: false
			};
		},
		watch: {
			dialogVisible() {
				if (this.dialogVisible) {
					this.initEmit();
				}
				this.$emit('update:visible', this.dialogVisible);
			},
			visible() {
				this.dialogVisible = this.visible;
			}
		},
		created() {
			// TODO
			this.dialogVisible = this.visible;
		},
		mounted() {
			// this.hide();
			// this.dialogVisible = false;
			// console.log('this', this);
			// debugger
		},
		methods: {
			handleClosed() {
				this.isCallback && this.$emit('closed');
			},
			handleClose() {
				this.isCallback && this.$emit('close');
			},
			show(callback) {
				this.dialogVisible = true;
				this.$nextTick(callback);
			},
			hide(isCallback = true) {
				this.isCallback = isCallback;
				this.dialogVisible = false;
			},
			initEmit() {
				if (!this.dialogInit && this.type === 'normal') {
					this.$nextTick(() => {
						const instance = this.$children[0].$children[0];
						instance && instance.$on('dialog-close', () => {
							this.dialogVisible = false;
						});
					});
					this.dialogInit = true;
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.subtitle {
		color: orangered;
	}
</style>

<style lang="scss">
	.dialog-wrap {
		> .el-dialog {
			.el-dialog__body {
				padding: 0;
			}
		}
        [slot="footer"] {
            text-align: right;
        }
	}
</style>
