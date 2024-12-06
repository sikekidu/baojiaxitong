import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateQuotationPDF = async (quotation, items) => {
  const doc = new PDFDocument();
  const filename = `quotation-${quotation.id}-${Date.now()}.pdf`;
  const filePath = path.join('uploads', 'quotations', filename);
  
  doc.pipe(fs.createWriteStream(filePath));

  // 添加页眉
  doc.fontSize(20).text('盾构机后配套报价单', { align: 'center' });
  doc.moveDown();

  // 添加项目信息
  doc.fontSize(12)
    .text(`项目名称: ${quotation.projectName}`)
    .text(`项目类型: ${quotation.projectType}`)
    .text(`盾构机直径: ${quotation.diameter}米`)
    .text(`报价日期: ${new Date().toLocaleDateString()}`);
  
  doc.moveDown();

  // 添加物品清单
  doc.fontSize(14).text('配置清单', { underline: true });
  doc.moveDown();

  // 表格头部
  const tableTop = doc.y;
  const itemX = 50;
  const quantityX = 300;
  const priceX = 400;
  const totalX = 500;

  doc.fontSize(10)
    .text('物品名称', itemX, tableTop)
    .text('数量', quantityX, tableTop)
    .text('单价(元)', priceX, tableTop)
    .text('总价(元)', totalX, tableTop);

  let y = tableTop + 20;

  // 添加物品行
  items.forEach(item => {
    if (y > 700) { // 如果接近页面底部，添加新页
      doc.addPage();
      y = 50;
    }

    doc.text(item.itemName, itemX, y)
      .text(item.quantity.toString(), quantityX, y)
      .text(item.unitPrice.toFixed(2), priceX, y)
      .text((item.quantity * item.unitPrice).toFixed(2), totalX, y);

    y += 20;
  });

  // 添加总计
  doc.moveDown()
    .fontSize(12)
    .text(`总计: ${quotation.totalAmount.toFixed(2)}元`, { align: 'right' });

  // 添加页脚
  doc.fontSize(10)
    .text('注: 本报价单有效期为30天', 50, doc.page.height - 50);

  doc.end();
  return filename;
};