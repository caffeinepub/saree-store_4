import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ShieldOff } from "lucide-react";

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-sand-50">
      <div className="text-center px-4 py-16 max-w-md">
        <div className="w-20 h-20 rounded-full bg-teal-50 border-2 border-teal-100 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-10 h-10 text-teal-300" />
        </div>
        <h1 className="font-serif text-3xl text-teal-800 mb-3">
          Access Denied
        </h1>
        <p className="font-sans text-muted-foreground text-base mb-8 leading-relaxed">
          You don't have permission to view this page. Please log in with an
          admin account to continue.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate({ to: "/" })}
            className="bg-teal-700 hover:bg-teal-600 text-champagne-200 font-sans tracking-widest uppercase text-sm rounded-sm border-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
