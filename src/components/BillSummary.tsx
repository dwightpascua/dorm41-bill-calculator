
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, DollarSign, Users, Calendar } from 'lucide-react';

interface BillCalculation {
  [memberId: string]: {
    name: string;
    daysIn: number;
    daysOut: number;
    amount: number;
  };
}

interface BillSummaryProps {
  totalBill: number;
  totalDays: number;
  perDay: number;
  billCalculation: BillCalculation;
  showBillSettings?: boolean;
}

export const BillSummary: React.FC<BillSummaryProps> = ({
  totalBill,
  totalDays,
  perDay,
  billCalculation,
  showBillSettings = true,
}) => {
  const totalCalculated = Object.values(billCalculation).reduce((sum, calc) => sum + calc.amount, 0);
  const totalMembers = Object.keys(billCalculation).length;
  const averagePerMember = totalMembers > 0 ? totalCalculated / totalMembers : 0;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="shadow-md border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs opacity-90">Total Bill</span>
            </div>
            <p className="text-xl font-bold">₱{totalBill.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4" />
              <span className="text-xs opacity-90">Per Day</span>
            </div>
            <p className="text-xl font-bold">₱{perDay.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4" />
              <span className="text-xs opacity-90">Members</span>
            </div>
            <p className="text-xl font-bold">{totalMembers}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs opacity-90">Days</span>
            </div>
            <p className="text-xl font-bold">{totalDays}</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Calculator className="h-5 w-5" />
            Bill Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {Object.entries(billCalculation)
              .sort(([,a], [,b]) => b.amount - a.amount)
              .map(([memberId, calc]) => (
                <div key={memberId} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-gray-800">{calc.name}</span>
                    <span className="font-bold text-green-600">₱{calc.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{calc.daysIn} days present</span>
                    <span>{calc.daysOut} days absent</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(calc.daysIn / (calc.daysIn + calc.daysOut)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            }
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Calculated:</span>
              <span className="font-bold">₱{totalCalculated.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average per Member:</span>
              <span className="font-bold">₱{averagePerMember.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Difference:</span>
              <span className={`font-bold ${totalBill - totalCalculated === 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₱{(totalBill - totalCalculated).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
