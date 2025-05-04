
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Search, Calendar, CreditCard } from "lucide-react";

// Mock data for clients
const clients = [
  { 
    id: 1, 
    name: "Emma Smith", 
    email: "emma@example.com", 
    phone: "(555) 123-4567", 
    lastVisit: "May 15, 2025",
    status: "active", 
    totalSpent: "$650",
    visits: 8 
  },
  { 
    id: 2, 
    name: "Rachel Green", 
    email: "rachel@example.com", 
    phone: "(555) 234-5678", 
    lastVisit: "May 20, 2025",
    status: "active", 
    totalSpent: "$420",
    visits: 4 
  },
  { 
    id: 3, 
    name: "Monica Geller", 
    email: "monica@example.com", 
    phone: "(555) 345-6789", 
    lastVisit: "May 8, 2025",
    status: "active", 
    totalSpent: "$890",
    visits: 12 
  },
  { 
    id: 4, 
    name: "Phoebe Buffay", 
    email: "phoebe@example.com", 
    phone: "(555) 456-7890", 
    lastVisit: "April 30, 2025",
    status: "inactive", 
    totalSpent: "$210",
    visits: 2 
  },
  { 
    id: 5, 
    name: "Chandler Bing", 
    email: "chandler@example.com", 
    phone: "(555) 567-8901", 
    lastVisit: "April 22, 2025",
    status: "active", 
    totalSpent: "$375",
    visits: 5 
  },
];

const AdminClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-beauty-dark">Clients</h1>
            <p className="text-muted-foreground">Manage your client information</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-beauty-primary hover:bg-opacity-90">
              <UserCheck className="mr-2 h-4 w-4" /> Add New Client
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <div>
                <CardTitle>Client Directory</CardTitle>
                <CardDescription>You have {clients.length} total clients</CardDescription>
              </div>
              <div className="mt-4 md:mt-0 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Clients</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="hidden md:table-cell">Last Visit</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="hidden md:table-cell">Metrics</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">
                            <div>{client.name}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{client.email}</div>
                            <div className="text-xs text-muted-foreground md:hidden">{client.phone}</div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div>{client.email}</div>
                            <div className="text-sm text-muted-foreground">{client.phone}</div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{client.lastVisit}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge 
                              variant={client.status === "active" ? "default" : "outline"}
                              className={client.status === "active" ? "bg-green-500" : ""}
                            >
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div>{client.totalSpent}</div>
                            <div className="text-sm text-muted-foreground">{client.visits} visits</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <UserCheck className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Calendar className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="active">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="hidden md:table-cell">Last Visit</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="hidden md:table-cell">Metrics</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients
                        .filter(client => client.status === "active")
                        .map((client) => (
                          <TableRow key={client.id}>
                            <TableCell className="font-medium">
                              <div>{client.name}</div>
                              <div className="text-xs text-muted-foreground md:hidden">{client.email}</div>
                              <div className="text-xs text-muted-foreground md:hidden">{client.phone}</div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div>{client.email}</div>
                              <div className="text-sm text-muted-foreground">{client.phone}</div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{client.lastVisit}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge 
                                variant="default"
                                className="bg-green-500"
                              >
                                {client.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div>{client.totalSpent}</div>
                              <div className="text-sm text-muted-foreground">{client.visits} visits</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <Calendar className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="inactive">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead className="hidden md:table-cell">Last Visit</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="hidden md:table-cell">Metrics</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients
                        .filter(client => client.status === "inactive")
                        .map((client) => (
                          <TableRow key={client.id}>
                            <TableCell className="font-medium">
                              <div>{client.name}</div>
                              <div className="text-xs text-muted-foreground md:hidden">{client.email}</div>
                              <div className="text-xs text-muted-foreground md:hidden">{client.phone}</div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div>{client.email}</div>
                              <div className="text-sm text-muted-foreground">{client.phone}</div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{client.lastVisit}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="outline">
                                {client.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div>{client.totalSpent}</div>
                              <div className="text-sm text-muted-foreground">{client.visits} visits</div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <Calendar className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminClients;
