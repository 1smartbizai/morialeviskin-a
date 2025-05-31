
import { useEffect } from "react";
import confetti from 'canvas-confetti';

interface WelcomeConfettiProps {
  onComplete?: boolean;
}

const WelcomeConfetti = ({ onComplete = false }: WelcomeConfettiProps) => {
  useEffect(() => {
    // Trigger confetti on component mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  useEffect(() => {
    if (onComplete) {
      // Another confetti burst when setup is complete
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }, 500);
    }
  }, [onComplete]);

  return null;
};

export default WelcomeConfetti;
