import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicator: {
    code: string;
    name: string;
    description: string;
    objective: string;
    criteria: string[];
    tips: string[];
  };
}

export default function HelpModal({ isOpen, onClose, indicator }: HelpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{indicator.code} - {indicator.name}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div>
            <p><strong>Descrição:</strong> {indicator.description}</p>
          </div>
          
          <div>
            <p><strong>Objetivo:</strong> {indicator.objective}</p>
          </div>
          
          <div>
            <p><strong>Critérios avaliados:</strong></p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              {indicator.criteria.map((criterion, index) => (
                <li key={index}>{criterion}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <p><strong>Como melhorar a pontuação:</strong></p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              {indicator.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
