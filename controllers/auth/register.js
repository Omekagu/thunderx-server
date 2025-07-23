const register = async (res, req) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    dialCode,
    country
  } = req.body

  console.log('register')
}
export default register
