import jwt from 'jsonwebtoken'
import { encrypt, setBase64, getBase64 } from '@contentpi/lib'

import { $security } from '../../config'
import { IUser } from '../types'

const { secretKey } = $security

export function jwtVerify(accessToken: string, cb: any): void {
  jwt.verify(
    accessToken,
    secretKey,
    (error: any, accessTokenData: any = {}) => {
      const { data: user } = accessTokenData

      if (error || !user) {
        return cb(false)
      }

      // The user data is on base64. getBase64 => JSON
      const userData = getBase64(user)

      return cb(userData)
    }
  )
}

export async function getUserData(accessToken: string): Promise<any> {
  const UserPromise = new Promise(resolve =>
    jwtVerify(accessToken, (user: any) => resolve(user))
  )
  const user = await UserPromise

  return user
}

export const createToken = async (user: IUser): Promise<string[]> => {
  const { id, username, password, email, privilege, active } = user

  const token = setBase64(`${encrypt($security.secretKey)}${password}`)

  const userData = {
    id,
    username,
    email,
    privilege,
    active,
    token
  }
  const _createToken = jwt.sign(
    { data: setBase64(userData) },
    $security.secretKey,
    { expiresIn: $security.expiresIn }
  )

  return Promise.all([_createToken])
}
