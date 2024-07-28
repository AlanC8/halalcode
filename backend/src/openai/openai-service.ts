import OpenAI from "openai";
import "dotenv/config";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
  async generateInformation(location) {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `I need a comprehensive JSON response that includes the following information based on the user's current location in Mecca:
            1. Key points about the current location (e.g., a specific landmark or site).
            2. Duas Checklist:
              List of recommended duas for the current phase of Hajj.
              Text of each dua and its significance, with translation to English.
            3. Rituals Checklist:
              Detailed checklist of rituals to perform based on the current location.
              Instructions for each ritual, including any specific guidelines or considerations.
            4. Location-Based Guidance:
              Nearby landmarks or points of interest related to Hajj rituals.
              Directions or tips for reaching these landmarks from the current location.
            Please provide the response in JSON format.
            Example JSON Response:
          {
            "general_information": {
              "current_location": "Kaaba",
              "information" "Kaaba is a special place because..."
            },
            "duas_checklist": [
              {
                "dua": "Dua for entering the Masjid al-Haram",
                "text": "اللهم افتح لي أبواب رحمتك",
                "transcript" "transcript",
                "translation": "translation",
                "completed":"false"
                "significance": "A prayer for seeking Allah's mercy and blessings upon entering the sacred mosque."
              },
              {
                "dua": "Dua during Tawaf",
                "text": "اللهم إني أسألك من كل خير",
                 "transcript" "transcript",
                "translation": "translation",
                "completed":"false"
                "significance": "A supplication made while performing Tawaf around the Kaaba."
              }
            ],
            "rituals_checklist": [
              {
                "ritual": "Tawaf",
                "instructions": "Circumambulate the Kaaba seven times, starting from the Black Stone.",
                "completed":"false"
                "location": "Kaaba"
              },
              {
                "ritual": "Sa'i",
                "instructions": "Walk seven times between Safa and Marwah hills.",
                "completed":"false",
                "location": "Safa and Marwah"
              }
            ],
            "location_based_guidance": [
              {
                "landmark": "Jamarat",
                "description": "The site where pilgrims perform the ritual of Rami al-Jamarat (stoning the pillars).",
                "directions": "Walk towards the Mina area and follow the signs to Jamarat."
              },
              {
                "landmark": "Mount Arafat",
                "description": "A key site for the standing (Wuquf) during Hajj.",
                "directions": "Travel to the plain of Arafat, located about 20 kilometers southeast of Mecca."
              }
            ]
          }
    `,
        },
        { role: "user", content: location },
      ],
      model: "gpt-4o-mini",
      temperature: 0.5,
      response_format: { type: "json_object" },
    });
    return completion.choices[0].message.content;
  }
}

export default OpenAIService;
