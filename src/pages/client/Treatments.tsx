
import ClientLayout from "@/components/layouts/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

// Mock data for treatments
const treatmentsData = [
  {
    id: 1,
    name: "Signature Facial",
    category: "facial",
    description: "Our luxurious signature facial includes deep cleansing, exfoliation, extraction, and a customized mask treatment.",
    duration: "60 min",
    price: "$120",
    popular: true
  },
  {
    id: 2,
    name: "Hair Styling",
    category: "hair",
    description: "Professional styling to achieve your desired look. Includes wash, blowout, and style.",
    duration: "45 min",
    price: "$85",
    popular: true
  },
  {
    id: 3,
    name: "Classic Manicure",
    category: "nails",
    description: "A traditional manicure including nail shaping, cuticle care, hand massage, and polish application.",
    duration: "30 min",
    price: "$45",
    popular: true
  },
  {
    id: 4,
    name: "Gel Manicure",
    category: "nails",
    description: "Long-lasting gel polish application with nail preparation and cuticle care.",
    duration: "45 min",
    price: "$65",
    popular: false
  },
  {
    id: 5,
    name: "Deep Tissue Massage",
    category: "massage",
    description: "A therapeutic massage focusing on realigning deeper layers of muscles and connective tissue.",
    duration: "60 min",
    price: "$110",
    popular: false
  },
  {
    id: 6,
    name: "Anti-Aging Facial",
    category: "facial",
    description: "Advanced treatment designed to reduce fine lines and improve skin elasticity using premium products.",
    duration: "75 min",
    price: "$150",
    popular: false
  },
  {
    id: 7,
    name: "Hair Coloring",
    category: "hair",
    description: "Full color service including consultation, application, and style.",
    duration: "120 min",
    price: "$140+",
    popular: true
  },
  {
    id: 8,
    name: "Relaxing Swedish Massage",
    category: "massage",
    description: "A gentle full-body massage to improve circulation, ease tension, and promote relaxation.",
    duration: "60 min",
    price: "$95",
    popular: false
  }
];

const ClientTreatments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filterTreatments = (category: string) => {
    const filtered = category === "all" 
      ? treatmentsData 
      : treatmentsData.filter(treatment => treatment.category === category);
      
    return filtered.filter(treatment => 
      treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  const allTreatments = filterTreatments("all");
  const facialTreatments = filterTreatments("facial");
  const hairTreatments = filterTreatments("hair");
  const nailsTreatments = filterTreatments("nails");
  const massageTreatments = filterTreatments("massage");
  
  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-beauty-dark">Beauty Treatments</h1>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 w-full flex overflow-x-auto hide-scrollbar">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="facial" className="flex-1">Facials</TabsTrigger>
            <TabsTrigger value="hair" className="flex-1">Hair</TabsTrigger>
            <TabsTrigger value="nails" className="flex-1">Nails</TabsTrigger>
            <TabsTrigger value="massage" className="flex-1">Massage</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTreatments.length > 0 ? (
                allTreatments.map(treatment => (
                  <TreatmentCard key={treatment.id} treatment={treatment} />
                ))
              ) : (
                <div className="col-span-2 text-center p-8">
                  <p className="text-muted-foreground">No treatments found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="facial">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facialTreatments.length > 0 ? (
                facialTreatments.map(treatment => (
                  <TreatmentCard key={treatment.id} treatment={treatment} />
                ))
              ) : (
                <div className="col-span-2 text-center p-8">
                  <p className="text-muted-foreground">No facial treatments found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="hair">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hairTreatments.length > 0 ? (
                hairTreatments.map(treatment => (
                  <TreatmentCard key={treatment.id} treatment={treatment} />
                ))
              ) : (
                <div className="col-span-2 text-center p-8">
                  <p className="text-muted-foreground">No hair treatments found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="nails">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nailsTreatments.length > 0 ? (
                nailsTreatments.map(treatment => (
                  <TreatmentCard key={treatment.id} treatment={treatment} />
                ))
              ) : (
                <div className="col-span-2 text-center p-8">
                  <p className="text-muted-foreground">No nail treatments found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="massage">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {massageTreatments.length > 0 ? (
                massageTreatments.map(treatment => (
                  <TreatmentCard key={treatment.id} treatment={treatment} />
                ))
              ) : (
                <div className="col-span-2 text-center p-8">
                  <p className="text-muted-foreground">No massage treatments found matching your search.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

interface TreatmentCardProps {
  treatment: {
    id: number;
    name: string;
    category: string;
    description: string;
    duration: string;
    price: string;
    popular: boolean;
  };
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{treatment.name}</CardTitle>
          {treatment.popular && (
            <Badge className="bg-beauty-primary">Popular</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{treatment.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium">{treatment.price}</div>
            <div className="text-xs text-muted-foreground">{treatment.duration}</div>
          </div>
          <Button>Book Now</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientTreatments;
