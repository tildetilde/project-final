import { Button } from "./ui/Button";

export const App = () => {
  return (
    <main className="p-6 space-y-4">
      <Button onClick={() => alert("Hej!")}>Standardknapp</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="danger">Farlig knapp</Button>
      <Button disabled>Inaktiverad</Button>
    </main>
  );
};
