import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET
const time=process.env.EXPIRES_IN
export const generarToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: time })
}

export const verificarToken = (token) => {
  return jwt.verify(token, SECRET)
}