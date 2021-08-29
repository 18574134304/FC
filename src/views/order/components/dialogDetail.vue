<template>
	<div class="app-container">
		<div class="el-card box-card is-never-shadow">
			<div class="el-row">
				<div class="order-left cs-pr el-col el-col-9">
					<p class="card-title">订单信息</p>
					<div class="order-info">
						<div class="dt">订单号</div>
						<div class="dd">{{ info.trade_no }}</div>
					</div>
					<div class="order-info">
						<div class="dt">支付流水号</div>
						<div class="dd"> {{ info.pay_trade_no }} </div>
					</div>
					<div class="order-info">
						<div class="dt">订单来源</div>
						<div class="dd">APP</div>
					</div>
					<div class="order-info">
						<div class="dt">支付方式</div>
						<div class="dd">
							<span v-if="info.statement_info"> {{ info.statement_info.type | payTypeFilter }} </span>
						</div>
					</div>
					<div class="order-info">
						<div class="dt">买家</div>
						<div class="dd">
							<span data-v-14f2c98e="">{{ info.user_info.username }}</span>
							<div class="el-image level-icon">
								<img
										src="https://aliyun.oss.careyshop.cn/会员等级/level5.png?type=aliyun"
										class="el-image__inner"
										style="object-fit: fill"
									>
							</div>
						</div>
					</div>
					<div class="order-info">
						<div class="dt">买家备注</div>
						<div class="dd"> {{ info.remark }} </div>
					</div>
					<el-divider />
					<div class="order-info">
						<div class="dt">收货人姓名</div>
						<div class="dd">{{ info.name }}</div>
					</div>
					<div class="order-info">
						<div class="dt">收货地址</div>
						<div class="dd">{{ region }} {{ info.address }}</div>
					</div>
					<div class="order-info">
						<div class="dt">配送方式</div>
						<div class="dd">快递配送</div>
					</div>
					<!---->
					<div class="order-info">
						<div class="dt">收货人手机</div>
						<div class="dd">{{ info.phone_number }}</div>
					</div>
					<el-divider />
					<div class="order-info">
						<div class="dt">卖家备注</div>
						<div class="dd">{{ info.refund_explain }}</div>
					</div>
				</div>
				<div class="cs-pl el-col el-col-15">
					<p class="card-title">订单状态</p>
					<el-steps :active="active">
						<el-step title="创建订单" icon="el-icon-edit-outline" />
						<el-step title="付款完成" icon="el-icon-bank-card" />
						<el-step title="配货中" icon="el-icon-receiving" />
						<el-step title="发货" icon="el-icon-truck" />
						<el-step title="完成" icon="el-icon-circle-check" />
					</el-steps>
					<el-divider />
					<div style="display: inline-flex;">
						<el-button type="default" size="small">
							备注
						</el-button>
						<el-button v-if="info.status < 30" type="default" size="small" @click="updateDeliveryInfo()">
							修改订单
						</el-button>
						<el-button v-if="info.status == 10" type="default" size="small" @click="updateStatus(20)">
							设为配货
						</el-button>
						<el-button v-if="info.status == 20" type="default" size="small" @click="updateStatus(10)">
							取消配货
						</el-button>
						<el-button v-if="info.status == 20" type="default" size="small" @click="updateShip()">
							确定发货
						</el-button>
						<!--						<el-button type="default" size="small" @click="cancelOrder()">-->
						<!--							取消订单-->
						<!--						</el-button>-->
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { updateOrderStatus } from '@/api/order';
	import { CodeToText } from 'element-china-area-data';
	import DialogUpdateDeliveryInfo from '@/views/order/components/dialogUpdateDeliveryInfo';
	import DialogShip from '@/views/order/components/dialogShip';
	export default {
		name: 'DialogDetail',
		filters: {
			payTypeFilter(type) {
				const statusMap = {
					1: '余额支付',
					2: '金花支付',
					3: '积分支付'
				};
				return statusMap[type];
			}
		},
		props: {
			data: {
				type: Object,
				default() {
					return {};
				}
			}
		},
		data() {
			return {
				info: this.data,
				region: CodeToText[String(this.data.province_code)] + CodeToText[String(this.data.city_code)] + CodeToText[String(this.data.county_code)],
				active: 0
			};
		},
		mounted() {
			switch (this.info.status) {
			case 0:
				this.active = 0;
				break;
			case 10:
				this.active = 1;
				break;
			case 20:
				this.active = 2;
				break;
			case 30:
				this.active = 4;
				break;
			case 70:
				this.active = 5;
				break;
			default:
				break;
			}
		},
		methods: {
			updateDeliveryInfo() {
				this.$dialog('修改订单', DialogUpdateDeliveryInfo, { data: this.info }, { inBody: true, width: '600px' }).$on('success', result => {
					console.log(result);
				});
			},
			updateStatus(value) {
				const temp = {
					id: this.info.id,
					status: value
				};
				this.$confirm('确定要执行该操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					updateOrderStatus(temp).then(response => {
						this.info.status = value;
						if (this.info.status == 0) {
							this.active = 0;
						} else if (this.info.status == 10) {
							this.active = 1;
						} else if (this.info.status == 20) {
							this.active = 2;
						} else if (this.info.status == 40) {
							this.active = 4;
						} else if (this.info.status == 50) {
							this.active = 5;
						}
					});
				}).catch(() => {});
			},
			updateShip() {
				this.$dialog('确认发货', DialogShip, { id: this.info.id }, { inBody: true, width: '700px' }).$on('success', result => {
					if (result.status == 30) {
						this.active = 3;
						this.info.status = 30;
					}
				});
			},
			cancelOrder() {
				this.$confirm('确定要执行该操作吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(1);
					// updateUserWithdraw(this.info).then(response => {
					//     // this.$set(this.info, this.info);
					// });
				}).catch(() => {});
			}
		}
	};
</script>

<style lang="scss" scoped>
    .el-card {
        padding: 20px;
    }
    .order-left {
        margin-bottom: 20px;
        border-right: 1px solid #dcdfe6;
        .level-icon {
            margin-left: 5px;
            line-height: 0;
            vertical-align: text-bottom;
        }
    }
    .cs-pr {
        padding-right: 20px!important;
    }
    .card-title {
        margin-top: 0;
    }
    .order-info {
        display: table;
        font-size: 14px;
        line-height: 28px;
        .dt {
            float: left;
            width: 100px;
            color: #99a9bf;
        }
        .dd {
            padding-left: 100px;
        }
    }
    .cs-pl {
        padding-left: 20px!important;
    }
</style>
