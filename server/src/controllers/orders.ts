/*
const User = require('../models/user')

//...

notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({}).populate('user', { email: 1, name: 1 or whatever})

  response.json(notes)
});

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  
  response.json(savedNote)
})*/