export const generatePayrollCSV = (data: Employee[]) => {
    const columns = ['id', 'name', 'position', 'branch', 'baseSalary', 'tax', 'bonus', 'deductions', 'netPay', 'status', 'payDate'];
    const csvHeader = columns.join(',');
    const csvRows = data.map(row => columns.map(col => row[col]).join(',')).join('\n');
    const csv = csvHeader + '\n' + csvRows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payroll.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  export const generateEmployeesCSV = (data: Employee[]) => {
    const columns = ['id', 'name', 'position', 'branch', 'baseSalary'];
    const csvHeader = columns.join(',');
    const csvRows = data.map(row => columns.map(col => row[col]).join(',')).join('\n');
    const csv = csvHeader + '\n' + csvRows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    URL.revokeObjectURL(url);
  };