// ===== OnboardingTour.tsx =====
import { useState, useEffect } from "react";
import { useLocalStorage } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { X, ChevronRight, ChevronLeft, Rocket, Wallet, Zap, Trophy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const steps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Lunapesa! 🚀",
    description: "The next-gen crash game where you bet on a rising multiplier and cash out before it crashes.",
    icon: <Rocket className="size-6 text-primary" />,
  },
  {
    id: "multiplier",
    title: "Watch the Multiplier",
    description: "The multiplier starts at 1.00x and climbs higher. The longer you wait, the more you can win — but it can crash at any moment!",
    icon: <Trophy className="size-6 text-secondary" />,
  },
  {
    id: "betting",
    title: "Place Your Bets",
    description: "Use the two bet panels to place bets. You can bet on both boxes simultaneously for more action.",
    icon: <Zap className="size-6 text-warning" />,
  },
  {
    id: "cashout",
    title: "Cash Out Before the Crash",
    description: "Click 'Cashout' at any time to lock in your winnings. You can also set an automatic cashout multiplier.",
    icon: <Wallet className="size-6 text-success" />,
  },
  {
    id: "wallet",
    title: "Manage Your Wallet",
    description: "Deposit via M-Pesa, withdraw your winnings, and track your transaction history. Switch between demo and real mode.",
    icon: <Wallet className="size-6 text-primary" />,
  },
];

export function OnboardingTour() {
  const [hasSeenTour, setHasSeenTour] = useLocalStorage("lunapesa-tour-seen", false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!hasSeenTour) {
      setIsOpen(true);
    }
  }, [hasSeenTour]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    setHasSeenTour(true);
  };

  const handleSkip = () => {
    setIsOpen(false);
    setHasSeenTour(true);
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md animate-rise">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute -top-2 -right-2 z-10 rounded-full bg-elevated p-1.5 text-muted-foreground hover:text-foreground transition-colors border border-border"
        >
          <X className="size-4" />
        </button>

        {/* Tour card */}
        <div className="panel-surface p-6">
          {/* Progress dots */}
          <div className="flex gap-1.5 mb-4">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all",
                  idx === currentStep ? "bg-primary" : idx < currentStep ? "bg-secondary" : "bg-border"
                )}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {step.icon}
          </div>

          {/* Content */}
          <h2 className="font-display text-xl font-extrabold text-foreground">
            {step.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>

          {/* Step counter */}
          <p className="mt-3 text-xs text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </p>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="secondary"
                onClick={handlePrevious}
                className="flex-1 rounded-full bg-elevated hover:bg-accent"
              >
                <ChevronLeft className="size-4 mr-1" />
                Back
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className={cn(
                "flex-1 rounded-full font-bold",
                isLast ? "bg-gradient-to-r from-primary to-secondary text-white" : "bg-primary text-white"
              )}
            >
              {isLast ? (
                <>
                  Get Started <Check className="size-4 ml-1" />
                </>
              ) : (
                <>
                  Next <ChevronRight className="size-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          {/* Skip link */}
          <button
            onClick={handleSkip}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
        </div>
      </div>
    </div>
  );
}