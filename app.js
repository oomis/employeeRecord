// require("dotenv").config();
// require("./config/database").connect();
// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const User = require("./model/user");
// const auth = require("./middleware/auth");

// const app = express();

// app.use(express.json({ limit: "50mb" }));

// const getUser = async (req, res, next) => {
//   let user;
//   try {
//     user = await User.findById(req.params.id);
//     if (user == null) {
//       return res.status(404).json({ message: "Cannot find user" });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
//   res.user = user;
//   next();
// };


// // register user
// app.post("/register", auth, async (req, res) => {
//   try {
//     // Check if the authenticated user exists
//     const existingUser = await User.findById(req.user.user_id);
//     if (!existingUser) {
//       return res.status(401).send("Unauthorized");
//     }

//     // Check if the authenticated user has the necessary permissions
//     if (existingUser.user_type !== "Admin" && existingUser.user_type !== "Worker") {
//       return res.status(403).send("Insufficient permissions");
//     }

//     // Get user input
//     const { first_name, last_name, email, password, phone, address, user_type } = req.body;

//     // Validate user input
//     if (!(email && password && first_name && last_name && user_type)) {
//       return res.status(400).send("All input is required");
//     }

//     // Check if the user_type is valid based on the authenticated user's user_type
//     if (
//       (existingUser.user_type === "Worker" && user_type === "Admin") ||
//       (existingUser.user_type === "Member" && (user_type === "Admin" || user_type === "Worker"))
//     ) {
//       return res.status(403).send("Insufficient permissions");
//     }

//     // check if user already exists
//     // Validate if user exists in our database
//     const oldUser = await User.findOne({ email });

//     if (oldUser) {
//       return res.status(409).send("User Already Exists. Please Login");
//     }

//     // Encrypt user password
//     const encryptedPassword = await bcrypt.hash(password, 10);

//     // Create user in our database
//     const user = await User.create({
//       first_name,
//       last_name,
//       email: email.toLowerCase(), // sanitize: convert email to lowercase
//       password: encryptedPassword,
//       phone,
//       address,
//       user_type,
//       added_by: existingUser._id, // Set the added_by field to the existing user's ID
//     });

//     // Create token
//     const token = jwt.sign(
//       { user_id: user._id, email },
//       process.env.TOKEN_KEY,
//       {
//         expiresIn: "2h",
//       }
//     );

//     // save user token
//     user.token = token;

//     // return new user
//     res.status(201).json(user);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: err.message });
//   }
// });


// app.post("/login", async (req, res) => {
//   try {
//     // Get user input
//     const { email, password } = req.body;

//     // Validate user input
//     if (!(email && password)) {
//       res.status(400).send("All input is required");
//     }
//     // Validate if user exist in our database
//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       // Create token
//       const token = jwt.sign(
//         { user_id: user._id, email },
//         process.env.TOKEN_KEY,
//         {
//           expiresIn: "2h",
//         }
//       );

//       // save user token
//       user.token = token;

//       // user
//       res.status(200).json(user);
//     }

//     res.status(400).send("Invalid Credentials");
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/welcome", auth, (req, res) => {
//   res.status(200).send("Welcome 🙌 ");
// });

// // get all users
// // app.get("/users", auth, async (req, res) => {
// //   try {
// //     const users = await User.find();
// //     res.status(200).json(users);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });


// app.get("/users", auth, async (req, res) => {
//   try {
//     const { search, first_name, last_name, email } = req.query; // Extract the query parameters

//     let query = {}; // Define an empty query object

//     if (search) {
//       // If a search query is provided, construct the query to match the first name or last name
//       query.$or = [
//         { first_name: { $regex: search, $options: "i" } }, // Case-insensitive match for first name
//         { last_name: { $regex: search, $options: "i" } }, // Case-insensitive match for last name
//       ];
//     }

//     if (first_name) {
//       query.first_name = { $regex: first_name, $options: "i" }; // Case-insensitive match for first name
//     }

//     if (last_name) {
//       query.last_name = { $regex: last_name, $options: "i" }; // Case-insensitive match for last name
//     }

//     if (email) {
//       query.email = { $regex: email, $options: "i" }; // Case-insensitive match for email
//     }

//     const users = await User.find(query); // Apply the constructed query

//     if (users.length === 0) {
//       return res.status(404).json({ message: "No results found" }); // Return a message if no results are found
//     }

//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// // get user by id
// app.get("/users/:id", auth, getUser, async (req, res) => {
//   try {
//     const existingUser = await User.findById(req.user.user_id);
//     const requestedUserType = res.user.user_type;

//     // Check if the authenticated user has permission to access the requested user's details
//     if (
//       existingUser.user_type !== "Admin" &&
//       (existingUser.user_type !== "Worker" || requestedUserType !== "Member")
//     ) {
//       return res.status(403).send("Insufficient permissions");
//     }

//     res.json(res.user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });



// // update user by id
// app.patch("/users/:id", auth, getUser, async (req, res) => {
//   if (req.body.first_name != null) {
//     res.user.first_name = req.body.first_name;
//   }
//   if (req.body.last_name != null) {
//     res.user.last_name = req.body.last_name;
//   }
//   if (req.body.email != null) {
//     res.user.email = req.body.email;
//   }
//   if (req.body.password != null) {
//     res.user.password = req.body.password;
//   }
//   try {
//     const updatedUser = await res.user.save();
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // delete user by id
// app.delete("/users/:id", auth, getUser, async (req, res) => {
//   try {
//     await res.user.remove();
//     res.json({ message: "Deleted User" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// // This should be the last route else any after it won't work
// app.use("*", (req, res) => {
//   res.status(404).json({
//     success: "false",
//     message: "Page not found",
//     error: {
//       statusCode: 404,
//       message: "You reached a route that is not defined on this server",
//     },
//   });
// });

// module.exports = app;

























require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./model/user");
const AuditLog = require("./model/auditLog"); // Import the AuditLog model
const auth = require("./middleware/auth");

const app = express();

app.use(express.json({ limit: "50mb" }));

const getUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.user = user;
  next();
};

// Function to create audit log entry
const createAuditLog = async (action, userId) => {
  try {
    await AuditLog.create({ action, userId });
  } catch (err) {
    console.error("Error creating audit log:", err);
  }
};

// register user
app.post("/register", auth, async (req, res) => {
  try {
    // Check if the authenticated user exists
    const existingUser = await User.findById(req.user.user_id);
    if (!existingUser) {
      return res.status(401).send("Unauthorized");
    }

    // Check if the authenticated user has the necessary permissions
    if (existingUser.user_type !== "Admin" && existingUser.user_type !== "Worker") {
      return res.status(403).send("Insufficient permissions");
    }

    // Get user input
    const { first_name, last_name, email, password, phone, address, user_type } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name && user_type)) {
      return res.status(400).send("All input is required");
    }

    // Check if the user_type is valid based on the authenticated user's user_type
    if (
      (existingUser.user_type === "Worker" && user_type === "Admin") ||
      (existingUser.user_type === "Member" && (user_type === "Admin" || user_type === "Worker"))
    ) {
      return res.status(403).send("Insufficient permissions");
    }

    // check if user already exists
    // Validate if user exists in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }

    // Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      phone,
      address,
      user_type,
      added_by: existingUser._id, // Set the added_by field to the existing user's ID
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    // save user token
    user.token = token;

    // Create audit log for user registration
    await createAuditLog("User Registration", existingUser._id);

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exists in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // Create audit log for successful login
      await createAuditLog("User Login", user._id);

      // return user
      res.status(200).json(user);
    }

    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.get("/users", auth, async (req, res) => {
  try {
    const { search, first_name, last_name, email } = req.query; // Extract the query parameters

    let query = {}; // Define an empty query object

    if (search) {
      // If a search query is provided, construct the query to match the first name or last name
      query.$or = [
        { first_name: { $regex: search, $options: "i" } }, // Case-insensitive match for first name
        { last_name: { $regex: search, $options: "i" } }, // Case-insensitive match for last name
      ];
    }

    if (first_name) {
      query.first_name = { $regex: first_name, $options: "i" }; // Case-insensitive match for first name
    }

    if (last_name) {
      query.last_name = { $regex: last_name, $options: "i" }; // Case-insensitive match for last name
    }

    if (email) {
      query.email = { $regex: email, $options: "i" }; // Case-insensitive match for email
    }

    const users = await User.find(query); // Apply the constructed query

    if (users.length === 0) {
      return res.status(404).json({ message: "No results found" }); // Return a message if no results are found
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/users/:id", auth, getUser, async (req, res) => {
  try {
    const existingUser = await User.findById(req.user.user_id);
    const requestedUserType = res.user.user_type;

    // Check if the authenticated user has permission to access the requested user's details
    if (
      existingUser.user_type !== "Admin" &&
      (existingUser.user_type !== "Worker" || requestedUserType !== "Member")
    ) {
      return res.status(403).send("Insufficient permissions");
    }

    res.json(res.user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/users/:id", auth, getUser, async (req, res) => {
  if (req.body.first_name != null) {
    res.user.first_name = req.body.first_name;
  }
  if (req.body.last_name != null) {
    res.user.last_name = req.body.last_name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/users/:id", auth, getUser, async (req, res) => {
  try {
    await res.user.remove();

    // Create audit log for user deletion
    await createAuditLog("User Deletion", req.user.user_id);

    res.json({ message: "Deleted User" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/auditlogs", auth, async (req, res) => {
  try {
    const auditLogs = await AuditLog.find().populate("user");
    res.status(200).json(auditLogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;
