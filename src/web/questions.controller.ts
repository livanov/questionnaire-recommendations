import { Request, Response } from 'express';
import Answer from '../domain/answer';
import List from '../domain/list';
import Option from '../domain/option';
import Question from '../domain/question';
import QuestionsService from '../domain/questions.service';
import Subquestion from '../domain/subquestion';
import OptionDto from './dtos/option.dto';
import ProblemDetails from './dtos/problem-details.dto';
import QuestionDto from './dtos/question.dto';
import SubquestionDto from './dtos/subquestion.dto';

export default class QuestionsController {

    constructor(private readonly service: QuestionsService) {
    }

    getQuestions(request: Request, response: Response<List<QuestionDto>>) {

        const questions = this.service.findAll();

        response.send({
            content: questions.map(this.transformQuestion.bind(this))
        })
    }

    postAnswers(request: Request<{}, {}, Answer[]>, response: Response<List<string> | ProblemDetails>) {

        const recommendationResult = this.service.answer(request.body)

        if (recommendationResult.ok) {
            response.status(201).json({
                content: recommendationResult.value
            })
        } else {
            response.status(422)
                .contentType('application/problem+json')
                .json({
                    instance: request.url,
                    status: 422,
                    title: 'ENTITY_VALIDATION_ERRORS',
                    detail: 'One or more validation errors occurred. Fix your request and try again.',
                    errors: recommendationResult.error
                });
        }
    }

    private aggregateProblemDetails(errors: ProblemDetails[], missing: Set<string>, url: string): ProblemDetails {

        // instead of returning the first one we should (and we could) be sending an aggregated ProblemDetails based on all the errors

        if (errors.length > 0) {
            return errors[0];
        }

        const firstMissing = missing.keys().next().value;

        return {
            instance: url,
            status: 422,
            title: "MISSING_ANSWERS",
            detail: `Question with ID '${firstMissing}' was not answered.`
        }
    }

    private transformQuestion(question: Question): QuestionDto {
        return {
            id: question.id,
            value: question.value,
            options: question.options.map(this.transformOption.bind(this)),
            subquestions: question.subquestions?.map(this.transformSubquestion.bind(this))
        }
    }

    private transformSubquestion(question: Subquestion): SubquestionDto {
        return {
            id: question.id,
            value: question.value,
            options: question.options.map(this.transformOption.bind(this))
        }
    }

    private transformOption(option: Option): OptionDto {
        return {
            id: option.id,
            value: option.value,
            subquestionId: option.subquestionId,
        };
    }
}