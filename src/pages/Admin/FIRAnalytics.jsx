import React, { useEffect, useState } from 'react';
import PaytmCard from '../../components/PaytmCard';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const FIRAnalytics = () => {
  const [firs, setFirs] = useState([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setFirs(JSON.parse(localStorage.getItem('firs') || '[]'));
  }, []);

  // Group by date
  const dataByDate = firs.reduce((acc, fir) => {
    acc[fir.date] = (acc[fir.date] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(dataByDate),
    datasets: [
      {
        label: 'FIRs per Day',
        data: Object.values(dataByDate),
        backgroundColor: '#1877f2',
      },
    ],
  };

  const exportCSV = () => {
    let csv = 'Date,FIR Count\n';
    Object.entries(dataByDate).forEach(([date, count]) => {
      csv += `${date},${count}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fir-analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = async () => {
    setExporting(true);
    const pdfContent = document.getElementById('fir-analytics-chart');
    if (!pdfContent) return;
    // Use html2canvas and jsPDF for PDF export
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    const canvas = await html2canvas(pdfContent);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape' });
    pdf.addImage(imgData, 'PNG', 10, 10, 270, 80);
    pdf.save('fir-analytics.pdf');
    setExporting(false);
  };

  return (
    <PaytmCard>
      <h2>FIR Analytics</h2>
      <div style={{display:'flex',gap:12,marginBottom:16}}>
        <button className="paytm-btn" onClick={exportCSV}>Export CSV</button>
        <button className="paytm-btn" onClick={exportPDF} disabled={exporting}>{exporting ? 'Exporting...' : 'Export PDF'}</button>
      </div>
      {firs.length === 0 ? <p>No FIRs to analyze.</p> : <div id="fir-analytics-chart"><Bar data={chartData} /></div>}
    </PaytmCard>
  );
};

export default FIRAnalytics;
