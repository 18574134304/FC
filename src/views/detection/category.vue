<template>
	<div class="app-container">
		<el-card>
			<el-form
					:inline="true"
					size="small"
					@submit.native.prevent
				>
				<el-form-item>
					<el-button
							icon="el-icon-plus"
							:disabled="loading"
							@click="handleCreate('create')"
						>新增顶层分类</el-button>
				</el-form-item>
			</el-form>

			<el-row :gutter="20">
				<el-col :span="10">

					<el-tree
							v-if="hackReset"
							ref="tree"
							class="tree-scroll"
							node-key="id"
							:data="treeData"
							:highlight-current="true"
							:props="treeProps"
							@node-click="handleNodeClick"
						>
						<span slot-scope="{node}" class="custom-tree-node action">
							<span class="brother-showing">
								<i class="el-icon-document" />
								{{ node.label }}
							</span>
							<span class="active">
								<el-button
										type="text"
										size="mini"
										@click.stop="remove(node.key)"
									>
									删除
								</el-button>
							</span>
						</span>
					</el-tree>
				</el-col>

				<el-col :span="14">
					<el-card
							class="box-card"
							shadow="never"
						>

						<div slot="header">
							<span>{{ textMap[formStatus] }}</span>
							<el-button
									v-if="formStatus === 'create'"
									type="text"
									:loading="formLoading"
									style="float: right; padding: 3px 0;"
									@click="create"
								>确定</el-button>

							<el-button
									v-else-if="formStatus === 'update'"
									type="text"
									:loading="formLoading"
									style="float: right; padding: 3px 0;"
									@click="update"
								>修改</el-button>
						</div>

						<el-form
								ref="form"
								:model="form"
								:rules="rules"
								label-width="80px"
							>
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item
											label="名称"
											prop="name"
										>
										<el-input
												v-model="form.name"
												placeholder="请输入分类名称"
												:clearable="true"
											/>
									</el-form-item>
								</el-col>

								<el-col :span="12">
									<el-form-item
											label="排序"
											prop="sort"
										>
										<el-input-number
												v-model="form.sort"
												:min="0"
												:max="255"
												style="width: 120px;"
												controls-position="right"
											/>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</el-card>
				</el-col>
			</el-row>
		</el-card>
	</div>
</template>

<script>
	import { getDetectionCategoryList, createdDetectionCategory, updateDetectionCategory, delDetectionCategory } from '@/api/detection';
	export default {
		name: 'Category',
		data() {
			return {
				loading: true,
				treeData: [],
				filterText: '',
				hackReset: true,
				isExpandAll: false,
				expanded: [],
				treeProps: {
					id: 'id',
					label: 'name'
				},
				formStatus: 'create',
				formLoading: false,
				updateKey: 0,
				textMap: {
					create: '新增分类',
					update: '编辑分类'
				},
				form: {
					name: '',
					sort: 50
				},
				rules: {
					name: [
						{
							required: true,
							message: '名称不能为空',
							trigger: 'blur'
						},
						{
							max: 100,
							message: '长度不能大于 100 个字符',
							trigger: 'blur'
						}
					],
					sort: [
						{
							type: 'number',
							message: '必须为数字值',
							trigger: 'blur'
						}
					]
				}
			};
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			// 获取分类信息
			init() {
				getDetectionCategoryList().then(response => {
					this.treeData = response.data.data;
					if (this.$refs.main) {
						this.$refs.main.filterText = '';
						this.$refs.main.resetForm();
						this.$refs.main.resetElements();
					}
				}).finally(() => {
					this.loading = false;
				});
			},
			// 点击树节点事件
			handleNodeClick(data) {
				this.updateKey = this.$refs.tree.getCurrentKey();
				this.resetForm();
				this.resetElements('update');
				this.form = {
					...data
				};
			},
			// 重置表单
			resetForm() {
				this.form = {
					name: '',
					sort: 50
				};
			},
			// 重置元素
			resetElements(val = 'create') {
				this.$nextTick(() => {
					this.$refs.form.clearValidate();
				});
				this.formStatus = val;
				this.formLoading = false;
			},
			// 新增分类表单初始化
			handleCreate(status) {
				this.resetForm();
				this.resetElements(status);

				if (this.$refs.tree.getCurrentKey()) {
					this.$refs.tree.setCurrentKey(null);
				}
			},
			// 新增分类
			create() {
				this.$refs.form.validate(valid => {
					if (valid) {
						const temp = {
							name: this.form.name,
							sort: this.form.sort
						};
						this.formLoading = true;
						createdDetectionCategory(temp).then(response => {
							this.init();
							this.resetForm();
							this.$message.success('操作成功');
						}).finally(() => {
							this.formLoading = false;
						});
					}
				});
			},
			// 更新分类
			update() {
				this.$refs.form.validate(valid => {
					if (valid) {
						const temp = {
							id: this.form.id,
							name: this.form.name,
							sort: this.form.sort
						};
						this.formLoading = true;
						updateDetectionCategory(temp).then(response => {
							this.init();
							this.$message.success('操作成功');
						}).finally(() => {
							this.formLoading = false;
						});
					}
				});
			},
			// 删除分类
			remove(id) {
				const node = this.$refs.tree.getNode(id);
				this.$confirm('确定要执行该操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					closeOnClickModal: false
				}).then(() => {
					delDetectionCategory(id)
						.then(() => {
							this.$refs.tree.remove(node);
							this.handleCreate('create');
							this.$message.success('操作成功');
						});
				}).catch(() => {});
			}
		}
	};
</script>

<style scoped>

</style>
