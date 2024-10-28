import Answer from "./answer";
import Error from './error';
import Option from "./option";
import Question from "./question";
import QuestionsRepository from "./questions.repository";
import { Result } from "./result";

export default class QuestionsService {

    constructor(private repository: QuestionsRepository) {
    }

    findAll(): Question[] {
        return this.repository.findAll();
    }

    answer(answers: Answer[]): Result<string[], Error[]> {

        const questions = this.findAll();
        const questionsLookup = questions.reduce(
            (accumulator, question) => accumulator.set(question.id, question),
            new Map<string, Question>()
        );

        const result = answers.reduce(
            (accumulator, answer) => {
                const result = this.validateAnswer(answer, questionsLookup);

                accumulator.missingIds.delete(answer.questionId);

                if (result.ok) {
                    accumulator.options.push(result.value);
                } else {
                    accumulator.errors.push(result.error);
                }

                return accumulator;
            },
            { options: [], errors: [], missingIds: new Set(questionsLookup.keys()) } as { options: Option[], errors: Error[], missingIds: Set<string> }
        );

        if (result.errors.length > 0 || result.missingIds.size > 0) {
            return {
                ok: false,
                error: result.errors.concat(Array.from(result.missingIds).map(missingId => ({
                    title: 'ANSWER_TO_QUESTION_NOT_FOUND',
                    detail: `No answer was found to question with ID '${missingId}'`
                })))
            }
        }

        // we should save the answers for future reference, thus creating the RESTful resource on the current path
        // however, since it is not required at this time - we will not be implementing it

        return {
            ok: true,
            value: result.options.reduce(
                (accumulator, option) => {
                    if (option.include) {
                        return option.include.filter(value => accumulator.includes(value));
                    }

                    return accumulator;
                },
                ['sidenafil_100', 'sidenafil_50', 'tadalafil_20', 'tadalafil_10']
            )
        }
    }

    private validateAnswer(answer: Answer, questionsLookup: Map<string, Question>): Result<Option, Error> {

        const question = questionsLookup.get(answer.questionId);

        if (question == undefined) {
            return {
                ok: false,
                error: {
                    title: "QUESTION_NOT_FOUND",
                    detail: `No question with ID '${answer.questionId}' was found`
                }
            };
        }

        const option = question.options.find(option => option.id === answer.optionId);

        if (option == undefined) {
            return {
                ok: false,
                error: {
                    title: "OPTION_NOT_FOUND",
                    detail: `No option with ID '${answer.optionId}' was found as a valid option for question with ID '${answer.questionId}'`
                }
            };
        }

        return {
            ok: true,
            value: option
        };
    }
}