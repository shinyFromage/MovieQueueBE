import { objectType } from "nexus";
import { Context } from './context'


const Query = objectType({
    name: 'Query',
    definition(t) {
        
    },
});

const User = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('name')
        t.string('profileImage')
        t.nonNull.list.nonNull.field('list', {
            type: 'List',
            resolve: (parent, _, context: Context) => {
                return context.prisma.user
                    .findUnique({
                        where: { id: parent.id || undefined}
                    }).list()
            },
        })
    },
});

const List = objectType({
    name: 'List',
    definition(t) {
        t.nonNull.int('id')
        t.nonNull.string('name')
        
    },
})