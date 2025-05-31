interface Member {
  id: string;
  name: string;
  startDate: string;
  daysOut: number;
  daysIn: number;
}

interface BillCalculation {
  [memberId: string]: {
    name: string;
    daysIn: number;
    daysOut: number;
    amount: number;
  };
}

export const calculateBill = (
  members: Member[], 
  totalBill: number, 
  totalDays: number
): BillCalculation => {
  const calculation: BillCalculation = {};
  
  // Group members by dates to handle varying member counts
  const membersByDate = new Map<string, number>();
  const dateRange = Array.from({length: totalDays}, (_, i) => i + 1);
  
  dateRange.forEach(day => {
    const presentMembers = members.filter(member => {
      const absentDays = member.daysOut;
      return absentDays < day;
    }).length;
    membersByDate.set(day.toString(), presentMembers);
  });

  // Calculate each member's share based on daily rates
  members.forEach(member => {
    let totalAmount = 0;
    const dailyRate = totalBill / totalDays;

    // For each day, calculate the member's share based on number of present members
    dateRange.forEach(day => {
      const presentMembers = membersByDate.get(day.toString()) || members.length;
      const memberPresentOnDay = member.daysOut < day;
      if (memberPresentOnDay) {
        totalAmount += dailyRate / presentMembers;
      }
    });

    calculation[member.id] = {
      name: member.name,
      daysIn: member.daysIn,
      daysOut: member.daysOut,
      amount: totalAmount,
    };
  });
  
  return calculation;
};