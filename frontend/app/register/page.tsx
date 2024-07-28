"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

const languages = [
  { id: "af", name: "Afrikaans" },
  { id: "sq", name: "Albanian" },
  { id: "am", name: "Amharic" },
  { id: "ar", name: "Arabic" },
  { id: "hy", name: "Armenian" },
  { id: "az", name: "Azerbaijani" },
  { id: "eu", name: "Basque" },
  { id: "be", name: "Belarusian" },
  { id: "bn", name: "Bengali" },
  { id: "bs", name: "Bosnian" },
  { id: "bg", name: "Bulgarian" },
  { id: "ca", name: "Catalan" },
  { id: "ceb", name: "Cebuano" },
  { id: "zh", name: "Chinese" },
  { id: "co", name: "Corsican" },
  { id: "hr", name: "Croatian" },
  { id: "cs", name: "Czech" },
  { id: "da", name: "Danish" },
  { id: "nl", name: "Dutch" },
  { id: "en", name: "English" },
  { id: "eo", name: "Esperanto" },
  { id: "et", name: "Estonian" },
  { id: "fi", name: "Finnish" },
  { id: "fr", name: "French" },
  { id: "fy", name: "Frisian" },
  { id: "gl", name: "Galician" },
  { id: "ka", name: "Georgian" },
  { id: "de", name: "German" },
  { id: "el", name: "Greek" },
  { id: "gu", name: "Gujarati" },
  { id: "ht", name: "Haitian Creole" },
  { id: "ha", name: "Hausa" },
  { id: "haw", name: "Hawaiian" },
  { id: "he", name: "Hebrew" },
  { id: "hi", name: "Hindi" },
  { id: "hmn", name: "Hmong" },
  { id: "hu", name: "Hungarian" },
  { id: "is", name: "Icelandic" },
  { id: "ig", name: "Igbo" },
  { id: "id", name: "Indonesian" },
  { id: "ga", name: "Irish" },
  { id: "it", name: "Italian" },
  { id: "ja", name: "Japanese" },
  { id: "jv", name: "Javanese" },
  { id: "kn", name: "Kannada" },
  { id: "kk", name: "Kazakh" },
  { id: "km", name: "Khmer" },
  { id: "rw", name: "Kinyarwanda" },
  { id: "ko", name: "Korean" },
  { id: "ku", name: "Kurdish (Kurmanji)" },
  { id: "ky", name: "Kyrgyz" },
  { id: "lo", name: "Lao" },
  { id: "la", name: "Latin" },
  { id: "lv", name: "Latvian" },
  { id: "lt", name: "Lithuanian" },
  { id: "lb", name: "Luxembourgish" },
  { id: "mk", name: "Macedonian" },
  { id: "mg", name: "Malagasy" },
  { id: "ms", name: "Malay" },
  { id: "ml", name: "Malayalam" },
  { id: "mt", name: "Maltese" },
  { id: "mi", name: "Maori" },
  { id: "mr", name: "Marathi" },
  { id: "mn", name: "Mongolian" },
  { id: "my", name: "Myanmar (Burmese)" },
  { id: "ne", name: "Nepali" },
  { id: "no", name: "Norwegian" },
  { id: "ny", name: "Nyanja (Chichewa)" },
  { id: "or", name: "Odia (Oriya)" },
  { id: "ps", name: "Pashto" },
  { id: "fa", name: "Persian" },
  { id: "pl", name: "Polish" },
  { id: "pt", name: "Portuguese" },
  { id: "pa", name: "Punjabi" },
  { id: "ro", name: "Romanian" },
  { id: "ru", name: "Russian" },
  { id: "sm", name: "Samoan" },
  { id: "gd", name: "Scots Gaelic" },
  { id: "sr", name: "Serbian" },
  { id: "st", name: "Sesotho" },
  { id: "sn", name: "Shona" },
  { id: "sd", name: "Sindhi" },
  { id: "si", name: "Sinhala (Sinhalese)" },
  { id: "sk", name: "Slovak" },
  { id: "sl", name: "Slovenian" },
  { id: "so", name: "Somali" },
  { id: "es", name: "Spanish" },
  { id: "su", name: "Sundanese" },
  { id: "sw", name: "Swahili" },
  { id: "sv", name: "Swedish" },
  { id: "tg", name: "Tajik" },
  { id: "ta", name: "Tamil" },
  { id: "tt", name: "Tatar" },
  { id: "te", name: "Telugu" },
  { id: "th", name: "Thai" },
  { id: "tr", name: "Turkish" },
  { id: "tk", name: "Turkmen" },
  { id: "uk", name: "Ukrainian" },
  { id: "ur", name: "Urdu" },
  { id: "ug", name: "Uyghur" },
  { id: "uz", name: "Uzbek" },
  { id: "vi", name: "Vietnamese" },
  { id: "cy", name: "Welsh" },
  { id: "xh", name: "Xhosa" },
  { id: "yi", name: "Yiddish" },
  { id: "yo", name: "Yoruba" },
  { id: "zu", name: "Zulu" },
];

export default function Register() {
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const options = event.target.options;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedLanguages(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:6161/api/auth/register",
        {
          username,
          email,
          password,
          languages: selectedLanguages,
          age,
          country,
        }
      );
      console.log("Registration success:", response.data);
      router.push("/login"); // Перенаправление на страницу входа после успешной регистрации
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="country" className="sr-only">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                autoComplete="country"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="age" className="sr-only">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                autoComplete="age"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="languages"
              className="block text-sm font-medium text-gray-700"
            >
              Languages spoken
            </label>
            <select
              id="languages"
              name="languages"
              multiple
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedLanguages}
              onChange={handleLanguageChange}
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
        <div className="text-center">
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
