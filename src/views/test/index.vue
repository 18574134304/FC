<template>
	<div class="app-container test-container">
		<el-card>
			<l-image-upload
					v-model="fileList"
					:file-url="fileUrl"
				/>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'Test',
		data() {
			return {
				// fileUrl: 'http://hy.com/storage/2021/01/13/askMrfXnRWqRy3O7pubO5S6tcrhSuHZbHKUvAYL6.jpg',
				fileUrl: 'http://hy.com/storage/2021/01/11/9ljXnH6Liw4XxVsNsgmvUOe1Fp1r7Y49x6EK1qnO.jpg',
				fileList: '2021/01/11/9ljXnH6Liw4XxVsNsgmvUOe1Fp1r7Y49x6EK1qnO.jpg'
				// fileList: [
				// 	'2021/01/11/9ljXnH6Liw4XxVsNsgmvUOe1Fp1r7Y49x6EK1qnO.jpg',
				// 	'2021/01/11/crRnT8Aw3A3XzC0d7fDZksN3xVqdLaroAarEvA8S.gif'
				// ],
				// fileUrl: [
				// 	'http://hy.com/storage/2021/01/11/9ljXnH6Liw4XxVsNsgmvUOe1Fp1r7Y49x6EK1qnO.jpg',
				// 	'http://hy.com/storage/2021/01/11/crRnT8Aw3A3XzC0d7fDZksN3xVqdLaroAarEvA8S.gif'
				// ]
			};
		}
	};
</script>

<style scoped>

</style>
