<template>
	<div class="el-card" :class="shadow ? 'is-' + shadow + '-shadow' : 'is-always-shadow'">
		<div v-if="$slots.header || header" class="el-card__header" :style="headerStyle">
			<slot name="header">{{ header }}</slot>
		</div>
		<div class="el-card__body" :style="bodyStyle">
			<slot />
		</div>
		<div v-if="$slots.footer || footer" class="el-card__footer">
			<slot name="footer">{{ footer }}</slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'LCard',
		props: {
			header: {},
			footer: {},
			bodyStyle: {},
			headerStyle: {},
			shadow: {
				type: String
			}
		}
	};
</script>

<style lang="scss" scoped>
	.el-card {
		/*border-width: 0;*/

		.el-card__footer {
			/*background: #e6ebf5;*/
			background: #e6ebf5;
			padding: 20px;
		}
	}
</style>
