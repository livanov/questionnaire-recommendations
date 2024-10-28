import express, { Express } from 'express';
import QuestionsController from './web/questions.controller';
import InMemoryQuestionsRepository from './persistence/in-memory-questions.repository';
import QuestionsRepository from './domain/questions.repository';
import Question from './domain/question';

export default class AppBuilder {

    private questionsRepository?: QuestionsRepository;

    provideQuestionsRepository(repostiory: QuestionsRepository): AppBuilder {
        this.questionsRepository = repostiory;
        return this;
    }

    build(): Express {
        const app = express();

        const questionsRepository = this.questionsRepository || new InMemoryQuestionsRepository();
        const questionsController = new QuestionsController(questionsRepository);

        app.get('/api/v0/questions', questionsController.getQuestions.bind(questionsController));

        return app;
    }
}
