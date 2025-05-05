
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClientWithLoyalty, LoyaltyTransaction, RedeemedReward } from "@/types/management";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Users, Award, History } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

const LoyaltyClients = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientWithLoyalty | null>(null);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-with-loyalty"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // Query clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("id, first_name, last_name, phone, photo_url")
        .order("last_name");

      if (clientsError) throw clientsError;

      // Query client loyalty data
      const { data: loyaltyData, error: loyaltyError } = await supabase
        .from("client_loyalty")
        .select("*");

      if (loyaltyError) throw loyaltyError;

      // Combine the data
      const combinedData = clientsData.map(client => {
        const loyaltyRecord = loyaltyData.find(l => l.client_id === client.id);
        return {
          ...client,
          loyalty: loyaltyRecord || null
        };
      });

      return combinedData as ClientWithLoyalty[];
    }
  });

  const { data: clientTransactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["client-transactions", selectedClient?.id],
    queryFn: async () => {
      if (!user || !selectedClient) throw new Error("User not authenticated or no client selected");

      const { data, error } = await supabase
        .from("loyalty_transactions")
        .select("*")
        .eq("client_id", selectedClient.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LoyaltyTransaction[];
    },
    enabled: !!selectedClient
  });

  const { data: clientRedeemedRewards = [], isLoading: isLoadingRedeemed } = useQuery({
    queryKey: ["client-redeemed-rewards", selectedClient?.id],
    queryFn: async () => {
      if (!user || !selectedClient) throw new Error("User not authenticated or no client selected");

      const { data, error } = await supabase
        .from("redeemed_rewards")
        .select("*, loyalty_reward:loyalty_reward_id(*)")
        .eq("client_id", selectedClient.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RedeemedReward[];
    },
    enabled: !!selectedClient
  });

  const filteredClients = clients.filter(client => 
    client.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d בMMMM yyyy", { locale: he });
    } catch (error) {
      return dateString;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getTransactionSourceDisplay = (source: string) => {
    switch (source) {
      case "visit":
        return "ביקור";
      case "purchase":
        return "רכישה";
      case "rule":
        return "חוק נאמנות";
      case "manual":
        return "התאמה ידנית";
      case "reward":
        return "פדיון הטבה";
      default:
        return source;
    }
  };

  const getRewardStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return "ממתין לפדיון";
      case "redeemed":
        return "נפדה";
      case "expired":
        return "פג תוקף";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {!selectedClient ? (
        <>
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle>לקוחות ונאמנות</CardTitle>
                  <CardDescription>צפייה בנתוני הנאמנות של לקוחות</CardDescription>
                </div>
                <div className="mt-4 md:mt-0 relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="חיפוש לקוח..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 pr-10 w-full md:w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">טוען נתוני לקוחות...</div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-4">לא נמצאו לקוחות התואמים את החיפוש</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">לקוח</TableHead>
                        <TableHead>נקודות</TableHead>
                        <TableHead className="hidden md:table-cell">ביקורים</TableHead>
                        <TableHead className="hidden md:table-cell">סה״כ הוצאות</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={client.photo_url || ""} alt={`${client.first_name} ${client.last_name}`} />
                                <AvatarFallback>{getInitials(client.first_name, client.last_name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{client.first_name} {client.last_name}</div>
                                <div className="text-sm text-muted-foreground">{client.phone}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{client.loyalty?.total_points || 0}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{client.loyalty?.visits_count || 0}</TableCell>
                          <TableCell className="hidden md:table-cell">{client.loyalty?.total_spent || 0}₪</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedClient(client)}
                            >
                              פרטים
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedClient.photo_url || ""} alt={`${selectedClient.first_name} ${selectedClient.last_name}`} />
                <AvatarFallback className="text-lg">{getInitials(selectedClient.first_name, selectedClient.last_name)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{selectedClient.first_name} {selectedClient.last_name}</h2>
                <p className="text-muted-foreground">{selectedClient.phone}</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setSelectedClient(null)}>חזרה לרשימת לקוחות</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-lg">נקודות נאמנות</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold mb-2">{selectedClient.loyalty?.total_points || 0}</div>
                <p className="text-muted-foreground">נקודות זמינות</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-lg">ביקורים</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold mb-2">{selectedClient.loyalty?.visits_count || 0}</div>
                <p className="text-muted-foreground">סה״כ ביקורים</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-center text-lg">הוצאות</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold mb-2">{selectedClient.loyalty?.total_spent || 0}₪</div>
                <p className="text-muted-foreground">סה״כ הוצאות</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>פרוגרס להטבה הבאה</CardTitle>
              <CardDescription>
                {selectedClient.loyalty?.total_points || 0} / 500 נקודות
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress 
                value={((selectedClient.loyalty?.total_points || 0) / 500) * 100} 
                className="h-2" 
              />
              <p className="text-sm text-muted-foreground mt-2">
                עוד {500 - (selectedClient.loyalty?.total_points || 0)} נקודות להטבה הבאה
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="history">
            <TabsList className="grid grid-cols-2 w-full md:w-80">
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>היסטוריית נקודות</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>הטבות שנפדו</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>היסטוריית נקודות</CardTitle>
                  <CardDescription>כל העסקאות של הלקוח במערכת הנאמנות</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingTransactions ? (
                    <div className="text-center py-4">טוען היסטוריה...</div>
                  ) : clientTransactions.length === 0 ? (
                    <div className="text-center py-10">
                      <History className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-1">אין היסטוריית נקודות</h3>
                      <p className="text-muted-foreground">ללקוח אין עדיין פעילות במערכת הנאמנות</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>תאריך</TableHead>
                            <TableHead>סוג עסקה</TableHead>
                            <TableHead>נקודות</TableHead>
                            <TableHead className="hidden md:table-cell">מקור</TableHead>
                            <TableHead className="hidden md:table-cell">תיאור</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>{formatDate(transaction.created_at)}</TableCell>
                              <TableCell>
                                <Badge variant={transaction.transaction_type === "earned" ? "default" : "destructive"}>
                                  {transaction.transaction_type === "earned" ? "זיכוי" : "חיוב"}
                                </Badge>
                              </TableCell>
                              <TableCell className={transaction.transaction_type === "earned" ? "text-green-600" : "text-red-600"}>
                                {transaction.transaction_type === "earned" ? "+" : "-"}{transaction.points}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{getTransactionSourceDisplay(transaction.source)}</TableCell>
                              <TableCell className="hidden md:table-cell">{transaction.description || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>הטבות שנפדו</CardTitle>
                  <CardDescription>הטבות שהלקוח פדה עם נקודות נאמנות</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingRedeemed ? (
                    <div className="text-center py-4">טוען הטבות שנפדו...</div>
                  ) : clientRedeemedRewards.length === 0 ? (
                    <div className="text-center py-10">
                      <Award className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-1">אין הטבות שנפדו</h3>
                      <p className="text-muted-foreground">הלקוח לא פדה עדיין הטבות</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>תאריך</TableHead>
                            <TableHead>שם ההטבה</TableHead>
                            <TableHead>נקודות</TableHead>
                            <TableHead>סטטוס</TableHead>
                            <TableHead className="hidden md:table-cell">תאריך פדיון</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientRedeemedRewards.map((redeemed) => (
                            <TableRow key={redeemed.id}>
                              <TableCell>{formatDate(redeemed.created_at)}</TableCell>
                              <TableCell>{redeemed.reward?.name || "הטבה לא ידועה"}</TableCell>
                              <TableCell>{redeemed.points_used}</TableCell>
                              <TableCell>
                                <Badge variant={redeemed.status === "redeemed" ? "default" : redeemed.status === "expired" ? "destructive" : "secondary"}>
                                  {getRewardStatusDisplay(redeemed.status)}
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">{redeemed.redeemed_at ? formatDate(redeemed.redeemed_at) : "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default LoyaltyClients;
