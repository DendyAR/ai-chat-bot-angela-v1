import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = "https://api.openai.com/v1/chat/completions"; // OpenAI Endpoint

const StoryForm = ({ onStoryGenerated }: { onStoryGenerated: (story: string) => void }) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const generateStory = async () => {
    if (!prompt) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        API_URL,
        {
          model: "dall-e-3", // Bisa diganti dengan "gpt-3.5-turbo"
          messages: [
            { role: "system", content: "You are a creative AI that generates engaging stories." },
            { role: "user", content: prompt },
          ],
          max_tokens: 500,
        },
        {
          headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const story = response.data.choices[0]?.message?.content || "Gagal menghasilkan cerita.";
      onStoryGenerated(story);
    } catch (error) {
      console.error("Error generating story:", error);
      setErrorMessage("Terjadi kesalahan saat menghasilkan cerita.");
    }

    setLoading(false);
  };

  return (
    <Card className="p-4 space-y-4">
      <Input
        type="text"
        placeholder="Masukkan ide cerita..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button onClick={generateStory} disabled={loading}>
        {loading ? "Generating..." : "Buat Cerita"}
      </Button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </Card>
  );
};

export default StoryForm;
