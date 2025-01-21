import { saveAs } from 'file-saver';

interface ExportableData {
  [key: string]: string | number | boolean | Date;
}

export const exportToCSV = (data: ExportableData[], filename: string) => {
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

export const exportToExcel = (data: ExportableData[], filename: string) => {
  // Convert data to Excel format
  const csvContent = [
    // Headers
    Object.keys(data[0]).join(','),
    // Data rows
    ...data.map(item => Object.values(item).join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  saveAs(blob, `${filename}-${new Date().toISOString().split('T')[0]}.xls`);
};

export const exportToPDF = (data: ExportableData[], filename: string) => {
  // Convert data to HTML table format
  const tableContent = `
    <table border="1">
      <thead>
        <tr>
          ${Object.keys(data[0]).map(key => `<th>${key}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            ${Object.values(item).map(value => `<td>${value}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Create and download file
  const blob = new Blob([tableContent], { type: 'application/pdf;charset=utf-8;' });
  saveAs(blob, `${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
};