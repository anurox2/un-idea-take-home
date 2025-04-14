export const exportPerformanceDataToCSV = (performanceData) => {
  const headers = [
    'Timestamp',
    'Method',
    'Fetch Time (ms)',
    'Users Count',
    'Projects Count',
    'Page Number',
    'Page Switch Time (ms)'
  ];
  
  const csvData = performanceData.map(row => [
    row.timestamp,
    row.method,
    row.fetchTime.toFixed(2),
    row.usersCount,
    row.projectsCount,
    row.pageNumber || 'N/A',
    row.pageSwitchTime ? row.pageSwitchTime.toFixed(2) : 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `performance_comparison_${new Date().toISOString()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};