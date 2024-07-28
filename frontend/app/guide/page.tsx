"use client";

import { useState } from "react";
import Head from "next/head";
import axios from "axios";

const urleke = process.env.BACKEND_URL;
console.log(urleke);

const searchImages = async (query: string): Promise<string[]> => {
  const key = process.env.VITE_GOOGLE_SEARCH_API_KEY;
  console.log(key);
  const cx = process.env.VITE_BROWSER_ENGINE_ID;
  const url = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&searchType=image&q=${query}`;
  try {
    const response = await axios.get(url);
    const items = response.data.items;
    if (items && items.length > 0) {
      return items.slice(0, 5).map((item: any) => item.link);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching image links:", error);
    return [];
  }
};

interface Activity {
  activity: string;
  instructions: string;
  query: string;
  image?: string;
  completed?: boolean;
}

interface PointOfInterest {
  place: string;
  description: string;
  directions: string;
  query: string;
  image?: string;
}

interface Recommendation {
  type: string;
  suggestion: string;
  query: string;
  image?: string;
}

interface ResponseData {
  activities_checklist: Activity[];
  nearby_points_of_interest: PointOfInterest[];
  recommendations: Recommendation[];
}

export default function PrayerSchedule() {
  const [place, setPlace] = useState("");
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("08:00");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${urleke}/api/openai/information2`, {
        location: place,
        fromTime: startTime,
        toTime: endTime,
      });
      const json = JSON.parse(response.data);

      // Fetch images for all activities
      const activitiesWithImages = await Promise.all(
        json.activities_checklist.map(async (activity: Activity) => {
          const images = await searchImages(activity.query);
          return { ...activity, image: images[0] }; // Use the first image
        })
      );

      // Fetch images for nearby points of interest
      const pointsOfInterestWithImages = await Promise.all(
        json.nearby_points_of_interest.map(async (poi: PointOfInterest) => {
          const images = await searchImages(poi.query);
          return { ...poi, image: images[0] }; // Use the first image
        })
      );

      // Fetch images for recommendations
      const recommendationsWithImages = await Promise.all(
        json.recommendations.map(async (rec: Recommendation) => {
          const images = await searchImages(rec.query);
          return { ...rec, image: images[0] }; // Use the first image
        })
      );

      setResponseData({
        activities_checklist: activitiesWithImages,
        nearby_points_of_interest: pointsOfInterestWithImages,
        recommendations: recommendationsWithImages,
      });
      setIsSubmitted(true);
    } catch (err: any) {
      console.error(
        "Zhberelmadym:",
        err.response ? err.response.data : err.message
      );
    }
  };

  const toggleActivity = (index: number) => {
    if (responseData) {
      const updatedActivities = [...responseData.activities_checklist];
      updatedActivities[index].completed = !updatedActivities[index].completed;
      setResponseData({
        ...responseData,
        activities_checklist: updatedActivities,
      });
    }
  };

  return (
    <div className="min-h-screen bg-mecca-image bg-cover bg-center text-white font-sans">
      <Head>
        <title>...</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl text-center mb-8 font-bold">
          {place ? place : "..."}
        </h1>
        {isSubmitted && responseData ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Checklist Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                Checklist
              </h2>
              <div className="space-y-4">
                {responseData.activities_checklist &&
                responseData.activities_checklist.length > 0 ? (
                  responseData.activities_checklist.map((activity, index) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-r ${
                        activity.completed
                          ? "from-green-400 to-green-500"
                          : "from-blue-400 to-blue-500"
                      } rounded-lg p-4 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-white">
                          {activity.activity}
                        </h3>
                        <button
                          onClick={() => toggleActivity(index)}
                          className={`px-4 py-2 rounded-full ${
                            activity.completed ? "bg-green-600" : "bg-blue-600"
                          } text-white font-bold transition-colors duration-300`}
                        >
                          {activity.completed ? "Completed" : "Complete"}
                        </button>
                      </div>
                      <p className="mt-2 text-white">{activity.instructions}</p>
                      {activity.image && (
                        <img
                          src={activity.image}
                          alt={activity.activity}
                          className="mt-4 rounded-lg w-full h-48 object-cover"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No activities available
                  </p>
                )}
              </div>
            </div>

            {/* Nearby Points of Interest Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                Nearby Points of Interest
              </h2>
              <div className="space-y-4">
                {responseData.nearby_points_of_interest &&
                responseData.nearby_points_of_interest.length > 0 ? (
                  responseData.nearby_points_of_interest.map((poi, index) => (
                    <div key={index} className="bg-blue-100 rounded-lg p-4">
                      <h3 className="text-xl font-semibold text-blue-800">
                        {poi.place}
                      </h3>
                      <p className="mt-2 text-gray-700">{poi.description}</p>
                      <p className="mt-1 text-blue-600">{poi.directions}</p>
                      {poi.image && (
                        <img
                          src={poi.image}
                          alt={poi.place}
                          className="mt-4 rounded-lg w-full h-48 object-cover"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No nearby points of interest available
                  </p>
                )}
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
                Recommendations
              </h2>
              <div className="space-y-4">
                {responseData.recommendations &&
                responseData.recommendations.length > 0 ? (
                  responseData.recommendations.map((rec, index) => (
                    <div key={index} className="bg-green-100 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-green-800">
                        {rec.type}
                      </h3>
                      <p className="mt-1 text-gray-700">{rec.suggestion}</p>
                      {rec.image && (
                        <img
                          src={rec.image}
                          alt={rec.type}
                          className="mt-4 rounded-lg w-full h-48 object-cover"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No recommendations available
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="place"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Location Name
                </label>
                <input
                  type="text"
                  id="place"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    Start time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
      <div className="fixed bottom-4 left-0 right-0 flex justify-center space-x-4">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
