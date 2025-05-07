
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, UserPlus, X, Users, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions: string[];
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "מנהל ראשי",
    email: "owner@example.com",
    role: "owner",
    status: "active",
    permissions: ["all"]
  }
];

const permissionCategories = [
  {
    name: "לקוחות",
    permissions: [
      { id: "clients:view", label: "צפייה בלקוחות" },
      { id: "clients:edit", label: "עריכת פרטי לקוחות" },
      { id: "clients:delete", label: "מחיקת לקוחות" }
    ]
  },
  {
    name: "תורים",
    permissions: [
      { id: "appointments:view", label: "צפייה בתורים" },
      { id: "appointments:create", label: "יצירת תורים" },
      { id: "appointments:edit", label: "עריכת תורים" },
      { id: "appointments:delete", label: "ביטול תורים" }
    ]
  },
  {
    name: "תשלומים",
    permissions: [
      { id: "payments:view", label: "צפייה בתשלומים" },
      { id: "payments:create", label: "יצירת תשלומים" },
      { id: "payments:refund", label: "ביצוע החזרים" }
    ]
  },
  {
    name: "הגדרות",
    permissions: [
      { id: "settings:view", label: "צפייה בהגדרות" },
      { id: "settings:edit", label: "עריכת הגדרות" }
    ]
  }
];

const TeamPermissionsTab = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [newMemberEmail, setNewMemberEmail] = useState<string>("");
  const [newMemberRole, setNewMemberRole] = useState<string>("staff");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedMemberPermissions, setSelectedMemberPermissions] = useState<string[]>([]);

  const handleInviteMember = async () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Mocked invite functionality
      const newMember: TeamMember = {
        id: `temp-${Date.now()}`,
        name: newMemberEmail.split('@')[0],
        email: newMemberEmail,
        role: newMemberRole,
        status: "pending",
        permissions: newMemberRole === "admin" 
          ? ["all"] 
          : ["clients:view", "appointments:view", "appointments:create"]
      };
      
      setTeamMembers([...teamMembers, newMember]);
      setNewMemberEmail("");
      setNewMemberRole("staff");
      setIsAddDialogOpen(false);
      toast.success("הזמנה נשלחה בהצלחה");
      setIsLoading(false);
    }, 1000);
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast.success("חבר צוות הוסר בהצלחה");
  };

  const handleOpenPermissions = (member: TeamMember) => {
    setSelectedMember(member);
    setSelectedMemberPermissions(member.permissions);
  };

  const handleTogglePermission = (permissionId: string) => {
    if (selectedMemberPermissions.includes(permissionId)) {
      setSelectedMemberPermissions(selectedMemberPermissions.filter(p => p !== permissionId));
    } else {
      setSelectedMemberPermissions([...selectedMemberPermissions, permissionId]);
    }
  };

  const handleSavePermissions = () => {
    if (!selectedMember) return;
    
    setTeamMembers(teamMembers.map(member => 
      member.id === selectedMember.id 
        ? { ...member, permissions: selectedMemberPermissions } 
        : member
    ));
    
    setSelectedMember(null);
    toast.success("הרשאות עודכנו בהצלחה");
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "owner":
        return <Badge className="bg-purple-500">בעלים</Badge>;
      case "admin":
        return <Badge className="bg-blue-500">מנהל</Badge>;
      case "staff":
        return <Badge>צוות</Badge>;
      default:
        return <Badge variant="outline">צוות</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">פעיל</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">ממתין</Badge>;
      default:
        return <Badge variant="outline">לא ידוע</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>חברי צוות</CardTitle>
              <CardDescription>נהל את חברי הצוות שלך וההרשאות שלהם</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="ml-2 h-4 w-4" />
                  הזמן חבר צוות
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>הזמן חבר צוות חדש</DialogTitle>
                  <DialogDescription>
                    שלח הזמנה לחבר צוות להצטרף לעסק שלך
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">דוא"ל</Label>
                    <Input
                      id="email"
                      placeholder="דוא"ל"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">תפקיד</Label>
                    <Select 
                      value={newMemberRole} 
                      onValueChange={setNewMemberRole}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="בחר תפקיד" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">מנהל</SelectItem>
                        <SelectItem value="staff">צוות</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    ביטול
                  </Button>
                  <Button onClick={handleInviteMember} disabled={!newMemberEmail || isLoading}>
                    {isLoading ? "שולח הזמנה..." : "שלח הזמנה"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold">אין חברי צוות</h3>
                <p className="mt-1 text-sm">הזמן חברי צוות להצטרף לעסק שלך</p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        שם
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        תפקיד
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        סטטוס
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        פעולות
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {teamMembers.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="bg-purple-100 rounded-full p-2">
                              <User className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRoleBadge(member.role)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(member.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {member.role !== "owner" && (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenPermissions(member)}
                              >
                                <Shield className="h-4 w-4 ml-1" />
                                הרשאות
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Permission Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>הרשאות עבור {selectedMember?.name}</DialogTitle>
            <DialogDescription>
              הגדר אילו פעולות מותרות לחבר הצוות
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
            {permissionCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <h4 className="font-medium border-b pb-1">{category.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                  {category.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        checked={selectedMemberPermissions?.includes(permission.id) || selectedMemberPermissions?.includes("all")}
                        disabled={selectedMemberPermissions?.includes("all")}
                        onCheckedChange={() => handleTogglePermission(permission.id)}
                        id={permission.id}
                      />
                      <Label htmlFor={permission.id}>{permission.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex items-center space-x-2 space-x-reverse border-t pt-4">
              <Switch
                checked={selectedMemberPermissions?.includes("all")}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedMemberPermissions(["all"]);
                  } else {
                    setSelectedMemberPermissions([]);
                  }
                }}
                id="all-permissions"
              />
              <Label htmlFor="all-permissions" className="font-medium">הרשאת מנהל מלאה (כל ההרשאות)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMember(null)}>
              ביטול
            </Button>
            <Button onClick={handleSavePermissions}>
              שמור הרשאות
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamPermissionsTab;
