<template>
	<div v-loading="listLoading" class="app-container">
		<el-card class="cs-card">
			<i class="el-icon-data-line cs-pb">
				<span class="cs-p-5">今日概况</span>
			</i>
			<div flex="cross:center main:center">
				<div flex-box="1" class="cs-today">
					<div class="cs-today__icon cs-fcr cs-pr-10">
						<i class="el-icon-tickets" />
					</div>
					<div class="cs-today__info link">
						<span class="cs-today__number">{{ today_outline.order_total }}</span>
						<span class="cs-today__desc">订单数</span>
					</div>
				</div>
				<div flex-box="1" class="cs-today">
					<div class="cs-today__icon cs-fcr cs-pr-10">
						<i class="el-icon-circle-check" />
					</div>
					<div class="cs-today__info link">
						<span class="cs-today__number">{{ today_outline.complete_total }}</span>
						<span class="cs-today__desc">完成数</span>
					</div>
				</div>
				<div flex-box="1" class="cs-today">
					<div class="cs-today__icon cs-fcr cs-pr-10">
						<i class="el-icon-user" />
					</div>
					<div class="cs-today__info link">
						<span class="cs-today__number">{{ today_outline.user_total }}</span>
						<span class="cs-today__desc">新增会员</span>
					</div>
				</div>
				<div flex-box="1" class="cs-today">
					<div class="cs-today__icon cs-fcr cs-pr-10">
						<i class="el-icon-bank-card" />
					</div>
					<div class="cs-today__info link">
						<span class="cs-today__number">{{ today_outline.recharge_total }}</span>
						<span class="cs-today__desc">充值单</span>
					</div>
				</div>
				<div flex-box="1" class="cs-today">
					<div class="cs-today__icon cs-fcr cs-pr-10">
						<i class="el-icon-money" />
					</div>
					<div class="cs-today__info link">
						<span class="cs-today__number">{{ today_outline.withdraw_total }}</span>
						<span class="cs-today__desc">提现单</span>
					</div>
				</div>
			</div>
		</el-card>
		<el-row :gutter="10">
			<el-col :span="14">
				<el-card class="cs-card">
					<i class="el-icon-s-flag cs-pb">
						<span class="cs-p-5">订单状态</span>
					</i>
					<div flex="cross:center main:center">
						<div flex-box="1">
							<div class="cs-order cs-tc link">
								<span class="cs-order__number">{{ order_outline.not_paid }}</span>
								<span class="cs-order__desc">待付款</span>
							</div>
						</div>
						<div flex-box="1">
							<div class="cs-order cs-tc link">
								<span class="cs-order__number">{{ order_outline.paid }}</span>
								<span class="cs-order__desc">已付款</span>
							</div>
						</div>
						<div flex-box="1">
							<div class="cs-order cs-tc link">
								<span class="cs-order__number">{{ order_outline.not_shipped }}</span>
								<span class="cs-order__desc">待发货</span>
							</div>
						</div>
						<div flex-box="1">
							<div class="cs-order cs-tc link">
								<span class="cs-order__number">{{ order_outline.shipped }}</span>
								<span class="cs-order__desc">已发货</span>
							</div>
						</div>
					</div>
				</el-card>
				<el-card class="cs-card">
					<i class="el-icon-collection-tag cs-pb">
						<span class="cs-p-5">今日订单量</span>
					</i>
					<line-chart :chart-data="lineChartData" />
				</el-card>
			</el-col>
			<el-col :span="10">10</el-col>
		</el-row>
	</div>
</template>

<script>
	import { getIndex } from '@/api/index';
	import LineChart from './components/LineChart';
	const lineChartData = {
		today_order: {
			order_data: [100, 120, 161, 134, 105, 160, 165, 100, 120, 161, 134, 105, 160, 165, 100, 120, 161, 134, 105, 160, 165, 100, 120, 161]
		}
	};

	export default {
		name: 'Dashboard',
		components: {
			LineChart
		},
		data() {
			return {
				listLoading: true,
				today_outline: {
					complete_total: 0,
					order_total: 0,
					recharge_total: 0,
					user_total: 0,
					withdraw_total: 0
				},
				order_outline: {
					not_paid: 0,
					not_shipped: 0,
					paid: 0,
					shipped: 0
				},
				lineChartData: {
					date: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09'],
					value: [0, 0, 0, 0, 0, 0, 0, 0, 0]
				}
			};
		},
		computed: {

		},
		mounted() {
			this.getIndex();
		},
		methods: {
			getIndex() {
				try {
					getIndex().then(response => {
						this.listLoading = false;
						this.order_outline = response.data.order_outline;
						this.today_outline = response.data.today_outline;
						this.lineChartData.date = response.data.order_today_line.date;
						this.lineChartData.value = response.data.order_today_line.value;
					});
				} catch (e) {
					console.log(e);
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
.cs-card {
    font-size: 14px;
    margin-bottom: 20px;
}
.cs-pb {
    padding-bottom: 20px!important;
}
.cs-p-5 {
    padding: 5px!important;
}
.cs-pr-10 {
    padding-right: 10px!important;
}
.cs-fcr {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-direction: normal;
}
[flex] {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
}
[flex~="cross:center"] {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}
[flex~="main:center"] {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
}
[flex-box="1"] {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-negative: 1;
    flex-shrink: 1;
}
.cs-today {
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    .cs-today__icon i {
        font-size: 40px;
        color: #909399;
    }
    .cs-today__info {
        line-height: 24px;
        .cs-today__number {
            display: block;
            font-size: 24px;
        }
        .cs-today__desc {
            color: #909399;
        }
    }
}
.cs-tc {
    text-align: center;
}
.cs-order {
    span {
        display: block;
    }
    .cs-order__number {
        font-size: 24px;
    }
    .cs-order__desc {
        color: #909399;
    }
}
</style>
