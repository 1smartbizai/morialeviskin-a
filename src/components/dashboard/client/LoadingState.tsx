
import ClientLayout from "@/components/layouts/ClientLayout";

const LoadingState = () => {
  return (
    <ClientLayout>
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beauty-primary mx-auto"></div>
          <p className="mt-4 text-beauty-dark">טוען...</p>
        </div>
      </div>
    </ClientLayout>
  );
};

export default LoadingState;
