
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, Trash2, Edit } from 'lucide-react';

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

interface MembersListProps {
  members: Member[];
  billCalculation: BillCalculation;
  onMembersUpdate: (members: Member[]) => void;
}

export const MembersList: React.FC<MembersListProps> = ({
  members,
  billCalculation,
  onMembersUpdate,
}) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const addMember = () => {
    if (newMemberName.trim()) {
      const newMember: Member = {
        id: Date.now().toString(),
        name: newMemberName.trim(),
        startDate: new Date().toISOString().split('T')[0],
        daysOut: 0,
        daysIn: 30,
      };
      onMembersUpdate([...members, newMember]);
      setNewMemberName('');
    }
  };

  const removeMember = (id: string) => {
    onMembersUpdate(members.filter(member => member.id !== id));
  };

  const updateMemberName = (id: string, newName: string) => {
    onMembersUpdate(
      members.map(member =>
        member.id === id ? { ...member, name: newName } : member
      )
    );
    setEditingId(null);
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Users className="h-5 w-5" />
            Members
          </CardTitle>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Member name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMember()}
              className="w-32 h-8 text-xs"
            />
            <Button onClick={addMember} size="sm" className="h-8 w-8 p-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Members List - 2 Columns */}
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {members.map(member => {
            const calculation = billCalculation[member.id];
            return (
              <div key={member.id} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  {editingId === member.id ? (
                    <Input
                      defaultValue={member.name}
                      onBlur={(e) => updateMemberName(member.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateMemberName(member.id, e.currentTarget.value);
                        }
                      }}
                      className="font-semibold text-sm h-6"
                      autoFocus
                    />
                  ) : (
                    <h4 className="font-semibold text-gray-800 text-sm truncate">{member.name}</h4>
                  )}
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(member.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                      className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Days In:</span>
                    <span className="font-medium">{calculation?.daysIn || member.daysIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Days Out:</span>
                    <span className="font-medium text-red-600">{calculation?.daysOut || member.daysOut}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span>Amount:</span>
                    <span className="font-bold text-green-600">₱{calculation?.amount.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
