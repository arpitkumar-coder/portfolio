const { pool } = require("../config/db");

async function getPortfolio(req, res, next) {
  try {
    const profileResult = await pool.query(
      "SELECT id, name, role, bio, email, location, github, linkedin FROM profile WHERE id = 1"
    );

    const skillsResult = await pool.query(
      "SELECT id, name, category, level FROM skills ORDER BY category, name"
    );

    const projectsResult = await pool.query(`
      SELECT
        p.id,
        p.title,
        p.description,
        p.live_url AS "liveUrl",
        p.github_url AS "githubUrl",
        p.featured,
        COALESCE(
          json_agg(pt.technology ORDER BY pt.technology)
          FILTER (WHERE pt.technology IS NOT NULL),
          '[]'::json
        ) AS tech
      FROM projects p
      LEFT JOIN project_technologies pt ON pt.project_id = p.id
      GROUP BY p.id
      ORDER BY p.featured DESC, p.created_at DESC
    `);

    if (!profileResult.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Portfolio profile has not been configured."
      });
    }

    res.json({
      success: true,
      data: {
        profile: profileResult.rows[0],
        skills: skillsResult.rows,
        projects: projectsResult.rows
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getPortfolio };
