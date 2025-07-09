import { Button } from "@/components/ui/button";
import { BarChart3, ArrowLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightContent?: React.ReactNode;
  onLogout?: () => void;
}

export default function Header({ 
  title, 
  subtitle, 
  showBackButton = false, 
  onBack,
  rightContent,
  onLogout
}: HeaderProps) {

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {showBackButton && onBack && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="mr-4"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            )}
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center mr-3">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            </div>
            {rightContent}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{subtitle}</span>
            {onLogout && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onLogout}
                className="text-red-600 hover:text-red-500"
              >
                Sair
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
