const { Router } = require('express')
const pool = require('../config/')
const router = Router()


// GET data
router.get('/data', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM employer')
        res.status(200).json(data.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Get data and his job
router.get('/data/:id', async (req, res) => {
    const id = req.params.id
    const dataAndJob = await pool.query(`
        SELECT * FROM employer LEFT JOIN job ON job.id = employer.job_id WHERE employer.id = $1
    `, [id])

    res.status(200).json(dataAndJob.rows[0])

})

// ADD data
router.post('/data/add', async (req, res) => {
    try {
        const { name, degree, salary, job_id } = req.body

        const newData = await pool.query(`
            INSERT INTO employer (name, degree, salary, job_id) VALUES($1, $2, $3, $4) RETURNING *
        `, [name, degree, salary, job_id])

        res.status(201).json(newData.rows[0])

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Updata data
router.put('/data/:id', async (req, res) => {
    try {
        const id = req.params.id
        const { name, degree, salary, job_id } = req.body
        const oldData = await pool.query('SELECT * FROM employer WHERE id = $1', [id])

        const UpdateData = await pool.query(`
            UPDATE employer SET name = $1, degree = $2, salary = $3, job_id = $4 WHERE id = $5 RETURNING *
        `, [
            name ? name : oldData.rows[0].name,
            degree ? degree : oldData.rows[0].degree,
            salary ? salary : oldData.rows[0].salary,
            job_id ? job_id : oldData.rows[0].job_id,
            id
        ])

        res.status(201).json(UpdateData.rows)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Delete data
router.delete('/data/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM employer WHERE id = $1', [req.params.id])
        res.status(200).json({ message: 'Data was success deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router