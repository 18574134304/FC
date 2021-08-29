<template>
	<div v-loading="isInit" class="app-container config-container">
		<l-card
				:body-style="{ height: 'calc(100vh - 274px)', paddingTop: 0 }"
				:header-style="{ paddingBottom: 0, borderBottom: 0 }"
			>
			<el-tabs slot="header" v-model="currentTabName">
				<el-tab-pane v-for="tab in tabs" :key="tab.id" :label="tab.name" :name="tab.keywords" :disabled="loading" />
			</el-tabs>
			<div class="config-main-container">
				<div v-loading="loading" class="config-left-container" :style="{ height: 'calc(100vh - 294px)' }">
					<div class="config-main">
						<el-form ref="form" :model="formData" label-width="250px" @keyup.enter.native="handleSubmit">
							<el-form-item v-for="item in formData[currentTabName]" :key="item.id" :label="item.name" :prop="item.keywords">
								<el-input v-model="item.content" :disabled="currentTabName === 'bank'" @input="$forceUpdate()">
									<template v-if="item.extend && item.extend.prepend" slot="prepend">{{ item.extend.prepend }}</template>
									<template v-if="item.extend && item.extend.append" slot="append">{{ item.extend.append }}</template>
								</el-input>
								<div v-if="item.explain" class="form-item-tip" v-html="$options.filters.discerningVariables(item.explain, formData[currentTabName])" />
							</el-form-item>
						</el-form>
					</div>
				</div>
				<div class="config-right-container">
					<l-card :body-style="{ fontSize: '12px', color: '#f56c6c' }">
						<div slot="header">温馨提示</div>
						<div>请谨慎修改各配置项, 改错有可能影响系统的运行</div>
					</l-card>
				</div>
			</div>
			<div slot="footer">
				<el-button type="primary" :loading="loading" @click="handleSubmit">保存</el-button>
				<!--<el-button @click="handleAddConfigGroup">新增配置组</el-button>-->
				<el-button v-if="currentTabName === 'express' || currentTabName === 'bank'" @click="handleAddConfig">新增配置</el-button>
			</div>
		</l-card>
	</div>
</template>

<script>
	import { getConfigCategories, getConfig, editConfig } from '../../api/config';
	import ConfigGroup from './edit-group';
	import Config from './edit';

	export default {
		name: 'Config',
		filters: {
			discerningVariables(msg, data) {
				data.forEach(n => {
					msg = msg.replace('${' + n.keywords + '}', n.content);
				});
				return msg;
			}
		},
		data() {
			return {
				isInit: true,
				currentTabName: '0',
				loading: false,
				tabs: [],
				formData: {

				}
			};
		},
		computed: {
			putData() {
				let data = [];
				this.tabs.forEach(n => {
					if (this.formData[n.keywords] && this.formData[n.keywords].length) {
						this.formData[n.keywords].forEach(n => {
							data.push(n);
						});
					}
				});
				return data;
			}
		},
		watch: {
			currentTabName(newValue) {
				if (!this.formData[newValue]) {
					this.configList();
				}
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			async init() {
				try {
					let response = await getConfigCategories();
					this.tabs = response.data;
					this.currentTabName = this.tabs[0].keywords;
					// this.currentTabName = this.tabs.find(n => n.keywords === 'express').keywords;
				} catch (e) {
					console.log(e);
				}
				this.isInit = false;
			},
			async configList() {
				this.loading = true;
				try {
					let response = await getConfig({ category_id: this.tabs.find(n => n.keywords === this.currentTabName).id });
					if (response.code === 0) {
						this.formData[this.currentTabName] = response.data;
					}
				} catch (e) {
					console.log(e);
				}
				this.loading = false;
			},
			async handleSubmit() {
				this.loading = true;
				try {
					let response = await editConfig(this.putData);
					if (response.code === 0) {
						this.$message.success('修改成功');
					} else {
						response.data.forEach(n => {
							setTimeout(_ => {
								this.$notify.error({
									title: '错误',
									message: n
								});
							}, 1);
						});
					}
				} catch (e) {
					console.log(e);
				}
				this.loading = false;
			},
			handleAddConfigGroup() {
				this.$dialog('新增配置组', ConfigGroup, {}).$on('success', _ => {
					this.init();
				});
			},
			handleAddConfig() {
				this.$dialog('新增配置', Config, {
					category_id: this.tabs.find(n => n.keywords === this.currentTabName).id
				}).$on('success', _ => {
					this.configList();
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.config-container {
		.config-main-container {
			display: flex;
			justify-content: space-between;
			align-content: center;

			.config-left-container {
				flex: 1;
				margin-right: 20px;
				overflow: auto;
				padding-right: 20px;
			}
			.config-right-container {
				flex: 1;
			}
		}

		.el-form {
			min-height: 100px;
		}
	}
</style>
