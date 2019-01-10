import 'mocha';
import * as path from 'path';
import { expect } from 'chai';
import { Loader, Resolver } from '../../src';

describe('Resolver', () => {
    it('should be resolved fixtures', () => {
        const loader = new Loader();
        loader.load(path.join(__dirname, 'assets/fixtures'));

        const resolver = new Resolver();
        const result = resolver.resolve(loader.fixtureConfigs).map(f => {
            delete f.processor;

            return f;
        });

        expect(result).to.deep.equal([
            {
                parameters: {},
                entity: 'User',
                name: 'user1',
                dependencies: [],
                data: {
                    firstName: '{{name.firstName}}',
                    lastName: '{{name.lastName}}',
                    email: '{{internet.email}}',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post1',
                dependencies: ['user1'],
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                    user: '@user1',
                },
            },
        ]);
    });

    it('should be resolved range fixtures', () => {
        const resolver = new Resolver();
        const result = resolver.resolve([
            {
                entity: 'Post',
                items: {
                    'post{1..3}': {
                        title: '{{name.title}}',
                        description: '{{lorem.paragraphs}}',
                    },
                },
            },
        ]);

        expect(result).to.deep.equal([
            {
                parameters: {},
                entity: 'Post',
                name: 'post1',
                processor: undefined,
                dependencies: [],
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post2',
                processor: undefined,
                dependencies: [],
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                },
            },
            {
                parameters: {},
                entity: 'Post',
                name: 'post3',
                processor: undefined,
                dependencies: [],
                data: {
                    title: '{{name.title}}',
                    description: '{{lorem.paragraphs}}',
                },
            },
        ]);
    });
});
