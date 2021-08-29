<template>
	<div class="app-container">
		<el-form
				ref="dataForm"
				v-loading="loading"
				:rules="rules"
				:model="info"
				label-position="left"
				label-width="70px"
				style="width: 400px; margin-left:50px;"
			>
			<el-form-item label="部门名称">
				<el-input v-model="info.name" placeholder="请填写部门名称" />
			</el-form-item>
			<el-form-item label="部门权限">
				<el-tree
						ref="tree"
						:data="treeData"
						show-checkbox
						:props="defaultProps"
						node-key="value"
						:default-checked-keys="info.permission"
						@check-change="handleCheckChange"
					/>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="$emit('dialog-close')">
				取消
			</el-button>
			<el-button type="primary" @click="updateData(info.id)">
				保存
			</el-button>
		</div>
	</div>
</template>

<script>
	import { createRole, updateRole } from '@/api/admin';

	export default {
		name: 'DialogRoleForm',
		props: {
			// 接收
			data: {
				type: Object,
				default() {
					return {
						id: undefined,
						name: '',
						permission: []
					};
				}
			}
		},
		data() {
			return {
				loading: false,
				info: this.data,
				rules: {
					type: [{ required: true, message: 'type is required', trigger: 'change' }],
					timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
					title: [{ required: true, message: 'title is required', trigger: 'blur' }]
				},
				treeData: [{
					value: 'index',
					label: '首页'
				}, {
					value: 'user',
					label: '用户管理',
					children: [{
						value: 'userList',
						label: '用户列表'
					}, {
						value: 'levelList',
						label: '等级列表'
					}]
				}, {
					value: 'shop',
					label: '商家管理',
					children: [{
						value: 'merchantList',
						label: '商户列表'
					}, {
						value: 'shopList',
						label: '商家列表'
					}]
				}, {
					value: 'finance',
					label: '财务管理',
					children: [{
						value: 'statement',
						label: '财务列表'
					}, {
						value: 'withdraws',
						label: '提现列表'
					}, {
						value: 'userReport',
						label: '用户报表'
					}, {
						value: 'orderReport',
						label: '订单报表'
					}, {
						value: 'redReportList',
						label: '红包列表'
					}, {
						value: 'rewardReport',
						label: '奖金报表'
					}, {
						value: 'dividendsReport',
						label: '分红报表'
					}]
				}, {
					value: 'order',
					label: '订单管理',
					children: [{
						value: 'orderList',
						label: '订单列表'
					}]
				}, {
					value: 'goods',
					label: '商品管理',
					children: [{
						value: 'goodsList',
						label: '商品列表'
					}, {
						value: 'goodsCategories',
						label: '商品分类'
					}]
				}, {
					value: 'group',
					label: '拼团管理',
					children: [{
						value: 'groupList',
						label: '拼团列表'
					}]
				}, {
					value: 'statistics',
					label: '数据概述',
					children: [{
						value: 'userData',
						label: '用户数据'
					}, {
						value: 'orderData',
						label: '订单数据'
					}, {
						value: 'financeData',
						label: '财务数据'
					}]
				}, {
					value: 'article',
					label: '文章管理',
					children: [{
						value: 'articleList',
						label: '文章列表'
					}]
				}, {
					value: 'task',
					label: '任务管理',
					children: [{
						value: 'taskList',
						label: '任务列表'
					}]
				}, {
					value: 'detection',
					label: '发现管理',
					children: [{
						value: 'detectionList',
						label: '发现列表'
					}, {
						value: 'detectionCategory',
						label: '发现分类'
					}]
				}, {
					value: 'admin',
					label: '后台管理',
					children: [{
						value: 'adminList',
						label: '管理员列表'
					}, {
						value: 'adminDepartment',
						label: '部门列表'
					}]
				}, {
					value: 'config',
					label: '系统配置',
					children: [{
						value: 'configIndex',
						label: '系统配置'
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'label'
				}
			};
		},
		methods: {
			handleCheckChange(data, checked, indeterminate) {
				let res = this.$refs.tree.getCheckedNodes();
				let arr = [];
				res.forEach((item) => {
					arr.push(item.value);
				});
				let menuArr = this.unique(arr); // 去除重复的节点
				this.info.permission = menuArr;
			},
			// 数组去重
			unique(arr) {
				let newArr = [];
				let len = arr.length;
				for (let i = 0; i < len; i++) {
					if (newArr.indexOf(arr[i]) == -1) {
						newArr.push(arr[i]);
					}
				}
				return newArr;
			},
			updateData(status) {
				if (status) {
					this.$refs['dataForm'].validate((valid) => {
						if (valid) {
							const tempData = Object.assign({}, this.info);
							updateRole(tempData).then(response => {
								this.$notify({
									title: 'Success',
									message: 'Update Successfully',
									type: 'success',
									duration: 2000
								});
								this.$emit('dialog-close');
							});
						}
					});
				} else {
					this.$refs['dataForm'].validate((valid) => {
						if (valid) {
							console.log(this.info);
							createRole(this.info).then(response => {
								this.info.id = response.data;
								this.$emit('dialog-close');
								this.$emit('success', this.info);
								this.$notify({
									title: 'Success',
									message: 'Created Successfully',
									type: 'success',
									duration: 2000
								});
							});
						}
					});
				}
			}
		}
	};
</script>

<style scoped>

</style>
