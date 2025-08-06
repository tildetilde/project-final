import { Button } from "./ui/Button";

export const App = () => {
  return (
    <main className="min-h-screen bg-background p-8 flex flex-col items-center justify-center space-y-6">
      <h1 className="text-4xl font-sans text-primary">Design System Button</h1>
      <div className="flex gap-4">
        <Button variant="primary" size="lg">
          Get Started
        </Button>
        <Button variant="outline" size="lg">
          Learn More
        </Button>
      </div>
      <button className="bg-primary text-background px-6 py-3 rounded-lg hover:bg-primary-hover">
        Testa färg
      </button>
    </main>
  );
};
