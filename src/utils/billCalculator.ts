
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
  
  // Calculate per day rate
  const perDayRate = totalBill / totalDays;
  
  // Calculate total member-days (sum of all days each member was present)
  const totalMemberDays = members.reduce((sum, member) => sum + member.daysIn, 0);
  
  // If no member-days, return empty calculation
  if (totalMemberDays === 0) {
    return calculation;
  }
  
  // Calculate cost per member-day
  const costPerMemberDay = totalBill / totalMemberDays;
  
  // Calculate each member's share
  members.forEach(member => {
    const memberAmount = member.daysIn * costPerMemberDay;
    
    calculation[member.id] = {
      name: member.name,
      daysIn: member.daysIn,
      daysOut: member.daysOut,
      amount: memberAmount,
    };
  });
  
  return calculation;
};

export const getMemberPerDayRates = (
  members: Member[], 
  totalBill: number, 
  totalDays: number
): { [key: number]: number } => {
  const rates: { [key: number]: number } = {};
  
  // Group members by their present days count
  const membersByDays = members.reduce((acc, member) => {
    if (!acc[member.daysIn]) {
      acc[member.daysIn] = [];
    }
    acc[member.daysIn].push(member);
    return acc;
  }, {} as { [key: number]: Member[] });
  
  // Calculate rates based on Excel logic
  Object.keys(membersByDays).forEach(daysStr => {
    const days = parseInt(daysStr);
    const membersWithThisDayCount = membersByDays[days];
    const totalMemberDays = members.reduce((sum, member) => sum + member.daysIn, 0);
    
    if (totalMemberDays > 0) {
      rates[days] = totalBill / totalMemberDays;
    }
  });
  
  return rates;
};
