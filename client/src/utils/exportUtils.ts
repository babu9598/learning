import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToCsv = (filename: string, rows: object[]) => {
  if (!rows || !rows.length) return;
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map((row: any) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : row[k];
            cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
            if (cell.search(/("|,|\n)/g) >= 0) {
              cell = `"${cell}"`;
            }
            return cell;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPdf = (title: string, columns: string[], data: any[][], filename: string) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 14, 25);

  autoTable(doc, {
    head: [columns],
    body: data,
    startY: 30,
    theme: 'grid',
    headStyles: { fillColor: [22, 163, 74], textColor: 255 },
    styles: { fontSize: 8, cellPadding: 3 },
  });

  doc.save(`${filename}_${new Date().toISOString().slice(0, 10)}.pdf`);
};
