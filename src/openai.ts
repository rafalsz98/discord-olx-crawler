import OpenAI from "openai";

const openai = new OpenAI();

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
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: getTemplate(description) }],
      model: "gpt-4o",
    });

    if (completion.choices[0].message.content) {
      result = completion.choices[0].message.content;
    }
  } catch (error) {
    console.log("Error OpenAI:", error);
  }

  return result;
}
