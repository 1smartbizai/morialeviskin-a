
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, UserCheck, UserX } from 'lucide-react';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
}

interface ClientSelectorProps {
  selectedClients: string[];
  onClientSelectionChange: (selectedIds: string[]) => void;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({
  selectedClients,
  onClientSelectionChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  
  // Mock client data - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockClients: Client[] = [
        { id: 'client1', firstName: 'רחל', lastName: 'לוי', phone: '050-1234567', status: 'active' },
        { id: 'client2', firstName: 'דנה', lastName: 'כהן', phone: '052-7654321', status: 'active' },
        { id: 'client3', firstName: 'שרה', lastName: 'גולדברג', phone: '054-9876543', status: 'inactive' },
        { id: 'client4', firstName: 'יעל', lastName: 'אברהמי', phone: '053-1472583', status: 'active' },
        { id: 'client5', firstName: 'מיכל', lastName: 'דוד', phone: '058-3692581', status: 'active' }
      ];
      setClients(mockClients);
      setFilteredClients(mockClients);
    }, 500);
  }, []);
  
  useEffect(() => {
    const filtered = clients.filter(client => 
      client.firstName.includes(searchTerm) || 
      client.lastName.includes(searchTerm) || 
      client.phone.includes(searchTerm)
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);
  
  const handleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      onClientSelectionChange([]);
    } else {
      onClientSelectionChange(filteredClients.map(client => client.id));
    }
  };
  
  const handleSelectClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      onClientSelectionChange(selectedClients.filter(id => id !== clientId));
    } else {
      onClientSelectionChange([...selectedClients, clientId]);
    }
  };
  
  const handleFilterActive = () => {
    const activeClients = clients.filter(client => client.status === 'active');
    setFilteredClients(activeClients);
  };
  
  const handleFilterInactive = () => {
    const inactiveClients = clients.filter(client => client.status === 'inactive');
    setFilteredClients(inactiveClients);
  };
  
  const handleResetFilter = () => {
    setFilteredClients(clients);
    setSearchTerm('');
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">בחירת לקוחות</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חפש לקוחות..."
              className="pr-10 text-right"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleFilterActive}>
            <UserCheck className="h-4 w-4 ml-1" /> פעילים
          </Button>
          <Button variant="outline" size="sm" onClick={handleFilterInactive}>
            <UserX className="h-4 w-4 ml-1" /> לא פעילים
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResetFilter}>
            איפוס
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox 
              id="select-all" 
              checked={selectedClients.length > 0 && selectedClients.length === filteredClients.length}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium leading-none cursor-pointer">
              בחר הכל
            </label>
          </div>
          
          <Badge className="bg-primary">
            {selectedClients.length} לקוחות נבחרו
          </Badge>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <div className="max-h-[350px] overflow-y-auto">
            {filteredClients.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                לא נמצאו לקוחות
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="w-[40px] text-center p-2"></th>
                    <th className="text-right p-2 text-sm font-medium">שם</th>
                    <th className="text-right p-2 text-sm font-medium">טלפון</th>
                    <th className="text-right p-2 text-sm font-medium">סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(client => (
                    <tr key={client.id} className="border-t hover:bg-slate-50">
                      <td className="p-2 text-center">
                        <Checkbox 
                          checked={selectedClients.includes(client.id)} 
                          onCheckedChange={() => handleSelectClient(client.id)}
                        />
                      </td>
                      <td className="p-2">
                        {client.firstName} {client.lastName}
                      </td>
                      <td className="p-2 text-sm">{client.phone}</td>
                      <td className="p-2">
                        <Badge 
                          variant={client.status === 'active' ? 'success' : 'outline'}
                          className={client.status === 'active' ? 'bg-green-500' : ''}
                        >
                          {client.status === 'active' ? 'פעיל' : 'לא פעיל'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
