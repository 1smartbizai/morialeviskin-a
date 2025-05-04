
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface RiskyClient {
  id: string;
  name: string;
  debt: number;
  lastVisit: string;
  status: "high" | "medium" | "low";
  reason: string;
}

interface RiskyClientsProps {
  clients: RiskyClient[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "high":
      return "bg-red-100 text-red-800 border-red-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "low":
      return "bg-green-100 text-green-800 border-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const RiskyClients = ({ clients }: RiskyClientsProps) => {
  return (
    <Card className="mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">לקוחות בסיכון</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">שם</TableHead>
              <TableHead>סיבה</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.reason}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(client.status)}>
                    {status === "high" ? "גבוה" : status === "medium" ? "בינוני" : "נמוך"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/clients/${client.id}`}>
                      פרופיל
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {clients.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            אין לקוחות בסיכון ברגע זה
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskyClients;
