<template>
	<div class="editor-container">
		<div class="toolbar" />
		<div class="editor-doc">
			<div class="editor-doc-title">
				<el-input v-model="title" placeholder="请输入标题……" />
			</div>
			<div :id="id" class="editor-doc-cnt" />
		</div>
	</div>
</template>

<script>
	import load from '../Tinymce/dynamicLoadScript';

	const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js';

	export default {
		name: 'Editor',
		props: {
			id: {
				type: String,
				default: function() {
					return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '');
				}
			},
			title: {
				type: String,
				default: ''
			},
			placeholder: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				tinymceId: this.id
			};
		},
		watch: {
			value(val) {
				if (!this.hasChange && this.hasInit) {
					this.$nextTick(() =>
						window.tinymce.get(this.tinymceId).setContent(val || ''));
				}
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				// dynamic load tinymce from cdn
				load(tinymceCDN, (err) => {
					if (err) {
						this.$message.error(err.message);
						return;
					}
					this.initTinymce();
				});
			},
			initTinymce() {
				window.tinymce.init({
					selector: `#${this.tinymceId}`,
					language: 'zh_CN',
					menubar: false,
					inline: true,
					placeholder: this.placeholder,
					fixed_toolbar_container: '.editor-container .toolbar',
					custom_ui_selector: 'body',
					plugins: 'bbcode',
					toolbar: 'bold italic underline | undo redo',
					init_instance_callback: function(editor) {
						editor.execCommand('selectAll');
						editor.selection.getRng().collapse(false);
						editor.focus();
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.editor-doc {
		padding: 10px;
		border: 1px solid #ddd;

		.editor-doc-title {
			padding-bottom: 10px;
		}

		.editor-doc-cnt {
			min-height: 300px;
			overflow: auto;
			padding: 6px;
			outline: none !important;
		}
	}
</style>
