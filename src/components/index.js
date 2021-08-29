import dialog from './DialogWrap/dialog-wrap';
import drawer from './DrawerWrap/drawer-wrap';
import confirmSwitch from './ConfirmSwitch';
import PopInputBox from './PopInputBox';
import lImg from './LImg';
import lCard from './LCard';
import LImgUpload from './LImgUpload';
import LFileUpload from './LFileUpload';
import LImageUpload from './LImageUpload';

export default {
	install(vue) {
		vue.use(dialog);
		vue.use(drawer);
		vue.component(confirmSwitch.name, confirmSwitch);
		vue.component(PopInputBox.name, PopInputBox);
		vue.component(lImg.name, lImg);
		vue.component(lCard.name, lCard);
		vue.component(LImgUpload.name, LImgUpload);
		vue.component(LFileUpload.name, LFileUpload);
		vue.component(LImageUpload.name, LImageUpload);
	}
};
