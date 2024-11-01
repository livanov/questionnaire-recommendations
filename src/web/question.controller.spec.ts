import request from 'supertest';
import AppBuilder from '../app-builder';
import InMemoryQuestionsRepository from '../persistence/in-memory-questions.repository';

describe('/api/v0/questions', () => {

    test('should return questions', async () => {

        // GIVEN
        const app = new AppBuilder()
            .provideQuestionsRepository(new InMemoryQuestionsRepository([
                {
                    id: 'id1',
                    value: 'value1',
                    rank: 1,
                    options: [
                        { id: 'id100', value: 'value100' },
                        { id: 'id101', value: 'value101' }
                    ]
                },
                {
                    id: 'id2',
                    value: 'value2',
                    rank: 2,
                    options: [
                        { id: 'id200', value: 'value200', subquestionId: 'id1' },
                        { id: 'id201', value: 'value201', subquestionId: 'id2' }
                    ]
                }
            ]))
            .build();

        // WHEN
        const response = await request(app)
            .get('/api/v0/questions');

        // THEN
        expect(response.status).toEqual(200);
        expect(response.headers["content-type"]).toEqual('application/json; charset=utf-8');
        expect(response.body.content).toHaveLength(2);
        expect(response.body.content[0]).toStrictEqual({
            id: 'id1',
            value: 'value1',
            options: [
                { id: 'id100', value: 'value100' },
                { id: 'id101', value: 'value101' }
            ]
        })
        expect(response.body.content[1]).toStrictEqual({
            id: 'id2',
            value: 'value2',
            options: [
                { id: 'id200', value: 'value200', subquestionId: 'id1' },
                { id: 'id201', value: 'value201', subquestionId: 'id2' }
            ]
        })
    })

    test('should return empty suggestions list, when no product is applicable', async () => {

        // GIVEN
        const app = new AppBuilder()
            .provideQuestionsRepository(new InMemoryQuestionsRepository([
                {
                    id: 'id1',
                    value: 'value1',
                    rank: 1,
                    options: [
                        { id: 'id100', value: 'value100', include: [] },
                        { id: 'id101', value: 'value101' }
                    ]
                }
            ]))
            .build();

        // WHEN
        const response = await request(app)
            .post('/api/v0/questions/answers')
            .send([
                { questionId: 'id1', optionId: 'id100' }
            ])

        // THEN
        expect(response.status).toEqual(201);
        expect(response.body).toStrictEqual({
            content: []
        });
    })

    test('should return product suggestions when applicable', async () => {

        // GIVEN
        const app = new AppBuilder()
            .provideQuestionsRepository(new InMemoryQuestionsRepository([
                {
                    id: 'id1',
                    value: 'value1',
                    rank: 1,
                    options: [
                        { id: 'id100', value: 'value100', include: [] },
                        { id: 'id101', value: 'value101', include: ['sidenafil_100', 'tadalafil_10'] }
                    ]
                }
            ]))
            .build();

        // WHEN
        const response = await request(app)
            .post('/api/v0/questions/answers')
            .send([
                { questionId: 'id1', optionId: 'id101' }
            ])

        // THEN
        expect(response.status).toEqual(201);
        expect(response.body).toStrictEqual({
            content: ['sidenafil_100', 'tadalafil_10']
        });
    })

    test('should return error when provided question doesn\'t exist', async () => {

        // GIVEN
        const app = new AppBuilder()
            .provideQuestionsRepository(new InMemoryQuestionsRepository([
                {
                    id: 'id1',
                    value: 'value1',
                    rank: 1,
                    options: [
                        { id: 'id100', value: 'value100' },
                        { id: 'id101', value: 'value101' }
                    ]
                }
            ]))
            .build();

        // WHEN
        const response = await request(app)
            .post('/api/v0/questions/answers')
            .send([
                { questionId: 'id1', optionId: 'id100' },
                { questionId: 'id15', optionId: 'id101' }
            ])

        // THEN
        expect(response.status).toEqual(422);
        expect(response.body.instance).toEqual("/api/v0/questions/answers");
        expect(response.body.status).toEqual(422);
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].title).toEqual("QUESTION_NOT_FOUND");
    })

    test('should return error when provided answer doesn\'t match the question', async () => {

        // GIVEN
        const app = new AppBuilder()
            .provideQuestionsRepository(new InMemoryQuestionsRepository([
                {
                    id: 'id1',
                    value: 'value1',
                    rank: 1,
                    options: [
                        { id: 'id100', value: 'value100' },
                        { id: 'id101', value: 'value101' }
                    ]
                }
            ]))
            .build();

        // WHEN
        const response = await request(app)
            .post('/api/v0/questions/answers')
            .send([
                { questionId: 'id1', optionId: 'id500' }
            ])

        // THEN
        expect(response.status).toEqual(422);
        expect(response.body.instance).toEqual("/api/v0/questions/answers");
        expect(response.body.status).toEqual(422);
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].title).toEqual("OPTION_NOT_FOUND");
    })

    test('should return error when questions remain unanswered', async () => {

        // GIVEN
        const app = new AppBuilder()
            .provideQuestionsRepository(new InMemoryQuestionsRepository([
                {
                    id: 'id1',
                    value: 'value1',
                    rank: 1,
                    options: [
                        { id: 'id100', value: 'value100' },
                        { id: 'id101', value: 'value101' }
                    ]
                }
            ]))
            .build();

        // WHEN
        const response = await request(app)
            .post('/api/v0/questions/answers')
            .send([])

        // THEN
        expect(response.status).toEqual(422);
        expect(response.body.instance).toEqual("/api/v0/questions/answers");
        expect(response.body.status).toEqual(422);
        expect(response.body.title).toEqual("ENTITY_VALIDATION_ERRORS");
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].title).toEqual("ANSWER_TO_QUESTION_NOT_FOUND");
    });
})