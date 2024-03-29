import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

function App() {
  
  const [ingredients, setIngredients] = useState(['']); // State to manage input fields
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [showResponse,setResponse] = useState(false);
  const [isSpinning,setSpinning] = useState(false);
  
  const addIngredient = () => {
    setIngredients([...ingredients, '']); // Add a new empty string to the ingredients array
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value; // Update the ingredient value at the specified index
    setIngredients(newIngredients);
  };

  const MODEL_NAME = "gemini-pro";
  const API_KEY = "AIzaSyA_dw6uJmAVV1gd2Ta1JCtU7ciOA7vIZs0";

  const getRecipes=( )=>{
    setSpinning(true)
    setResponse(false)
    async function run() {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      };
      const safetySettings = [
          {category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,},
          {category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,},
          {category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,},
          {category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,},
      ];
      const parts = [
        {text: `Make a recipe with the following ingredients: {${ingredients.join(', ')}}. You do not have to use all the ingredients listed. You cannot add more ingredients but you can assume I have condiments, oils, seasonings. You can not give me more than 5 recipes. You are not obligated to give me 5 recipes. If you have more than 1 recipes, Format everything in markdown format and make it pretty if I don't provide any ingredients, tell me: "You have no ingredients"`},
      ];

      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
        safetySettings,
      });

      const response = result.response;
      setGeneratedResponse(response.text());
      setResponse(true)
      setSpinning(false)
    }
    run();
  }


  return (
    <>
      <div className="flex items-center justify-center mb-12 flex-col">
        {/* <h1 className="text-3xl mb-24">Erica's Pantry !</h1> */}
        <img src="ericaspantry.png" className='my-12'/>

        {ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            className="mt-5 bg-white rounded-md p-2 w-56 border-2 border-black"
            placeholder="Add your ingredient here!"
            value={ingredient}
            onChange={(e) => handleIngredientChange(index, e.target.value)}
          />
        ))}
        <div>
          <button className="bg-white rounded-md p-2 border-2 border-black text-gray-400 mt-5 mx-5 hover:font-bold hover:bg-gray-200" onClick={addIngredient}>
            +
          </button>

        </div>

        <button className="mt-36 bg-red-500 rounded-3xl border-2 border-black p-2 text-white hover:bg-red-600" onClick={getRecipes}>
          Make recipes!
        </button>
      </div>

      {isSpinning && (
          <div className="flex justify-center items-center">
            <div className="center animate-spin rounded-full h-24 w-24 border-t-2 border-b-4 border-gray-900"></div>
          </div>
      ) }

      {showResponse && (      
      <div className='flex flex-col items-center my-10 px-10'>
        <p className='p-2 my-10 rounded-md bg-white'><ReactMarkdown>{generatedResponse}</ReactMarkdown></p>
      </div>)
      }

      
    </>
  );
}

export default App;
