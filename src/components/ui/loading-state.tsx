
import React from 'react';
import ClientLayout from "@/components/layouts/ClientLayout";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState = ({ message = "טוען...", fullScreen = false }: LoadingStateProps) => {
  const content = (
    <div className="flex items-center justify-center h-[70vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beauty-primary mx-auto"></div>
        <p className="mt-4 text-beauty-dark">{message}</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return <ClientLayout>{content}</ClientLayout>;
  }

  return content;
};
