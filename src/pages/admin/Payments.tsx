
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentsList } from "@/components/payments/PaymentsList";
import { DebtTracker } from "@/components/payments/DebtTracker";
import PaymentFilters from "@/components/payments/PaymentFilters";
import { PaymentStats } from "@/components/payments/PaymentStats";
import { PaymentsHeader } from "@/components/payments/PaymentsHeader";
import { NewPaymentDialog } from "@/components/payments/NewPaymentDialog";
import { usePayments } from "@/hooks/usePayments";
import { getMockClients, getMockTreatmentTypes } from "@/services/paymentService";

const AdminPayments = () => {
  const [isNewPaymentOpen, setIsNewPaymentOpen] = useState(false);
  const { 
    isLoading, 
    filteredPayments, 
    overdueClients, 
    stats,
    handleFilterChange,
    handleIssueInvoice,
    handleMarkPaid,
    handleSendReminder,
    handleExportData,
    addNewPayment
  } = usePayments();

  const clients = getMockClients();
  const treatmentTypes = getMockTreatmentTypes();

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <PaymentsHeader 
          onExportData={handleExportData}
          onNewPayment={() => setIsNewPaymentOpen(true)}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PaymentStats 
            isLoading={isLoading} 
            stats={stats} 
            overdueClientsCount={overdueClients.length}
          />
        </div>
        
        {isLoading ? (
          <Card>
            <Skeleton className="h-64 w-full" />
          </Card>
        ) : (
          <>
            <PaymentFilters 
              onFilterChange={handleFilterChange} 
              treatmentTypes={treatmentTypes} 
            />
            
            <PaymentsList 
              payments={filteredPayments}
              onIssueInvoice={handleIssueInvoice}
              onMarkPaid={handleMarkPaid}
            />
            
            <DebtTracker 
              clients={overdueClients}
              onSendReminder={handleSendReminder}
            />
          </>
        )}

        <NewPaymentDialog
          isOpen={isNewPaymentOpen}
          onClose={() => setIsNewPaymentOpen(false)}
          onSubmit={addNewPayment}
          clients={clients}
          services={treatmentTypes}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
