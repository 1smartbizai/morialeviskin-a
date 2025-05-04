
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Grid, List as ListIcon, User, Calendar, Tag, Star, Check } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClientCard } from "@/components/clients/ClientCard";
import { ClientStatusBadge } from "@/components/clients/ClientStatusBadge";
import { ClientListSkeleton } from "@/components/clients/ClientListSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Client type definition
interface Client {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  photo_url?: string;
  status: "active" | "at_risk" | "new_lead" | "inactive";
  lastVisit?: string; // date of last appointment
  nextAppointment?: string; // date of next appointment
  loyaltyPoints?: number;
  tags?: string[];
}

// View mode type (grid or list)
type ViewMode = "grid" | "list";

// Filter options type
interface FilterOptions {
  status: string;
  lastVisitDays: string;
  tags: string[];
  minLoyaltyPoints: number;
}

const ClientManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: "all",
    lastVisitDays: "all",
    tags: [],
    minLoyaltyPoints: 0
  });

  // Fetch clients (Mock data for now, would be replaced with actual API call)
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        // In a real app, this would fetch from Supabase
        // const { data, error } = await supabase.from('clients').select('*')
        // if (error) throw error
        // return data

        // Mock data for development
        return [
          {
            id: "1",
            first_name: "שרה",
            last_name: "כהן",
            phone: "054-1234567",
            photo_url: "",
            status: "active",
            lastVisit: "2025-04-20",
            nextAppointment: "2025-05-15",
            loyaltyPoints: 120,
            tags: ["קבוע", "טיפולי פנים"]
          },
          {
            id: "2",
            first_name: "רחל",
            last_name: "לוי",
            phone: "052-7654321",
            photo_url: "",
            status: "at_risk",
            lastVisit: "2025-03-10",
            nextAppointment: null,
            loyaltyPoints: 45,
            tags: ["צביעת שיער"]
          },
          {
            id: "3",
            first_name: "דוד",
            last_name: "אברהמי",
            phone: "050-9876543",
            photo_url: "",
            status: "new_lead",
            lastVisit: null,
            nextAppointment: "2025-05-10",
            loyaltyPoints: 0,
            tags: ["חדש"]
          },
          {
            id: "4",
            first_name: "מיכל",
            last_name: "גולדברג",
            phone: "053-8765432",
            photo_url: "",
            status: "active",
            lastVisit: "2025-04-25",
            nextAppointment: "2025-05-25",
            loyaltyPoints: 210,
            tags: ["קבוע", "פדיקור", "מניקור"]
          },
          {
            id: "5",
            first_name: "יעל",
            last_name: "ברקוביץ",
            phone: "058-2345678",
            photo_url: "",
            status: "inactive",
            lastVisit: "2025-02-01",
            nextAppointment: null,
            loyaltyPoints: 30,
            tags: ["לא פעיל"]
          }
        ] as Client[];
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "שגיאה בטעינת רשימת לקוחות",
          description: "אנא נסה שוב מאוחר יותר",
          variant: "destructive"
        });
        return [];
      }
    }
  });

  // Filter and search clients
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    
    return clients.filter(client => {
      // Search filter
      const searchMatch = 
        searchTerm === "" || 
        `${client.first_name} ${client.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm);
      
      // Status filter
      const statusMatch = 
        filterOptions.status === "all" || 
        client.status === filterOptions.status;
      
      // Last visit filter
      let lastVisitMatch = true;
      if (filterOptions.lastVisitDays !== "all" && client.lastVisit) {
        const lastVisitDate = new Date(client.lastVisit);
        const daysDiff = Math.floor((new Date().getTime() - lastVisitDate.getTime()) / (1000 * 3600 * 24));
        
        if (filterOptions.lastVisitDays === "30" && daysDiff > 30) lastVisitMatch = false;
        if (filterOptions.lastVisitDays === "90" && daysDiff > 90) lastVisitMatch = false;
        if (filterOptions.lastVisitDays === "180" && daysDiff > 180) lastVisitMatch = false;
      }
      
      // Loyalty points filter
      const loyaltyMatch = 
        (client.loyaltyPoints || 0) >= filterOptions.minLoyaltyPoints;
      
      // Tags filter
      const tagsMatch = 
        filterOptions.tags.length === 0 || 
        (client.tags && client.tags.some(tag => filterOptions.tags.includes(tag)));
      
      return searchMatch && statusMatch && lastVisitMatch && loyaltyMatch && tagsMatch;
    });
  }, [clients, searchTerm, filterOptions]);

  // Handle status filter change
  const handleStatusFilterChange = (status: string) => {
    setFilterOptions(prev => ({ ...prev, status }));
  };

  // Handle last visit filter change
  const handleLastVisitFilterChange = (days: string) => {
    setFilterOptions(prev => ({ ...prev, lastVisitDays: days }));
  };

  // Handle view mode toggle
  const toggleViewMode = () => {
    setViewMode(prev => (prev === "grid" ? "list" : "grid"));
  };

  // Handle client selection for detailed view
  const handleClientSelect = (clientId: string) => {
    console.log(`Navigate to client profile: ${clientId}`);
    // In a real app, this would navigate to the client profile page
    // navigate(`/admin/clients/${clientId}`);
  };

  return (
    <AdminLayout>
      <div dir="rtl" className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">לקוחות</h1>
            <p className="text-muted-foreground">ניהול ומעקב אחר לקוחות העסק</p>
          </div>
          <div>
            <Button className="bg-beauty-primary hover:bg-beauty-primary/90">
              <User className="mr-2 h-4 w-4" />
              לקוח חדש
            </Button>
          </div>
        </div>

        {/* Search and filter controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חיפוש לקוחות לפי שם או טלפון..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-4 pr-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      סינון
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>סינון לקוחות</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs">סטטוס</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleStatusFilterChange("all")} className="gap-2">
                        {filterOptions.status === "all" && <Check className="h-4 w-4" />}
                        <span className={filterOptions.status === "all" ? "font-medium" : ""}>הכל</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusFilterChange("active")} className="gap-2">
                        {filterOptions.status === "active" && <Check className="h-4 w-4" />}
                        <span className={filterOptions.status === "active" ? "font-medium" : ""}>פעיל</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusFilterChange("at_risk")} className="gap-2">
                        {filterOptions.status === "at_risk" && <Check className="h-4 w-4" />}
                        <span className={filterOptions.status === "at_risk" ? "font-medium" : ""}>בסיכון</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusFilterChange("new_lead")} className="gap-2">
                        {filterOptions.status === "new_lead" && <Check className="h-4 w-4" />}
                        <span className={filterOptions.status === "new_lead" ? "font-medium" : ""}>ליד חדש</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusFilterChange("inactive")} className="gap-2">
                        {filterOptions.status === "inactive" && <Check className="h-4 w-4" />}
                        <span className={filterOptions.status === "inactive" ? "font-medium" : ""}>לא פעיל</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs">ביקור אחרון</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleLastVisitFilterChange("all")} className="gap-2">
                        {filterOptions.lastVisitDays === "all" && <Check className="h-4 w-4" />}
                        <span className={filterOptions.lastVisitDays === "all" ? "font-medium" : ""}>הכל</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLastVisitFilterChange("30")} className="gap-2">
                        {filterOptions.lastVisitDays === "30" && <Check className="h-4 w-4" />}
                        <span className={filterOptions.lastVisitDays === "30" ? "font-medium" : ""}>ב-30 ימים האחרונים</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLastVisitFilterChange("90")} className="gap-2">
                        {filterOptions.lastVisitDays === "90" && <Check className="h-4 w-4" />}
                        <span className={filterOptions.lastVisitDays === "90" ? "font-medium" : ""}>ב-90 ימים האחרונים</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleLastVisitFilterChange("180")} className="gap-2">
                        {filterOptions.lastVisitDays === "180" && <Check className="h-4 w-4" />}
                        <span className={filterOptions.lastVisitDays === "180" ? "font-medium" : ""}>ב-180 ימים האחרונים</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="icon" onClick={toggleViewMode}>
                  {viewMode === "grid" ? <ListIcon className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Client list */}
            {isLoading ? (
              <ClientListSkeleton count={5} viewMode={viewMode} />
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">שגיאה בטעינת הנתונים. אנא נסה שוב מאוחר יותר.</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">לא נמצאו לקוחות התואמים את החיפוש.</p>
              </div>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
                : "space-y-3"}>
                {filteredClients.map(client => (
                  <ClientCard 
                    key={client.id}
                    client={client}
                    viewMode={viewMode}
                    onClick={() => handleClientSelect(client.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ClientManagement;
