import OpenAI from "openai";
import "dotenv/config";
const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY,
});


class OpenAIService {
 async generateInformation(location) {
   const prompt = `I need a comprehensive JSON response that includes the following information based on the user's current location in Mecca:
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
   `;
   const completion = await openai.chat.completions.create({
     messages: [
       {
         role: "system",
         content: prompt,
       },
       { role: "user", content: location },
     ],
     model: "gpt-4o-mini",
     temperature: 0.5,
     response_format: { type: "json_object" },
   });
   return completion.choices[0].message.content;
 }
 async generateInformation2(location, fromTime, toTime) {
   const prompt = `
You are an expert AI assistant specializing in Islamic rituals and Mecca tourism. Your task is to provide detailed, accurate, and culturally sensitive information to help users plan their activities in Mecca. Given the location, fromTime, and toTime, generate a comprehensive JSON response with the following sections:


1. **Activities Checklist:**
- List 3-5 appropriate activities or rituals that can be performed during the specified time frame.
- Provide concise yet informative instructions or tips for each activity, considering religious significance and practical aspects.
- Include a query for each activity to find the most suitable picture on Google search.


2. **Nearby Points of Interest:**
- List 2-4 interesting or relevant places within walking distance of the given location.
- Offer brief, engaging descriptions that highlight the religious or historical importance of each place.
- Provide clear, concise directions from the specified location, mentioning landmarks when possible.
- Include a query for each point of interest to find the most suitable picture on Google search.


3. **Recommendations:**
- Suggest 2-3 practical recommendations for food, rest, or other advice specific to the time and location.
- Include special considerations related to weather, crowd levels, or religious observances for that time of day.
- Ensure recommendations are respectful of Islamic customs and local traditions.
- Include a query for each recommendation to find the most suitable picture or information on Google search.


Considerations:
- Tailor your response to the specific time of day, considering prayer times and religious significance.
- Be mindful of the seasonal context (e.g., Ramadan, Hajj season) when making recommendations.
- Prioritize activities and points of interest based on their proximity to the given location.
- Ensure all information is accurate, up-to-date, and respectful of Islamic practices.


**Example Input:**
- Location: Mecca Bazaar
- FromTime: 16:00
- ToTime: 18:00


**Example JSON Response:**
{
  "activities_checklist": [
    {
      "activity": "Shopping for Traditional Items",
      "instructions": "Explore the bazaar for prayer rugs, Islamic calligraphy, and other religious artifacts. Bargaining is common, but maintain respectful conduct.",
      "query": "traditional Islamic items Mecca bazaar"
    },
    {
      "activity": "Asr Prayer",
      "instructions": "Perform Asr prayer at a nearby mosque or prayer area. Ensure you have performed ablution and are properly dressed.",
      "query": "Asr prayer in Mecca"
    },
    {
      "activity": "Sampling Local Delicacies",
      "instructions": "Try traditional Meccan snacks like shawarma or dates. Look for reputable vendors and be mindful of hygiene.",
      "query": "traditional Meccan street food"
    }
  ],
  "nearby_points_of_interest": [
    {
      "place": "Masjid al-Haram",
      "description": "The holiest mosque in Islam, housing the Kaaba. A must-visit for every Muslim.",
      "directions": "Head west from the bazaar for about 10 minutes. You'll see its prominent minarets.",
      "query": "Masjid al-Haram Mecca exterior view"
    },
    {
      "place": "Zamzam Well",
      "description": "A sacred well inside Masjid al-Haram, believed to be a miraculously generated source of water from Allah.",
      "directions": "Located within the Masjid al-Haram complex, near the Kaaba.",
      "query": "Zamzam well Mecca"
    }
  ],
  "recommendations": [
    {
      "type": "Hydration",
      "suggestion": "Stay hydrated in the afternoon heat. Carry a water bottle or stop for refreshments at local drink stalls.",
      "query": "traditional drinks Mecca bazaar"
    },
    {
      "type": "Rest",
      "suggestion": "Take short breaks in shaded areas or air-conditioned shops to avoid fatigue before Maghrib prayer.",
      "query": "resting areas Mecca bazaar"
    },
    {
      "type": "Cultural Sensitivity",
      "suggestion": "Dress modestly and be respectful of local customs. Women should ensure their hair is covered.",
      "query": "appropriate attire Mecca pilgrims"
    }
  ]
}


Generate a detailed JSON response based on the provided location, fromTime, and toTime, following this structure and guidelines.
`;


   const completion = await openai.chat.completions.create({
     messages: [
       {
         role: "system",
         content: prompt,
       },
       {
         role: "user",
         content: `Location: ${location}, FromTime: ${fromTime}, ToTime: ${toTime}`,
       },
     ],
     model: "gpt-4o-mini",
     temperature: 0.5,
     response_format: { type: "json_object" },
   });


   return completion.choices[0].message.content;
 }
}


export default OpenAIService;


