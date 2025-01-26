import { Patient } from '../hooks/usePatients';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

export const exportToCSV = (patients: Patient[]) => {
  const data = patients.map(patient => ({
    'First Name': patient.first_name,
    'Last Name': patient.last_name,
    'Email': patient.email,
    'Phone': patient.phone,
    'Date of Birth': format(new Date(patient.date_of_birth), 'MM/dd/yyyy'),
    'Address': patient.address,
    'Created At': format(new Date(patient.created_at), 'MM/dd/yyyy HH:mm:ss'),
    'Updated At': format(new Date(patient.updated_at), 'MM/dd/yyyy HH:mm:ss')
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `patients_${format(new Date(), 'yyyy-MM-dd_HHmm')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (patients: Patient[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Patient List', 14, 22);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on ${format(new Date(), 'MM/dd/yyyy HH:mm:ss')}`, 14, 30);
  
  const tableColumn = [
    'Name',
    'Email',
    'Phone',
    'Date of Birth',
    'Address'
  ];
  
  const tableRows = patients.map(patient => [
    `${patient.first_name} ${patient.last_name}`,
    patient.email,
    patient.phone,
    format(new Date(patient.date_of_birth), 'MM/dd/yyyy'),
    patient.address
  ]);

  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 50 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 45 }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: 255
    }
  });

  doc.save(`patients_${format(new Date(), 'yyyy-MM-dd_HHmm')}.pdf`);
};
