import Question from "./question";

export default interface QuestionsRepository {
    findAll(): Question[];
}