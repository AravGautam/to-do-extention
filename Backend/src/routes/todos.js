import { Router } from 'express'
import Todo from '../models/todo.js'
import protect from '../middleware/protect.js'

const router = Router()
router.use(protect) // all todo routes require login

router.get('/', async (req, res) => {
  const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 })
  res.json(todos)
})

router.post('/', async (req, res) => {
  const { text, url, pageTitle } = req.body
  const todo = await Todo.create({ user: req.userId, text, url, pageTitle })
  res.status(201).json(todo)
})

router.patch('/:id', async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { completed: req.body.completed },
    { new: true }
  )
  res.json(todo)
})

router.delete('/:id', async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId })
  res.json({ ok: true })
})

export default router