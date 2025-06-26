import { Card, CardContent } from "@/components/ui/card";

const StoryOutput = ({ story }: { story: string }) => {
  return (
    <Card className="p-4 mt-4">
      <h2 className="text-xl font-bold mb-2">Hasil Cerita</h2>
      <CardContent>
        <p className="whitespace-pre-line">{story || "Belum ada cerita."}</p>
      </CardContent>
    </Card>
  );
};

export default StoryOutput;
