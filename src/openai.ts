import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const useGemini = !!process.env.GEMINI_API_KEY;

let ai: GoogleGenerativeAI | undefined;
let openai: OpenAI | undefined;

if (useGemini) {
  ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
} else {
  openai = new OpenAI();
}

const getTemplate = (description: string) => `Na podstawie poniższego opisu:
\`\`\`
${description}
\`\`\`
Czy to jest prawdziwa oferta? - Odpowiedz w formacie: 'Prawdopodobieństwo, że oferta jest prawdziwa \${procent}'
W oddzielnym akapicie podaj wszystkie koszty jedno pod drugim. Jako ostatni punkt podaj sumę.
W oddzielnym akapicie podaj najistotniejsze informacje o ofercie.
`;

export async function getCompletionInfo(description: string) {
  let result = "...Brak podpowiedzi AI...";

  try {
    if (useGemini && ai) {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const completion = await model.generateContent(getTemplate(description));
      const response = await completion.response;
      
      if (response.text()) {
        result = response.text();
      }
    } else if (openai) {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: getTemplate(description) }],
      model: "gpt-4o",
      });

      if (completion.choices[0].message.content) {
        result = completion.choices[0].message.content;
      }
    }
  } catch (error) {
    console.log(`Error ${useGemini ? 'Gemini' : 'OpenAI'}:`, error);
  }

  return result;
}
