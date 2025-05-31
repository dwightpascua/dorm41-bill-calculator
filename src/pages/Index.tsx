
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { BillCalendar } from '@/components/BillCalendar';
import { MembersList } from '@/components/MembersList';
import { BillSummary } from '@/components/BillSummary';
import { calculateBill } from '@/utils/billCalculator';

interface Member {
  id: string;
  name: string;
  startDate: string;
  daysOut: number;
  daysIn: number;
}

const Index = () => {
  const [totalBill, setTotalBill] = useState(4967.37);
  const [totalDays, setTotalDays] = useState(30);
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'DWIGHT', startDate: '2024-12-30', daysOut: 0, daysIn: 12 },
    { id: '2', name: 'MYCE', startDate: '2024-12-30', daysOut: 0, daysIn: 12 },
    { id: '3', name: 'ZI', startDate: '2024-12-30', daysOut: 0, daysIn: 12 },
    { id: '4', name: 'JAJA', startDate: '2024-12-30', daysOut: 0, daysIn: 12 },
    { id: '5', name: 'JV', startDate: '2024-12-30', daysOut: 0, daysIn: 12 },
    { id: '6', name: 'ANGEL', startDate: '2024-12-30', daysOut: 13, daysIn: 10 },
    { id: '7', name: 'ART', startDate: '2024-12-30', daysOut: 0, daysIn: 12 },
    { id: '8', name: 'PRINCE', startDate: '2024-12-30', daysOut: 0, daysIn: 12 },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Electricity Bill Calculator</h1>
          <p className="text-gray-600">Manage monthly electricity costs and member attendance</p>
        </div>

        {/* Bill Settings */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calendar className="h-5 w-5" />
              Bill Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalBill">Total Bill Amount (₱)</Label>
                <Input
                  id="totalBill"
                  type="number"
                  value={totalBill}
                  onChange={(e) => setTotalBill(parseFloat(e.target.value) || 0)}
                  className="text-lg font-semibold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalDays">Total Days in Month</Label>
                <Input
                  id="totalDays"
                  type="number"
                  value={totalDays}
                  onChange={(e) => setTotalDays(parseInt(e.target.value) || 30)}
                  className="text-lg font-semibold"
                />
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Per Day Rate</p>
              <p className="text-2xl font-bold text-blue-700">₱{perDay.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <BillCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              members={members}
              absentMembers={absentMembers}
              onMemberAbsence={handleMemberAbsence}
            />
          </div>

          {/* Members List */}
          <div className="lg:col-span-1">
            <MembersList 
              members={members} 
              billCalculation={billCalculation}
              onMembersUpdate={setMembers}
            />
          </div>

          {/* Bill Summary */}
          <div className="lg:col-span-1">
            <BillSummary 
              totalBill={totalBill}
              totalDays={totalDays}
              perDay={perDay}
              billCalculation={billCalculation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
