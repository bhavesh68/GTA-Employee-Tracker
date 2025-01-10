import { pool, connectToDb } from "./connection.js";
await connectToDb();

export const getDepartments = async (): Promise<any[]> => {
  const sql = `SELECT id, name FROM department;`;
  try {
    const result = await pool.query(sql);
    return result.rows;
  } catch (err) {
    return [];
  }
};

export const getRoles = async (): Promise<any[]> => {
  const sql = `
    Select 
        r.id, r.title, 
        d.name As department, r.salary
    From 
        role r 
        LEFT JOIN department d
        ON d.id = r.department_id;
    `;
  try {
    const result = await pool.query(sql);
    return result.rows;
  } catch (err) {
    return [];
  }
};

export const getEmployees = async (): Promise<any[]> => {
  const sql = `
  SELECT
  e.id,
    e.first_name,
    e.last_name,
    r.title,
    d.name AS department,
      r.salary,
      (m.first_name || ' ' || m.last_name) AS manager
  FROM
  employee e
LEFT JOIN role r 
  ON r.id = e.role_id 
LEFT JOIN department d 
  ON d.id = r.department_id 
LEFT JOIN employee m
  ON m.id = e.manager_id;
  `;
  try {
    const result = await pool.query(sql);
    return result.rows;
  } catch (err) {
    return [];
  }
};
export const addDepartment = async (name: string) => {
  const query = "INSERT INTO department (name) VALUES ($1) RETURNING *;";
  const values = [name];
  const res = await pool.query(query, values);
  return res.rows[0];
};

// export const addRole = async (name: string) => {
//   const query = "INSERT INTO role (name) VALUES ($1) RETURNING *;";
//   const values = [name];
//   const res = await pool.query(query, values);
//   return res.rows[0];
// };

export const addRole = async (name: string, salary: number, departmentId: number) => {
  const query = `
    INSERT INTO role (title, salary, department_id) 
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const values = [name, salary, departmentId];
  const res = await pool.query(query, values);
  return res.rows[0];
};

// export const addEmployee = async (name: string) => {
//   const query = "INSERT INTO employee (name) VALUES ($1) RETURNING *;";
//   const values = [name];
//   const res = await pool.query(query, values);
//   return res.rows[0];
// };

export const addEmployee = async (firstName: string, lastName: string, roleId: number, managerId: number | null) => {
  const query = `
    INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [firstName, lastName, roleId, managerId];
  const res = await pool.query(query, values);
  return res.rows[0];
};

export const updateEmployeeRole = async (employeeId: number, roleId: number) => {
  const query = `
    UPDATE employee 
    SET role_id = $1 
    WHERE id = $2 RETURNING *;
  `;
  const values = [roleId, employeeId];
  const res = await pool.query(query, values);
  return res.rows[0];
}