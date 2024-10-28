import express, { Express } from 'express';
import QuestionsController from './web/questions.controller';
import InMemoryQuestionsRepository from './persistence/in-memory-questions.repository';
import QuestionsRepository from './domain/questions.repository';
import QuestionsService from './domain/questions.service';

export default class AppBuilder {

    private questionsRepository?: QuestionsRepository;

    provideQuestionsRepository(repostiory: QuestionsRepository): AppBuilder {
        this.questionsRepository = repostiory;
        return this;
    }

    build(): Express {
        const app = express();

        app.use(express.json())

        const questionsRepository = this.questionsRepository || new InMemoryQuestionsRepository();
        const questionsService = new QuestionsService(questionsRepository);
        const questionsController = new QuestionsController(questionsService);

        app.get('/api/v0/questions', questionsController.getQuestions.bind(questionsController));
        app.post('/api/v0/questions/answers', questionsController.postAnswers.bind(questionsController));

        return app;
    }
}
