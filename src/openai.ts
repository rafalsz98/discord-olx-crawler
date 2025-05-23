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
W oddzielnym akapicie podaj lokalizację mieszkania do wynajęcia w formacie google maps. - Odpowiedz w formacie: 'Lokalizacja: \{{lokalizacja}}'.
W oddzielnym akapicie podaj koszta miesięczne wynajmu mieszkania nie uwzględniając . - Odpowiedz w formacie: 'Koszt miesięczny: \{{koszt}}'.
Stosuj się dokładnie do wymaganego formatu odpowiedzi.
`;

export async function getCompletionInfo(description: string) {
  let result = "...Brak podpowiedzi AI...";

  try {
    if (useGemini && ai) {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const completion = await model.generateContent(getTemplate(description));
      const response = completion.response;
      
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
