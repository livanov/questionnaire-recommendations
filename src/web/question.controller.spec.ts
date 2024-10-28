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
})