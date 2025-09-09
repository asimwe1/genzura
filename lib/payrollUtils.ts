function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }
  
  export const calculatePayDate = (hireDate: string, targetMonth: string): string => {
    if (!hireDate || !/^\d{4}-\d{2}-\d{2}$/.test(hireDate)) {
      return targetMonth + "-25";
    }
    const hire = new Date(hireDate);
    const day = hire.getDate();
    const payDay = day + 1;
    const [year, monthStr] = targetMonth.split("-");
    const month = parseInt(monthStr, 10);
    const daysInTargetMonth = getDaysInMonth(parseInt(year, 10), month);
    const actualPayDay = Math.min(payDay, daysInTargetMonth);
    return `${year}-${monthStr.padStart(2, "0")}-${actualPayDay.toString().padStart(2, "0")}`;
  };
  
  export const calculateMonthsPaid = (hireDateStr: string, currentDate: Date): number => {
    if (!hireDateStr || !/^\d{4}-\d{2}-\d{2}$/.test(hireDateStr)) {
      return 0;
    }
    const hireDate = new Date(hireDateStr);
    const day = hireDate.getDate();
    const payDayBase = day + 1;
    let payYear = hireDate.getFullYear();
    let payMonth = hireDate.getMonth() + 2; // Start from month +1 after hire
    if (payMonth > 12) {
      payMonth -= 12;
      payYear += 1;
    }
    let count = 0;
    while (true) {
      const daysInPayMonth = getDaysInMonth(payYear, payMonth);
      const actualPayDay = Math.min(payDayBase, daysInPayMonth);
      const payDate = new Date(payYear, payMonth - 1, actualPayDay);
      if (payDate > currentDate) {
        break;
      }
      count++;
      payMonth += 1;
      if (payMonth > 12) {
        payMonth = 1;
        payYear += 1;
      }
    }
    return count;
  };
  
  export const calculateTotalPayroll = (payroll: Employee[], currentDate: Date): number => {
    return payroll.reduce((sum, emp) => sum + (calculateMonthsPaid(emp.hireDate, currentDate) * emp.baseSalary), 0);
  };