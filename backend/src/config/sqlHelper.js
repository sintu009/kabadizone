const pool = require("./db");

class SqlHelper {
  // ------------------------------
  // CALL STORED PROCEDURE
  // ------------------------------
  static async callSP(spName, params = []) {
    const placeholders = params.map(() => "?").join(",");
    const sql = `CALL ${spName}(${placeholders});`;
    const [result] = await pool.query(sql, params);
    return result;
  }

  // ------------------------------
  // GET SINGLE RESULT
  // ------------------------------
  static async getOne(spName, params = []) {
    const result = await this.callSP(spName, params);
    return result[0]?.[0] || null;
  }

  // ------------------------------
  // GET LIST
  // ------------------------------
  static async getAll(spName, params = []) {
    const result = await this.callSP(spName, params);
    return result[0];
  }

  // ------------------------------
  // GET PAGED DATASET
  // RETURNS { data, total, page, limit }
  // ------------------------------
  static async getPaged(spName, params, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await this.callSP(spName, [...params, limit, offset]);

    return {
      total: result[0][0].total,
      data: result[1],
      page,
      limit,
    };
  }

  // ------------------------------
  // INSERT / UPDATE / DELETE
  // RETURNS affected rows or insert id
  // ------------------------------
  static async execute(spName, params = []) {
    const result = await this.callSP(spName, params);
    return result.affectedRows || 1;
  }

  // ------------------------------
  // TRANSACTION (MULTI-SP SAFE)
  // ------------------------------
  static async transaction(callback) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const trxHelper = {
        callSP: async (spName, params = []) => {
          const placeholders = params.map(() => "?").join(",");
          const sql = `CALL ${spName}(${placeholders});`;
          const [res] = await conn.query(sql, params);
          return res;
        },
      };

      const result = await callback(trxHelper);

      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // ------------------------------
  // ERROR HANDLER (SQL SIGNAL)
  // ------------------------------
  static handleError(err) {
    if (err.sqlState === "45000") {
      return { message: err.message, code: "BUSINESS_ERROR" };
    }
    throw err;
  }

  // ------------------------------
  // CALL SP WITH OUT PARAMETERS
  // ------------------------------
  static async callSPWithOut(spName, inParams = [], outParams = []) {
    const conn = await pool.getConnection();
    try {
      const inPlaceholders = inParams.map(() => "?").join(",");
      const outPlaceholders = outParams.map((p) => `@${p}`).join(",");

      const sql = `
      CALL ${spName}(${[inPlaceholders, outPlaceholders].filter(Boolean).join(",")});
    `;

      await conn.query(sql, inParams);

      if (outParams.length === 0) return null;

      const [rows] = await conn.query(
        `SELECT ${outParams.map((p) => `@${p} AS ${p}`).join(",")};`,
      );

      return rows[0];
    } finally {
      conn.release();
    }
  }
}

module.exports = SqlHelper;
