import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateAndDownloadPDF = async (element: HTMLElement, fileName: string) => {
    try {
        // Create canvas from the element
        const canvas = await html2canvas(element, {
            scale: 2,
            logging: false,
            useCORS: true
        });

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 295; // A4 height in mm
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add pages for remaining height
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Download the PDF
        pdf.save(fileName);
        
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return false;
    }
};