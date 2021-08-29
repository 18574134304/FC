<template>
	<el-popconfirm
			:disabled="disabled"
			:title="title"
			@onConfirm="handleChange"
		>
		<div slot="reference" class="wrap" :class="{disabled:disabled}">
			<el-switch
					v-model="val"
					:disabled="disabled"
					active-color="#13ce66"
					inactive-color="#ff4949"
					:active-value="values[0]"
					:inactive-value="values[1]"
				/>
			<div class="mask" />
		</div>
	</el-popconfirm>
</template>

<script>
	export default {
		name: 'ConfirmSwitch',
		props: {
			titles: {
				default() {
					return ['确定操作吗？', '确定操作吗？'];
				}
			},
			value: {
				default() {
					return null;
				}
			},
			disabled: {
				default() {
					return false;
				}
			},
			values: {
				type: Array,
				default() {
					return [true, false];
				}
			}
		},
		computed: {
			title() {
				return this.titles[~~this.values.findIndex(n => n === this.val)];
			},
			val: {
				get() {
					return this.value;
				},
				set(val) {
					this.$emit('input', val);
				}
			}
		},
		created() {
			if (this.value == null) {
				this.$emit('input', this.values[0]);
			}
		},
		methods: {
			handleChange() {
				if (this.disabled) {
					return;
				}
				this.val = this.values.find(n => n != this.val);
				this.$emit('change', this.val);
			}
		}
	};
</script>

<style lang="scss" scoped>
    .wrap {
        position: relative;
        cursor: pointer;
        display: inline-block;
    }

    .disabled {
        cursor: not-allowed;
    }

    .mask {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
    }
</style>
