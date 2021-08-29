const basePath = process.env.VUE_APP_BASE_API;
import { getToken } from '@/utils/auth';
export default {
	basePath,
	token: getToken,
	uploadUrl: process.env.VUE_APP_IMAGE_BASE_API + '/upload/upload',
	imageBaseUrl: process.env.VUE_APP_IMAGE_BASE_API || basePath
};
