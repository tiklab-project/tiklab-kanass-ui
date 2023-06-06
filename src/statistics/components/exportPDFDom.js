
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * 导出PDF
 * @param {导出后的文件名} title 
 * @param {要导出的dom节点：react使用ref} ele 
 */

const setPdfCanvas = (element, {canvas,scale,width,height}) => {
	return new Promise(resolve => setTimeout(() => {
		const canvasDom = html2canvas(element, {
			useCORS: true,
			canvas,
			scale,
			width,
			height,
			x: 0,
			y: 0,
		})
		resolve(canvasDom);
	}, 2000));
}

const setDom = async (ele, pdf) => {
	const scale = window.devicePixelRatio > 1 ? window.devicePixelRatio : 2;
	let width = 0;
	let height = 0;
	let imageHeightList = [];
	const results = await Promise.all(ele.map(async (element, index) => {
		if (width < element.offsetWidth) {
			width = element.offsetWidth;
		}
		height += element.offsetHeight;
		console.log('height', height)
		console.log('aa', width, height, scale)

		const canvas = document.createElement('canvas');
		canvas.width = element.offsetWidth * scale;
		canvas.height = height * scale;
		var contentWidth = canvas.width;
		var contentHeight = canvas.height;

		console.log('contentWidth', contentWidth, contentHeight)
		//一页pdf显示html页面生成的canvas高度;
		var pageHeight = contentWidth / 592.28 * 841.89;
		//未生成pdf的html页面高度
		var leftHeight = contentHeight;
		console.log('leftHeight', leftHeight)

		//页面偏移
		var position = 0;
		//a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
		var imgWidth = 595.28;
		var imgHeight = 592.28 / contentWidth * contentHeight;
		imageHeightList.push(imgHeight)
		const pdfCanvas = await setPdfCanvas(element, {canvas,scale,width,height})
		const imgDataUrl = pdfCanvas.toDataURL();

		if (height > 14400) { // 超出jspdf高度限制时
			const ratio = 14400 / height;
			// height = 14400;
			width = width * ratio;
		}

		// 缩放为 a4 大小  pdfpdf.internal.pageSize 获取当前pdf设定的宽高
		height = height * pdf.internal.pageSize.getWidth() / width;
		width = pdf.internal.pageSize.getWidth();
		var startHeight = 0;
		if(index > 0){
			startHeight = imageHeightList[index - 1]  + 10
		}
		
		console.log(startHeight)
		if (leftHeight < pageHeight) {
			pdf.addImage(imgDataUrl, 'png', 5, startHeight, imgWidth, imgHeight, `alias${index}`, 'SLOW');
		} else {    // 分页
			while (leftHeight > 0) {
				pdf.addImage(imgDataUrl, 'png', 5, position, imgWidth, imgHeight, `alias${index}`, 'SLOW')
				leftHeight -= pageHeight;
				position -= 841.89;
				//避免添加空白页
				if (leftHeight > 0) {
					pdf.addPage();
				}
			}
		}
		return;
	}));

	return results;
}
export const exportPDF = async (title, ele) => {
	// 根据dpi放大，防止图片模糊
	
	// 下载尺寸 a4 纸 比例
	let pdf = new jsPDF('p', 'pt', 'a4');
    await setDom(ele, pdf)
	// setContent()
	// 导出下载 
	await pdf.save(`${title}.pdf`);
}