import Question from "../domain/question";
import QuestionsRepository from "../domain/questions.repository";

export default class InMemoryQuestionsRepository implements QuestionsRepository {

    private data: Question[];

    constructor(data?: Question[]) {
        this.data = data || [
            {
                "id": "01226N0640J7K",
                "rank": 1,
                "value": "Do you have difficulty getting or maintaining an erection?",
                "options": [
                    { "id": "01226N0640J7M", "value": "Yes" },
                    { "id": "01226N0640J7N", "value": "No", "include": [] }
                ]
            },
            {
                "id": "01226N0640J7P",
                "rank": 2,
                "value": "Do you have difficulty getting or maintaining an erection?",
                "options": [
                    { "id": "01226N0640J7Q", "value": "Viagra or Sildenafil", "subquestionId": "01226N0640J7U" },
                    { "id": "01226N0640J7R", "value": "Cialis or Tadalafil", "subquestionId": "01226N0640J7X" },
                    { "id": "01226N0640J7S", "value": "Both", "subquestionId": "01226N0640J80" },
                    { "id": "01226N0640J7T", "value": "None of the above", "include": ["sidenafil_50", "tadalafil_10"] }
                ],
                "subquestions": [
                    {
                        "id": "01226N0640J7U",
                        "value": "Was the Viagra or Sildenafil product you tried before effective?",
                        "options": [
                            { "id": "01226N0640J7V", "value": "Yes", "include": ["sidenafil_50"] },
                            { "id": "01226N0640J7W", "value": "No", "include": ["tadalafil_20"] }
                        ]
                    },
                    {
                        "id": "01226N0640J7X",
                        "value": "Was the Cialis or Tadalafil product you tried before effective?",
                        "options": [
                            { "id": "01226N0640J7Y", "value": "Yes", "include": ["tadalafil_10"] },
                            { "id": "01226N0640J7Z", "value": "No", "include": ["sidenafil_100"] }
                        ]
                    },
                    {
                        "id": "01226N0640J80",
                        "value": "Which is your preferred treatment?",
                        "options": [
                            { "id": "01226N0640J81", "value": "Viagra or Sildenafil", "include": ["sidenafil_100"] },
                            { "id": "01226N0640J82", "value": "Cialis or Tadalafil", "include": ["tadalafil_20"] },
                            { "id": "01226N0640J83", "value": "None of the above", "include": ["sidenafil_100", "tadalafil_20"] }
                        ]
                    }
                ]
            }
        ];
    }

    findAll(): Question[] {
        return this.data.sort((one, another) => one.rank - another.rank);
    }
}