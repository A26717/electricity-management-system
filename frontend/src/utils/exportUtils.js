import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (data, filename, columns) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToPDF = (data, filename, columns) => {
  const doc = new jsPDF();
  doc.text(filename, 14, 15);
  
  const tableData = data.map(item => 
    columns.map(col => item[col.dataIndex] || '')
  );
  
  autoTable(doc, {
    head: [columns.map(col => col.title)],
    body: tableData,
    startY: 25,
  });
  
  doc.save(`${filename}.pdf`);
};

export const exportToCSV = (data, filename) => {
  const headers = Object.keys(data[0] || {});
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
};