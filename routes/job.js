const { Router } = require('express')
const pool = require('../config/')
const router = Router()

router.get('/jobs', async (req, res) => {
    try {
        const jobs = await pool.query('SELECT * FROM job')
        res.status(200).json(jobs.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/job/add', async (req, res) => {
    try {
        const { title } = req.body

        const newJob = await pool.query(`
            INSERT INTO job (title) VALUES ($1) RETURNING *
        `, [title])

        res.status(200).json(newJob.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.put('/job/:id', async (req, res) => {
    try {
        const { title } = req.body
        const id = req.params.id

        const oldData = await pool.query('SELECT * FROM job WHERE id = $1', [id])

        const Update = await pool.query(`
            UPDATE job SET title = $1 WHERE id = $2 RETURNING *
        `, [
            title ? title : oldData.rows[0].title,
            id
        ])

        res.status(200).json(Update.rows[0])
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/job/:id', async (req, res) => {
    try {
        const id = req.params.id
        await pool.query('DELETE FROM employer WHERE job_id = $1', [id])
        await pool.query(`DELETE FROM job WHERE id = $1`, [id])
        res.status(200).json({ message: 'Job was success deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router