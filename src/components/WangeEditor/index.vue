<template lang="html">
	<div class="editor">
		<div ref="toolbar" class="toolbar" />
		<div ref="editor" class="text" />
	</div>
</template>

<script>
	import E from 'wangeditor';
	export default {
		name: 'WEditor',
		model: {
			prop: 'value',
			event: 'change'
		},
		props: {
			value: {
				type: String,
				default: ''
			},
			isClear: {
				type: Boolean,
				default: false
			},
			uploadImgConfig: {
				type: Object,
				default() {
					return {
						url: '',
						fileName: 'file',
						maxSize: 2 * 1024 * 1024,
						maxLength: 6
					};
				}
			},
			uploadVideoConfig: {
				type: Object,
				default() {
					return {
						url: '',
						fileName: 'file',
						maxSize: 2 * 1024 * 1024
					};
				}
			}
		},
		data() {
			return {
				// uploadPath,
				editor: null,
				info_: null
			};
		},
		watch: {
			isClear(val) {
				// 触发清除文本域内容
				if (val) {
					this.editor.txt.clear();
					this.info_ = null;
				}
			},
			value: function(value) {
				if (value !== this.editor.txt.html()) {
					this.editor.txt.html(this.value);
				}
			}
			// value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
		},
		mounted() {
			this.seteditor();
			this.editor.txt.html(this.value);
		},
		methods: {
			seteditor() {
				// http://192.168.2.125:8080/admin/storage/create
				this.editor = new E(this.$refs.toolbar, this.$refs.editor);
				this.editor.customConfig = this.editor.customConfig ? this.editor.customConfig : this.editor.config;
				if (this.uploadImgConfig) {
					this.editor.customConfig.uploadImgShowBase64 = false; // base 64 存储图片
					// this.editor.customConfig.uploadImgServer = 'http://otp.cdinfotech.top/file/upload_images';// 配置服务器端地址
					this.editor.customConfig.uploadImgServer = this.uploadImgConfig.url;// 配置服务器端地址
					this.editor.customConfig.uploadImgHeaders = { };// 自定义 header
					this.editor.customConfig.uploadFileName = this.uploadImgConfig.fileName; // 后端接受上传文件的参数名
					this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
					this.editor.customConfig.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
					this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间
				}
				if (this.uploadVideoConfig) {
					// 上传视频
					// this.editor.customConfig.uploadVideoServer = 'http://otp.cdinfotech.top/file/upload_images';// 配置服务器端地址
					this.editor.customConfig.uploadVideoServer = this.uploadVideoConfig.url;// 配置服务器端地址
					this.editor.customConfig.uploadVideoHeaders = { };// 自定义 header
					this.editor.customConfig.uploadVideoName = this.uploadVideoConfig.fileName; // 后端接受上传文件的参数名
					this.editor.customConfig.uploadVideoMaxSize = 1 * 1024 * 1024 * 1024; // 1024m
					this.editor.customConfig.uploadVideoAccept = ['mp4'];
				}

				// 配置菜单
				this.editor.customConfig.menus = [
					'head', // 标题
					'bold', // 粗体
					'fontSize', // 字号
					'fontName', // 字体
					'italic', // 斜体
					'underline', // 下划线
					'strikeThrough', // 删除线
					'foreColor', // 文字颜色
					'backColor', // 背景颜色
					'link', // 插入链接
					'list', // 列表
					'justify', // 对齐方式
					'quote', // 引用
					'emoticon', // 表情
					'image', // 插入图片
					'table', // 表格
					'video', // 插入视频
					'code', // 插入代码
					'undo', // 撤销
					'redo', // 重复
					'fullscreen' // 全屏
				];

				this.editor.customConfig.uploadImgHooks = {
					// 上传之前
					before: function(xhr, editor, files) {
						// console.log(files);
						// 可阻止上传
						// return {
						// 	prevent: true,
						// 	msg: '需要提示给用户的错误信息'
						// };
					},
					fail: (xhr, editor, result) => {
						// 插入图片失败回调
					},
					success: (xhr, editor, result) => {
						// 图片上传成功回调
					},
					timeout: (xhr, editor) => {
						// 网络超时的回调
					},
					error: (xhr, editor) => {
						// 图片上传错误的回调
					},
					customInsert: (insertImg, result, editor) => {
						if (Object.prototype.toString.call(result.data) == '[object Array]') {
							result.data.forEach(v => {
								insertImg(v.url);
								editor.txt.append('<br>');
							});
						} else {
							insertImg(result.data.url);
							editor.txt.append('<br>');
						}
					}
				};

				this.editor.customConfig.uploadVideoHooks = {
					// 上传视频之前
					before: function(xhr) {
						console.log(xhr);

						// 可阻止视频上传
						return {
							prevent: true,
							msg: '需要提示给用户的错误信息'
						};
					},
					// 视频上传并返回了结果，视频插入已成功
					success: function(xhr) {
						console.log('success', xhr);
					},
					// 视频上传并返回了结果，但视频插入时出错了
					fail: function(xhr, editor, resData) {
						console.log('fail', resData);
					},
					// 上传视频出错，一般为 http 请求的错误
					error: function(xhr, editor, resData) {
						console.log('error', xhr, resData);
					},
					// 上传视频超时
					timeout: function(xhr) {
						console.log('timeout');
					},
					// 视频上传并返回了结果，想要自己把视频插入到编辑器中
					// 例如服务器端返回的不是 { errno: 0, data: { url : '.....'} } 这种格式，可使用 customInsert
					customInsert: function(insertVideoFn, result) {
						// result 即服务端返回的接口
						console.log('customInsert', result);

						// insertVideoFn 可把视频插入到编辑器，传入视频 src ，执行函数即可
						insertVideoFn(result.data.url);
					}
				};

				this.editor.customConfig.onchange = (html) => {
					this.info_ = html; // 绑定当前逐渐地值
					this.$emit('change', this.info_); // 将内容同步到父组件中
				};
				// 创建富文本编辑器
				this.editor.create();
			}
		}
	};
</script>

<style lang="css">
.editor {
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 0;
}
.toolbar {
    border: 1px solid #ccc;
}
.text {
    border: 1px solid #ccc;
    min-height: 500px;
}
</style>
