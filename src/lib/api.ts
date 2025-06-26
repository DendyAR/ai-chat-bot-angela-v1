export async function askToOpenRouter(prompt: string) {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173", // ganti kalau udah deploy
      "X-Title": "My Chatbot App", // bebas
    },
    body: JSON.stringify({
      model: "mistralai/mixtral-8x7b-instruct", // atau coba llama3-8b
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}
