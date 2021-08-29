<template>
	<el-popover
			v-model="visible"
			v-bind="$attrs"
			trigger="click"
		>
		<div class="el-popconfirm">
			<p class="el-popconfirm__main">
				<i
						v-if="!hideIcon"
						:class="icon"
						class="el-popconfirm__icon"
						:style="{color: iconColor}"
					/>
				{{ title }}
			</p>
			<div class="input-box">
				<el-input v-model="value" :type="inputType" :maxlength="inputMaxLength" autofocus show-word-limit clearable @keyup.enter.native="confirm" />
			</div>
			<div class="el-popconfirm__action">
				<el-button
						size="mini"
						:type="cancelButtonType"
						@click="cancel"
					>
					{{ cancelButtonText }}
				</el-button>
				<el-button
						size="mini"
						:type="confirmButtonType"
						@click="confirm"
					>
					{{ confirmButtonText }}
				</el-button>
			</div>
		</div>
		<slot slot="reference" name="reference" />
	</el-popover>
</template>

<script>
	import ElPopover from '../../components/CustomPopover';
	import ElButton from 'element-ui/packages/button';
	import { t } from 'element-ui/src/locale';

	export default {
		name: 'PopInputBox',
		components: {
			ElPopover,
			ElButton
		},
		props: {
			title: {
				type: String,
				default: ''
			},
			inputValue: {
				type: [String, Number],
				default: ''
			},
			inputMaxLength: {
				type: Number,
				default: 10
			},
			inputType: {
				type: String,
				default: 'text'
			},
			confirmButtonText: {
				type: String,
				default: t('el.popconfirm.confirmButtonText')
			},
			cancelButtonText: {
				type: String,
				default: t('el.popconfirm.cancelButtonText')
			},
			confirmButtonType: {
				type: String,
				default: 'primary'
			},
			cancelButtonType: {
				type: String,
				default: 'text'
			},
			icon: {
				type: String,
				default: 'el-icon-question'
			},
			iconColor: {
				type: String,
				default: '#f90'
			},
			hideIcon: {
				type: Boolean,
				default: false
			},
			options: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		data() {
			return {
				visible: false,
				value: this.inputValue
			};
		},
		methods: {
			confirm() {
				this.visible = false;
				this.$emit('onConfirm', {
					...this.options,
					value: this.value
				});
				this.value = '';
			},
			cancel() {
				this.visible = false;
				this.$emit('onCancel');
			}
		}
	};
</script>

<style lang="scss" scoped>
	.input-box {
		margin-bottom: 10px;
	}
</style>
