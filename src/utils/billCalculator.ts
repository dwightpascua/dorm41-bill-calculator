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
  const perDayRate = totalBill / totalDays;
  
  // Create a map to track how many members are present each day
  const membersByDay = new Array(totalDays).fill(0);
  
  // Count present members for each day
  members.forEach(member => {
    for (let day = 0; day < totalDays; day++) {
      if (day < member.daysIn) {
        membersByDay[day]++;
      }
    }
  });

  // Calculate each member's share
  members.forEach(member => {
    let totalAmount = 0;
    
    // For each day the member is present, add their share based on number of present members that day
    for (let day = 0; day < member.daysIn; day++) {
      const presentMembers = membersByDay[day];
      if (presentMembers > 0) {
        totalAmount += perDayRate / presentMembers;
      }
    }

    calculation[member.id] = {
      name: member.name,
      daysIn: member.daysIn,
      daysOut: member.daysOut,
      amount: totalAmount,
    };
  });
  
  return calculation;
};