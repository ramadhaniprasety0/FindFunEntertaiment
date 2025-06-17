const Schedule = require('../models/scheduleModel');

const scheduleControllers = {
  getAll: (req, res) => {
    const includeRelations = req.query.include;

    if (includeRelations === 'all') {
      Schedule.getAllComplete((err, results) => {
        if (err) {
          console.error('Error fetching complete schedules:', err);
          return res.status(500).json({ error: 'Failed to fetch schedules' });
        }
        res.json({
          success: true,
          data: results,
          count: results.length
        });
      });
    } else {
      Schedule.getAll((err, results) => {
        if (err) {
          console.error('Error fetching schedules:', err);
          return res.status(500).json({ error: 'Failed to fetch schedules' });
        }
        res.json({
          success: true,
          data: results,
          count: results.length
        });
      });
    }
  },

  getById: (req, res) => {
    const id = req.params.id;
    const includeRelations = req.query.include;

    if (includeRelations === 'all') {
      Schedule.getByIdComplete(id, (err, results) => {
        if (err) {
          console.error('Error fetching schedule:', err);
          return res.status(500).json({ error: 'Failed to fetch schedule' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'Schedule not found' });
        }
        res.json({
          success: true,
          data: results[0]
        });
      });
    } else {
      Schedule.getById(id, (err, results) => {
        if (err) {
          console.error('Error fetching schedule:', err);
          return res.status(500).json({ error: 'Failed to fetch schedule' });
        }
        if (results.length === 0) {
          return res.status(404).json({ error: 'Schedule not found' });
        }
        res.json({
          success: true,
          data: results[0]
        });
      });
    }
  },

  getByFilmId: (req, res) => {
    const filmId = req.params.filmId;
    Schedule.getByFilmId(filmId, (err, results) => {
      if (err) {
        console.error('Error fetching schedules by film ID:', err);
        return res.status(500).json({ error: 'Failed to fetch schedules' });
      }
      res.json({
        success: true,
        data: results,
        count: results.length
      });
    });
  },

  create: (req, res) => {
    const { film_id, cinema_location_id, show_time, price_id } = req.body;

    // Validasi input
    if (!film_id || !cinema_location_id || !show_time || !price_id) {
      return res.status(400).json({ error: 'All fields are required (film_id, cinema_location_id, show_time, price_id)' });
    }

    const scheduleData = {
      film_id,
      cinema_location_id,
      show_time,
      price_id,
      created_at: new Date(),
      updated_at: new Date()
    };

    Schedule.create(scheduleData, (err, result) => {
      if (err) {
        console.error('Error creating schedule:', err);
        return res.status(500).json({ error: 'Failed to create schedule' });
      }
      res.status(201).json({
        success: true,
        message: 'Schedule created successfully',
        data: { id: result.insertId, ...scheduleData }
      });
    });
  },

  update: (req, res) => {
    const id = req.params.id;
    const { film_id, cinema_location_id, show_time, price_id } = req.body;

    // Validasi input
    if (!film_id && !cinema_location_id && !show_time && !price_id) {
      return res.status(400).json({ error: 'At least one field must be provided for update' });
    }

    const scheduleData = {};
    if (film_id) scheduleData.film_id = film_id;
    if (cinema_location_id) scheduleData.cinema_location_id = cinema_location_id;
    if (show_time) scheduleData.show_time = show_time;
    if (price_id) scheduleData.price_id = price_id;
    scheduleData.updated_at = new Date();

    Schedule.update(id, scheduleData, (err, result) => {
      if (err) {
        console.error('Error updating schedule:', err);
        return res.status(500).json({ error: 'Failed to update schedule' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.json({
        success: true,
        message: 'Schedule updated successfully',
        data: { id, ...scheduleData }
      });
    });
  },

  delete: (req, res) => {
    const id = req.params.id;

    Schedule.delete(id, (err, result) => {
      if (err) {
        console.error('Error deleting schedule:', err);
        return res.status(500).json({ error: 'Failed to delete schedule' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.json({
        success: true,
        message: 'Schedule deleted successfully'
      });
    });
  }
};

module.exports = scheduleControllers;