<template>
	<div v-loading="isInit" class="app-container goods-edit-container">
		<el-card>
			<el-form ref="form" v-loading="loading" :model="goods" label-width="100px">
				<el-tabs v-model="activeName">
					<el-tab-pane label="基础信息" name="basics">
						<el-form-item
								prop="title"
								label="商品名称"
								:rules="[
									{ required: true, message: '商品名称不能为空' }
								]"
							>
							<el-input v-model="goods.title" />
						</el-form-item>
						<el-form-item
								prop="category_id"
								label="商品分类"
								:rules="[
									{ required: true, message: '请选择商品分类' }
								]"
							>
							<el-cascader v-if="isShowCategory" v-model="goods.category_id" :props="props" :placeholder="categoryIdCascaderPlaceholder" clearable>
								<template slot-scope="{ node, data }">
									<span>{{ data.label }}</span>
									<span v-if="!node.isLeaf"> ({{ data.has_children_count }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
						<el-form-item prop="summary" label="商品描述">
							<el-input v-model="goods.summary" type="textarea" :rows="2" />
						</el-form-item>
						<el-form-item prop="image" label="商品图片">
							<l-image-upload
									v-model="goods.image"
									type="list"
									:file-url="goods.images_list"
								/>
						</el-form-item>
						<el-form-item prop="stock" label="库存">
							<el-input v-model="goods.stock" type="number" :min="0" />
						</el-form-item>
						<el-form-item prop="unit" label="计量单位">
							<el-input v-model="goods.unit" type="text" placeholder="例如：1罐 / 罐 / 台 / 箱" />
						</el-form-item>
						<el-form-item prop="post_charge" label="配送费">
							<el-input v-model="goods.post_charge" type="number" :min="0">
								<template slot="prepend">¥</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="base_price" label="底价">
							<el-input v-model="goods.base_price" type="number" :min="0">
								<template slot="prepend">¥</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="market_price" label="市场价">
							<el-input v-model="goods.market_price" type="number" :min="0">
								<template slot="prepend">¥</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="sale_price" label="销售价">
							<el-input v-model="goods.sale_price" type="number" :min="0">
								<template slot="prepend">¥</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="sale_price" label="活跃值">
							<el-input v-model="goods.active_value" type="number" :min="0" />
						</el-form-item>
						<el-form-item prop="sale_price" label="PV值">
							<el-input v-model="goods.pv" type="number" :min="0" />
						</el-form-item>
						<el-form-item prop="is_master" label="茯茶商品">
							<el-radio-group v-model="goods.is_master">
								<el-radio :label="0">否</el-radio>
								<el-radio :label="1">是</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item prop="is_push,is_group_buy" label="商品服务">
							<el-checkbox v-model="goods.is_push" :true-label="1" :false-label="0">推荐</el-checkbox>
							<el-checkbox v-model="goods.is_group_buy" :true-label="1" :false-label="0">拼团</el-checkbox>
							<el-form-item v-if="goods.is_group_buy" prop="group_buy_price" style="display: inline-block; margin-left: 10px;">
								<el-input v-model="goods.group_buy_price" type="number" :min="0" placeholder="团购价">
									<template slot="prepend">¥</template>
								</el-input>
							</el-form-item>
						</el-form-item>
						<el-form-item prop="status" label="商品状态">
							<el-radio-group v-model="goods.status">
								<el-radio :label="0">下架</el-radio>
								<el-radio :label="1">上架</el-radio>
								<el-radio :label="2">隐藏</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="商品详情" name="detail">
						<el-form-item prop="detail">
							<WEditor v-model="goods.detail" :upload-img-config="{url:uploadApi, fileName:'files'}" @change="WEditorChange" />
						</el-form-item>
					</el-tab-pane>
				</el-tabs>
				<el-form-item label-width="0">
					<el-button type="primary" @click="submitForm()">提交</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script>
	import WEditor from '@/components/WangeEditor';
	import { getCategoriesList, editGoods, getGoods } from '../../api/goods';

	export default {
		name: 'EditGoods',
		components: { WEditor },
		data() {
			return {
				uploadApi: process.env.VUE_APP_IMAGE_BASE_API + '/upload/upload',
				isUpEditor: false,
				isShowCategory: false,
				categoryIdCascaderPlaceholder: '请选择',
				dialogImageUrl: '',
				dialogVisible: false,
				isInit: true,
				activeName: 'basics',
				loading: false,
				categoryLoading: false,
				props: {
					// checkStrictly: true,
					lazy: true,
					lazyLoad: this.categoryIdLazyLoad
				},
				goods: {
					title: '',
					is_master: '0',
					summary: '',
					image: [],
					stock: 0,
					unit: '',
					post_charge: 0,
					base_price: 0,
					market_price: 0,
					sale_price: 0,
					is_push: 0,
					is_group_buy: 0,
					group_buy_price: 0,
					detail: '',
					category_id: '',
					pv: 0,
					active_value: 0
				},
				id: this.$route.query.id
			};
		},
		computed: {
			goodsData() {
				return {
					...this.goods
				};
			}
		},
		watch: {
			'$route.query.id': function(newVal, oldVal) {
				if (newVal !== oldVal) {
					this.id = this.$route.query.id;
					this.init();
				}
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			async init() {
				if (this.id) {
					this.categoryIdCascaderPlaceholder = '加载中...';
					await this.getGoodsInfo();
				}
				this.isInit = false;
				this.isShowCategory = true;
			},
			async categoryIdLazyLoad(node, resolve) {
				let param = {};
				if (!node.root) {
					param.parent_id = node.value;
				}
				try {
					let response = await getCategoriesList(param);
					if (response.code === 0) {
						let nodes = response.data.map(n => ({
							value: n.id,
							label: n.name,
							has_children_count: n.has_children_count,
							disabled: n.has_children_count <= 0 && node.level === 0,
							leaf: n.has_children_count <= 0
						}));
						resolve(nodes);
					}
				} catch (e) {
					console.log(e);
				}
			},
			async getGoodsInfo() {
				this.isUpEditor = true;
				try {
					let response = await getGoods(this.id);
					if (response.code === 0) {
						this.goods = response.data;
					}
					this.$nextTick(_ => {
						this.isUpEditor = false;
					});
				} catch (e) {
					console.log(e);
				}
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			async edit() {
				try {
					await editGoods(this.goodsData);
					this.$message.success(['添加', '修改'][+!!this.id] + '成功');
					// 调用全局挂载的方法
					this.$store.dispatch('tagsView/delView', this.$route);
					// 返回上一步路由
					this.$router.go(-1);
				} catch (e) {
					console.log(e);
				}
			},
			WEditorChange(val) {
				// console.log(val);
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
			}
		}
	};
</script>

<style lang="scss">
	.goods-edit-container {
		.tinymce-container {
			.mce-panel {
				box-sizing: border-box;
			}
		}
	}
</style>
