import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Users, ChevronLeft, ChevronRight, Settings, RotateCcw } from 'lucide-react';
import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';

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
  calculationStartDate: string;
  calculationEndDate: string;
  onCalculationStartDateChange: (date: string) => void;
  onCalculationEndDateChange: (date: string) => void;
  onReset: () => void;
}

export const BillCalendar: React.FC<BillCalendarProps> = ({
  selectedDate,
  onDateSelect,
  members,
  absentMembers,
  onMemberAbsence,
  calculationStartDate,
  calculationEndDate,
  onCalculationStartDateChange,
  onCalculationEndDateChange,
  onReset,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate || new Date());
  const [showSettings, setShowSettings] = React.useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = startOfMonth(currentMonth);
  const startingDayOfWeek = getDay(firstDayOfMonth);

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (isMultiSelectMode) {
      setSelectedDates(prev => {
        const dateExists = prev.some(date => 
          date.getDate() === newDate.getDate() && 
          date.getMonth() === newDate.getMonth() && 
          date.getFullYear() === newDate.getFullYear()
        );
        
        if (dateExists) {
          return prev.filter(date => 
            !(date.getDate() === newDate.getDate() && 
              date.getMonth() === newDate.getMonth() && 
              date.getFullYear() === newDate.getFullYear())
          );
        } else {
          return [...prev, newDate];
        }
      });
    } else {
      onDateSelect(newDate);
      setSelectedDates([]);
    }
  };

  const handleMultipleAbsences = (memberId: string, isAbsent: boolean) => {
    selectedDates.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      onMemberAbsence(memberId, dateStr, isAbsent);
    });
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();
    const isCurrentMonth = currentMonth.getMonth() === today.getMonth() && 
                          currentMonth.getFullYear() === today.getFullYear();

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = format(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day), 'yyyy-MM-dd');
      const isSelected = selectedDate && 
                        selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentMonth.getMonth() &&
                        selectedDate.getFullYear() === currentMonth.getFullYear();
      const isMultiSelected = selectedDates.some(date => 
        date.getDate() === day && 
        date.getMonth() === currentMonth.getMonth() && 
        date.getFullYear() === currentMonth.getFullYear()
      );
      const isToday = isCurrentMonth && today.getDate() === day;
      const absentCount = absentMembers[dateStr]?.length || 0;

      days.push(
        <Button
          key={day}
          variant={isSelected || isMultiSelected ? "default" : "ghost"}
          size="sm"
          className={cn(
            "h-8 w-8 p-0 relative",
            isToday ? 'ring-2 ring-blue-500' : '',
            isMultiSelected ? 'bg-blue-200' : ''
          )}
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Calendar className="h-5 w-5" />
            Attendance Calendar
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}
              className={cn("h-8", isMultiSelectMode ? "bg-blue-100" : "")}
            >
              Multi-Select
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSettings(!showSettings)}
              className="h-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReset}
              className="h-8 text-red-600 hover:text-red-700"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {showSettings && (
          <div className="space-y-3 border-t pt-3">
            <h4 className="text-sm font-semibold text-gray-700">Calculation Period</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={calculationStartDate}
                  onChange={(e) => onCalculationStartDateChange(e.target.value)}
                  className="text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="endDate" className="text-xs">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={calculationEndDate}
                  onChange={(e) => onCalculationEndDateChange(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-sm text-gray-600 font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </p>
          <Button variant="ghost" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
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

        {/* Selected Date Members - 2 Columns */}
        {(selectedDate || selectedDates.length > 0) && (
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users className="h-4 w-4" />
              {selectedDates.length > 0 
                ? `Multiple Dates Selected (${selectedDates.length})`
                : format(selectedDate!, 'MMMM dd, yyyy')}
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {members.map(member => (
                <div key={member.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`absent-${member.id}`}
                    checked={selectedDates.length > 0 
                      ? false // Reset state for multi-select
                      : selectedDateAbsent.includes(member.id)}
                    onCheckedChange={(checked) => 
                      selectedDates.length > 0
                        ? handleMultipleAbsences(member.id, checked as boolean)
                        : onMemberAbsence(member.id, selectedDateStr, checked as boolean)
                    }
                  />
                  <label 
                    htmlFor={`absent-${member.id}`}
                    className={cn(
                      "text-sm font-medium cursor-pointer",
                      selectedDates.length === 0 && selectedDateAbsent.includes(member.id) 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-700'
                    )}
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