import { getUserData } from '../../lib/jwt'
import {
  IUser,
  ICreateUserInput,
  IModels,
  ILoginInput,
  IAuthPayload
} from '../../types'
import { doLogin, getUserBy } from '../../lib/auth'

const resolvers = {
  Query: {
    getUsers: (_: any, args: any, ctx: { models: IModels }): IUser[] =>
      ctx.models.User.findAll(),
    getUserData: async (
      _: any,
      { at }: { at: string },
      { models }: { models: IModels }
    ): Promise<any> => {
      const connectedUser = await getUserData(at)
      if (connectedUser) {
        const { id, email, privilege, active } = connectedUser
        const input = { id, email, privilege, active }
        const user = await getUserBy(input, models)

        if (user) return connectedUser
      }

      const userNotFound = {
        id: '',
        username: '',
        password: '',
        email: '',
        priviledge: '',
        active: false
      }
      return userNotFound
    }
  },
  Mutation: {
    createUser: (
      _: any,
      { input }: { input: ICreateUserInput },
      { models }: { models: IModels }
    ): IUser => models.User.create({ ...input }),
    login: (
      _: any,
      { input }: { input: ILoginInput },
      { models }: { models: IModels }
    ): Promise<IAuthPayload> => doLogin(input.email, input.password, models)
  }
}

export default resolvers
