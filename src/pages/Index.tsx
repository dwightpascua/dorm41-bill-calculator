import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Users, Calculator, RotateCcw } from 'lucide-react';
import { BillCalendar } from '@/components/BillCalendar';
import { MembersList } from '@/components/MembersList';
import { BillSummary } from '@/components/BillSummary';
import { calculateBill } from '@/utils/billCalculator';
import { startOfMonth, endOfMonth, format } from 'date-fns';

interface Member {
  id: string;
  name: string;
  startDate: string;
  daysOut: number;
  daysIn: number;
}

const Index = () => {
  // Set initial dates to current month
  const currentDate = new Date();
  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const [totalBill, setTotalBill] = useState(4967.37);
  const [totalDays, setTotalDays] = useState(30);
  const [calculationStartDate, setCalculationStartDate] = useState(format(firstDayOfMonth, 'yyyy-MM-dd'));
  const [calculationEndDate, setCalculationEndDate] = useState(format(lastDayOfMonth, 'yyyy-MM-dd'));
  const [activeTab, setActiveTab] = useState<'attendance' | 'members' | 'summary'>('attendance');
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'DWIGHT', startDate: format(firstDayOfMonth, 'yyyy-MM-dd'), daysOut: 0, daysIn: 30 },
    { id: '2', name: 'MYCE', startDate: format(firstDayOfMonth, 'yyyy-MM-dd'), daysOut: 0, daysIn: 30 },
    { id: '3', name: 'ZI', startDate: format(firstDayOfMonth, 'yyyy-MM-dd'), daysOut: 0, daysIn: 30 },
    { id: '4', name: 'JAJA', startDate: format(firstDayOfMonth, 'yyyy-MM-dd'), daysOut: 0, daysIn: 30 },
    { id: '5', name: 'JV', startDate: format(firstDayOfMonth, 'yyyy-MM-dd'), daysOut: 0, daysIn: 30 },
    { id: '6', name: 'ANGEL', startDate: format(firstDayOfMonth, 'yyyy-MM-dd'), daysOut: 0, daysIn: 30 },
    { id: '7', name: 'ART', startDate: format(firstDayOfMonth, 'yyyy-MM-dd'), daysOut: 0, daysIn: 30 },
    { id: '8', name: 'PRINCE', startDate: format(firstDayOfMonth, 'yyyy-MM-dd'), daysOut: 0, daysIn: 30 },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [absentMembers, setAbsentMembers] = useState<{ [key: string]: string[] }>({});

  const billCalculation = calculateBill(members, totalBill, totalDays);
  const perDay = totalBill / totalDays;

  const handleMemberAbsence = (memberId: string, date: string, isAbsent: boolean) => {
    setAbsentMembers(prev => {
      const dateAbsences = prev[date] || [];
      if (isAbsent) {
        if (!dateAbsences.includes(memberId)) {
          return { ...prev, [date]: [...dateAbsences, memberId] };
        }
      } else {
        return { ...prev, [date]: dateAbsences.filter(id => id !== memberId) };
      }
      return prev;
    });

    // Update member's days out count
    setMembers(prevMembers => 
      prevMembers.map(member => {
        if (member.id === memberId) {
          const memberAbsentDays = Object.values(absentMembers).flat().filter(id => id === memberId).length;
          const adjustment = isAbsent ? 1 : -1;
          const newDaysOut = Math.max(0, member.daysOut + adjustment);
          return {
            ...member,
            daysOut: newDaysOut,
            daysIn: totalDays - newDaysOut
          };
        }
        return member;
      })
    );
  };

  const handleReset = () => {
    setAbsentMembers({});
    setMembers(prevMembers => 
      prevMembers.map(member => ({
        ...member,
        daysOut: 0,
        daysIn: totalDays
      }))
    );
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'attendance':
        return (
          <BillCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            members={members}
            absentMembers={absentMembers}
            onMemberAbsence={handleMemberAbsence}
            calculationStartDate={calculationStartDate}
            calculationEndDate={calculationEndDate}
            onCalculationStartDateChange={setCalculationStartDate}
            onCalculationEndDateChange={setCalculationEndDate}
            onReset={handleReset}
          />
        );
      case 'members':
        return (
          <MembersList 
            members={members} 
            billCalculation={billCalculation}
            onMembersUpdate={setMembers}
          />
        );
      case 'summary':
        return (
          <BillSummary 
            totalBill={totalBill}
            totalDays={totalDays}
            perDay={perDay}
            billCalculation={billCalculation}
            showBillSettings={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Electricity Bill Calculator</h1>
        </div>

        {/* Compact Bill Settings - Only show when not on summary tab */}
        {activeTab !== 'summary' && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-700 text-lg">
                <Calculator className="h-4 w-4" />
                Bill Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="totalBill" className="text-xs">Total Bill (₱)</Label>
                  <Input
                    id="totalBill"
                    type="number"
                    value={totalBill}
                    onChange={(e) => setTotalBill(parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="totalDays" className="text-xs">Total Days</Label>
                  <Input
                    id="totalDays"
                    type="number"
                    value={totalDays}
                    onChange={(e) => setTotalDays(parseInt(e.target.value) || 30)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Per Day Rate</Label>
                  <div className="bg-blue-50 rounded px-2 py-1.5 text-center">
                    <p className="text-sm font-bold text-blue-700">₱{perDay.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="min-h-[400px]">
          {renderActiveContent()}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={activeTab === 'attendance' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('attendance')}
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Attendance</span>
              </Button>
              <Button
                variant={activeTab === 'members' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('members')}
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <Users className="h-4 w-4" />
                <span className="text-xs">Members</span>
              </Button>
              <Button
                variant={activeTab === 'summary' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('summary')}
                className="flex flex-col items-center gap-1 h-auto py-2"
              >
                <Calculator className="h-4 w-4" />
                <span className="text-xs">Bill Summary</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;