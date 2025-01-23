import { saveAs } from 'file-saver';

export const exportToCSV = (data: any[], filename: string) => {
  // Convert data to CSV format
  const csvContent = [
    // Headers
    Object.keys(data[0]).join(','),
    // Data rows
    ...data.map(item => Object.values(item).join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportToExcel = (data: any[], filename: string) => {
  // In production, use a library like xlsx
  console.log('Exporting to Excel:', data);
  alert('Excel export not implemented in demo');
};

export const exportToPDF = (data: any[], filename: string) => {
  // In production, use a library like pdfmake
  console.log('Exporting to PDF:', data);
  alert('PDF export not implemented in demo');
};