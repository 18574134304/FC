<template>
	<div v-loading="isInit" class="app-container goods-categories-edit-container">
		<el-form ref="form" v-loading="loading" :model="categories" label-width="100px">
			<el-form-item
					label="分类名称"
					prop="name"
					:rules="[
						{ required: true, message: '请输入分类名称' }
					]"
				>
				<el-input v-model="categories.name" />
			</el-form-item>
			<el-form-item label="上级分类" prop="parent_id">
				<el-select v-model="categories.parent_id" placeholder="请选择上级分类" :disabled="!!id" @change="handleSelectParentId">
					<el-option label="顶级分类" :value="0" />
					<el-option v-for="item in list" v-if="item.id !== categories.id" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item label="分类图标" prop="icon">
				<l-image-upload
						v-model="categories.icon"
						:file-url="categories.icon_url"
						:show-file-list="false"
						:width="100"
					/>
			</el-form-item>
			<el-form-item label="排序" prop="sort">
				<el-input v-model="categories.sort" type="Number" :min="0" />
			</el-form-item>
			<el-form-item label="是否显示" prop="status">
				<el-switch v-model="categories.status" :active-value="1" :inactive-value="0" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm()">立即{{ pageType }}</el-button>
				<el-button v-if="!id" @click="resetForm()">重置</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import { getCategoriesList, getCategories, editCategories } from '../../api/goods';
	export default {
		name: 'GoodsCategoriesEdit',
		props: {
			id: {
				type: Number,
				default() {
					return 0;
				}
			}
		},
		data() {
			return {
				isInit: true,
				loading: false,
				list: [],
				iconLoading: false,
				categories: {
					name: '',
					parent_id: 0,
					sort: 0,
					status: 1,
					icon: '',
					iconInfo: {},
					relation: []
				}
			};
		},
		computed: {
			pageType() {
				return ['创建', '修改'][+!!this.id];
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			async init() {
				await this.fetch();
				if (this.id) {
					await this.categoriesInfo();
				}
				this.isInit = false;
			},
			async edit() {
				this.loading = true;
				try {
					let response = await editCategories(this.categories);
					if (response.code === 0) {
						this.$message.success(this.pageType + '成功');
						this.$emit('success', response.data);
						this.$emit('dialog-close');
					}
				} catch (e) {
					console.log(e);
				}
				this.loading = false;
			},
			async fetch() {
				try {
					let response = await getCategoriesList();
					if (response.code === 0) {
						this.list = response.data;
					}
				} catch (e) {
					console.log(e);
				}
			},
			async categoriesInfo() {
				try {
					let response = await getCategories({ id: this.id });
					if (response.code === 0) {
						this.categories = response.data;
					}
				} catch (e) {
					console.log(e);
				}
			},
			resetForm(formName = 'form') {
				this.$refs[formName].resetFields();
			},
			submitForm(formName = 'form') {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.edit();
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			handleSelectParentId() {
				let relation = this.categories.parent_id === 0 ? [] : this.list.find(n => n.id === this.categories.parent_id).relation;
				relation.push(this.categories.id);
				this.categories.relation = relation;
			},
			handleIconSuccess(res, file) {
				this.categories.iconInfo = { path: res.data.path, url: URL.createObjectURL(file.raw) };
				this.categories.icon = res.data.path;
				this.iconLoading = false;
			},
			beforeIconUpload(file) {
				// const isPNG = file.type === 'image/png';
				const isLt1M = file.size / 1024 / 1024 < 1;

				// if (!isPNG) {
				// 	this.$message.error('图标只能是 PNG 格式!');
				// }
				// if (file.width / file.height !== 1) {
				// 	this.$message.error('请上传正方形的图片');
				// }
				if (!isLt1M) {
					this.$message.error('图标大小不能超过 1MB!');
				}
				this.iconLoading = true;
				// return isPNG && isLt1M;
				return isLt1M;
			}
		}
	};
</script>

<style lang="scss">
	.goods-categories-edit-container {
		.avatar-uploader {
			.el-upload {
				border: 1px dashed #d9d9d9;
				border-radius: 6px;
				cursor: pointer;
				position: relative;
				overflow: hidden;

				&:hover {
					border-color: #409EFF;
				}
			}
		}
		.avatar-uploader-icon {
			font-size: 28px;
			color: #8c939d;
			width: 100px;
			height: 100px;
			line-height: 100px;
			text-align: center;
		}
		.avatar {
			width: 100px;
			height: 100px;
			display: block;
		}
	}
</style>
