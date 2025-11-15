// CSV Export utility for subscriptions
export const exportSubscriptionsToCSV = (subscriptions) => {
  if (!subscriptions || subscriptions.length === 0) {
    alert('No subscriptions to export');
    return;
  }

  // CSV headers
  const headers = [
    'Service Name',
    'Amount (₹)',
    'Category',
    'Renewal Type',
    'Next Renewal Date',
    'Status',
    'Created Date'
  ];

  // Convert subscriptions to CSV format
  const csvData = subscriptions.map(sub => [
    sub.serviceName,
    sub.amount,
    sub.category,
    sub.renewalType,
    new Date(sub.nextRenewalDate).toLocaleDateString('en-IN'),
    sub.status,
    new Date(sub.createdAt || new Date()).toLocaleDateString('en-IN')
  ]);

  // Combine headers and data
  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `subscriptions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Export function for filtered data
export const exportFilteredSubscriptionsToCSV = (subscriptions, filter, sortBy) => {
  let filteredData = [...subscriptions];

  // Apply filter
  if (filter !== 'all') {
    if (['active', 'expired', 'cancelled'].includes(filter)) {
      filteredData = filteredData.filter(sub => sub.status.toLowerCase() === filter);
    } else {
      filteredData = filteredData.filter(sub => sub.category === filter);
    }
  }

  // Apply sort
  filteredData.sort((a, b) => {
    if (sortBy === 'nextRenewalDate') {
      return new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate);
    }
    if (sortBy === 'amount') {
      return b.amount - a.amount;
    }
    if (sortBy === 'serviceName') {
      return a.serviceName.localeCompare(b.serviceName);
    }
    return 0;
  });

  exportSubscriptionsToCSV(filteredData);
};
