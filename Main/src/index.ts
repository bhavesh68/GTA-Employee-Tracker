import inquirer from "inquirer";
import { getDepartments, getRoles, getEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } from "./queryfunctions.js";

const mainPrompt = async () => {
  const { userChoice } = await
    inquirer.prompt([
      {
        type: "list",
        name: "userChoice",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Quit",
        ],
      },
    ]);
  switch (userChoice) {
    case "View all departments":
      const departments = await getDepartments()
      console.table(departments);
      break;
    case "View all roles":
      const roles = await getRoles()
      console.table(roles);
      break;
    case "View all employees":
      const employee = await getEmployees()
      console.table(employee);
      break;
    case "Add a department":
      try {
        // Prompt the user for the department name (allows spaces)
        const answers = await inquirer.prompt([
          {
            type: "input",
            name: "departmentName",
            message: "What is the name of the department?",
            validate: (input: string) => {
              if (!input.trim()) {
                return "Department name cannot be empty.";
              }
              return true;
            },
          },
        ]);
        // Call the DepartmentService to add the department
        const department = await addDepartment(
          answers.departmentName
        );
        console.log("Department added:", department);
      } catch (error) {
        console.error("Error adding department:", error);
      }
      break;

    // ------------------------------------------------------------------------------- //

    case "Add a role":
      try {

        const depts = await getDepartments();
        const deptChoices = depts.map(adept => ({
          name:adept.name,
          value:adept.id,
        }));

        const { roleName, salary, departmentId } = await inquirer.prompt([
          {
            type: "input",
            name: "roleName",
            message: "What is the name of the role?",
            validate: (input: string) => input.trim() ? true : "Role name cannot be empty.",
          },
          {
            type: "input",
            name: "salary",
            message: "What is the salary for this role?",
            validate: (input: string) => !isNaN(Number(input)) && Number(input) > 0 ? true : "Enter a valid salary.",
          },
          {
            type: "list",
            name: "departmentId",
            message: "Enter the department for this role:",
            choices: deptChoices,
            validate: (input: string) => !isNaN(Number(input)) ? true : "Enter a valid department ID.",
          },
        ]);
        const role = await addRole(roleName, Number(salary), Number(departmentId));
        console.log("Role added:", role);
      } catch (error) {
        console.error("Error adding role:", error);
      }
      break;
    // ------------------------------------------------------------------------------------// 

    case "Add an employee":
      try {
        const employees = await getEmployees();
       
        const employeeChoices = (employees.map(
          anEmployee => (
          {
          name: `${anEmployee.first_name} ${anEmployee.last_name}`,
          value: anEmployee.id
          }
        )));

        const roles = await getRoles();
       
        const roleChoices = (roles.map(
          aRole => (
          {
          name: aRole.title,
          value: aRole.id
          }
        )));

        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
          {
            type: "input",
            name: "firstName",
            message: "Enter the first name of the employee:",
            validate: (input: string) => input.trim() ? true : "First name cannot be empty.",
          },
          {
            type: "input",
            name: "lastName",
            message: "Enter the last name of the employee:",
            validate: (input: string) => input.trim() ? true : "Last name cannot be empty.",
          },
          {
            type: "list",
            name: "roleId",
            message: "What is the role:",
            choices: roleChoices,
            validate: (input: number) => {
              return (!input ? "Please choose a role" : true);
            }
          },
          {
            type: "list",
            name: "managerId",
            message: "Who is the manager:",
            choices: [{name: "None", value:null}, ...employeeChoices],
            validate: (input: number) => {
              return (!input ? "Please choose a manager" : true);
            }
          },
        ]);
        const employee = await addEmployee(firstName, lastName, Number(roleId), managerId ? Number(managerId) : null);
        console.log(`Employee ${employee.first_name} ${employee.last_name} is added`);
      } catch (error) {
        console.error("Error adding employee:", error);
      }
      break;
    
   // case "Update an employee role":
      case "Update an employee role":
        try {
          const employees = await getEmployees();
          const roles = await getRoles();
  
          const { employeeId, newRoleId } = await inquirer.prompt([
            {
              type: "list",
              name: "employeeId",
              message: "Select the employee whose role you want to update:",
              choices: employees.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
            },
            {
              type: "list",
              name: "newRoleId",
              message: "Select the new role for the employee:",
              choices: roles.map(role => ({ name: role.title, value: role.id })),
            },
          ]);
  
          const updatedEmployee = await updateEmployeeRole(employeeId, newRoleId);
          console.log("Employee role updated:", updatedEmployee);
        } catch (error) {
          console.error("Error updating employee role:", error);
        }
        break;
    case "Quit":
      console.log("Goodbye!");
      process.exit();
  }

  await mainPrompt();
};

mainPrompt();

