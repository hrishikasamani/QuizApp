import { shuffleArray } from "./utils";

export type Question = {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
};

export type QuestionState = Question & {answers: string[]};

export enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}

export const fetchQuizQuestions =async (amount:number, difficulty: Difficulty):  Promise<QuestionState[]> => {
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;

    try {
        const response = await fetch(endpoint);

        // Handle rate limiting (429 error)
        if (response.status === 429) {
            console.warn("Rate limit exceeded. Retrying after a short delay...");
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
            return fetchQuizQuestions(amount, difficulty); // Retry the request
        }

        const data = await response.json();

        // Ensure data structure is as expected
        if (!data || !data.results) {
            throw new Error("Unexpected API response format.");
        }

        return data.results.map((question: Question) => ({
            ...question,
            answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
        }));

    } catch (error) {
        console.error("Error fetching quiz questions:", error);
        throw error; // Re-throw the error to be handled upstream
    }
};

//     const data = await (await fetch(endpoint)).json();
//     //console.log(data)
//     return data.results.map((question: Question) => (
//         {
//         ...question,
//         answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
//         }

//     ))
// };