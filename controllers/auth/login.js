const login = async (req, res) => {
  const { email, password } = req.body
  try {
    console.log(email, password)
    res.json('Successfully logged In')
  } catch (error) {
    console.error('failed to log in:', err)
    process.exit(1)
  }
}
export default login
