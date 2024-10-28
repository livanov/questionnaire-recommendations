import { Request, Response } from 'express';
import Question from '../domain/question';
import QuestionsRepository from "../domain/questions.repository";
import QuestionDto from './dtos/question.dto';
import List from '../domain/list';
import Option from '../domain/option';
import OptionDto from './dtos/option.dto';
import Subquestion from '../domain/subquestion';
import SubquestionDto from './dtos/subquestion.dto';

export default class QuestionsController {

    constructor(private readonly repository: QuestionsRepository) {
    }

    getQuestions(request: Request, response: Response<List<QuestionDto>>) {
        const questions = this.repository.findAll();
        response.send({
            content: questions.map(this.transformQuestion.bind(this))
        })
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