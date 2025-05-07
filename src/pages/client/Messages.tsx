
import React from "react";
import ClientLayout from "@/components/layouts/ClientLayout";
import MessagesList from "@/components/messaging/client/MessagesList";

const ClientMessages: React.FC = () => {
  return (
    <ClientLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-beauty-dark">ההודעות שלי</h1>
        </div>
        
        <MessagesList />
      </div>
    </ClientLayout>
  );
};

export default ClientMessages;
