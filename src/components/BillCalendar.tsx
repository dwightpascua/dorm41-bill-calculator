
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Users } from 'lucide-react';
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';

interface Member {
  id: string;
  name: string;
  startDate: string;
  daysOut: number;
  daysIn: number;
}

interface BillCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  members: Member[];
  absentMembers: { [key: string]: string[] };
  onMemberAbsence: (memberId: string, date: string, isAbsent: boolean) => void;
}

export const BillCalendar: React.FC<BillCalendarProps> = ({
  selectedDate,
  onDateSelect,
  members,
  absentMembers,
  onMemberAbsence,
}) => {
  const currentDate = selectedDate || new Date();
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = startOfMonth(currentDate);
  const startingDayOfWeek = getDay(firstDayOfMonth);

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onDateSelect(newDate);
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                          currentDate.getFullYear() === today.getFullYear();

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = format(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 'yyyy-MM-dd');
      const isSelected = selectedDate && selectedDate.getDate() === day;
      const isToday = isCurrentMonth && today.getDate() === day;
      const absentCount = absentMembers[dateStr]?.length || 0;

      days.push(
        <Button
          key={day}
          variant={isSelected ? "default" : "ghost"}
          size="sm"
          className={`h-8 w-8 p-0 relative ${isToday ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
          {absentCount > 0 && (
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {absentCount}
            </div>
          )}
        </Button>
      );
    }

    return days;
  };

  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const selectedDateAbsent = absentMembers[selectedDateStr] || [];

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Calendar className="h-5 w-5" />
          Attendance Calendar
        </CardTitle>
        <p className="text-sm text-gray-600">
          {format(currentDate, 'MMMM yyyy')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Calendar Grid */}
        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-600">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Selected Date Members */}
        {selectedDate && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users className="h-4 w-4" />
              {format(selectedDate, 'MMMM dd, yyyy')}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {members.map(member => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`absent-${member.id}`}
                    checked={selectedDateAbsent.includes(member.id)}
                    onCheckedChange={(checked) => 
                      onMemberAbsence(member.id, selectedDateStr, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={`absent-${member.id}`}
                    className={`text-sm font-medium cursor-pointer ${
                      selectedDateAbsent.includes(member.id) ? 'line-through text-gray-500' : 'text-gray-700'
                    }`}
                  >
                    {member.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
