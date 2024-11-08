const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const https = require("https");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'http://192.168.0.157:8080',
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));

// Serve static files from the _data directory
app.use("/data", express.static(path.join(__dirname, "_data")));

// Define the path to the JSON file for storing access token and user ID
const authDataFilePath = path.join(__dirname, "authData.json");

// Storage for access token and user ID
let accessToken = "";
let userId = "";

// Function to load the access token and user ID from the JSON file
const loadAuthData = () => {
  if (fs.existsSync(authDataFilePath)) {
    const data = fs.readFileSync(authDataFilePath, "utf-8");
    const parsedData = JSON.parse(data);
    accessToken = parsedData.accessToken || "";
    userId = parsedData.userId || "";
  }
};

// Function to save the access token and user ID to the JSON file
const saveAuthData = async () => {
  const data = {
    accessToken,
    userId,
  };
  fs.writeFileSync(authDataFilePath, JSON.stringify(data, null, 2), "utf-8");
};

// Function to save updated data to a JSON file, optionally with a timestamp
const saveDataToFile = (folder, fileName, data, withTimestamp = true) => {
  const folderPath = path.join(__dirname, "_data", folder);

  // Create the folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true }); // Recursive to ensure all parent folders are created
  }

  let filePath;
  
  // If saving master.json, skip timestamp
  if (fileName === "master") {
    filePath = path.join(folderPath, "master.json");
  } else if (withTimestamp) {
    // Get current date and time in IST
    const now = new Date();

    // Format the date and time to IST
    const options = {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    // Get date and time formatted string
    const dateTimeInIST = now
      .toLocaleString("en-IN", options)
      .replace(/, /g, "_")
      .replace(/:/g, "-");

    // Format to YYYY-MM-DD_hh_mm_ss
    const timestamp = dateTimeInIST.replace(/\//g, "-"); // Replace slashes with dashes
    filePath = path.join(folderPath, `${fileName}-${timestamp}.json`);
  } else {
    filePath = path.join(folderPath, `${fileName}.json`);
  }

  // Ensure the file directory exists before saving
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Saved ${fileName} data at ${filePath}`);
  } catch (error) {
    console.error(`Error saving file: ${error.message}`); // Log any saving errors
  }
};

// Call this function on server start to load existing data
loadAuthData();

// Automatically login user when accessing /admin
app.get("/admin", async (req, res) => {
  try {
    // Send login request to the specified API
    const loginResponse = await axios.post("https://bgc.sixorbit.com/", null, {
      params: {
        urlq: "service",
        version: "1.0",
        key: "123",
        task: "login",
        email: "dev@bgc.com",
        password: "1234",
        app_flag: "2",
        network_ip: "10.0.2.16",
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Disable SSL verification
    });

    // Extract access_token and user_id from the response
    if (loginResponse.data.success) {
      accessToken = loginResponse.data.data.access_token;
      userId = loginResponse.data.data.user_id;

      // Save the new access token and user ID to the JSON file
      await saveAuthData();

      console.log("New Access Token:", accessToken);
      console.log("User ID:", userId);

      return res.json({
        success: true,
        accessToken,
        userId,
        loggedIn: true,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Login failed, please check your credentials." });
    }
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ error: "Login failed, please try again." });
  }
});

// API endpoint to fetch variations
app.get("/variations", async (req, res) => {
  if (!accessToken || !userId) {
    console.error("Access token or user ID is missing.");
    return res
      .status(401)
      .json({ success: false, message: "User is not logged in." });
  }

  const apiUrl = `https://bgc.sixorbit.com/?urlq=service&version=1.0&key=123&task=variation/fetch&user_id=${userId}&access_token=${accessToken}&last_updated&limit=&searchtext&limit_bit=0`;

  try {
    const response = await axios.get(apiUrl, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    const data = response.data;

    if (data.success) {
      // Save the fetched variations data
      saveDataToFile("variations", "variations", data);
      return res.json(data);
    } else {
      return res.status(400).json({ success: false, message: data.message });
    }
  } catch (error) {
    console.error("Error fetching variations:", error.message);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      return res
        .status(error.response.status)
        .json({ success: false, message: error.response.data });
    } else {
      console.error("Error details:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching variations." });
    }
  }
});

// API endpoint to fetch categories
app.get("/categories", async (req, res) => {
  if (!accessToken || !userId) {
    return res
      .status(401)
      .json({ success: false, message: "User is not logged in." });
  }

  const apiUrl = `http://bgc.sixorbit.com/?urlq=service&version=1.0&key=123&task=variation/fetch_category&user_id=${userId}&access_token=${accessToken}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.success) {
      // Save the fetched categories data
      saveDataToFile("categories", "categories", data);
      return res.json(data);
    } else {
      return res.status(400).json({ success: false, message: data.message });
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching categories." });
  }
});

// API endpoint to fetch users
app.get("/users", async (req, res) => {
  if (!accessToken || !userId) {
    return res
      .status(401)
      .json({ success: false, message: "User is not logged in." });
  }

  const apiUrl = `http://bgc.sixorbit.com/?urlq=service&version=4.0&key=123&task=customer%2Ffetch&user_id=${userId}&access_token=${accessToken}&last_fetch&traversal&search&order_flag&start_limit&cno&default_limit=10`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data.success) {
      // Save the fetched categories data
      saveDataToFile("users", "users", data);
      return res.json(data);
    } else {
      return res.status(400).json({ success: false, message: data.message });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching users." });
  }
});

// API endpoint to merge selected files
app.post("/master", async (req, res) => {
  // const { categories, products, users } = req.body;
  const { categories, products } = req.body;

  const categoriesPath = path.join(__dirname, "_data", "categories");
  const variationsPath = path.join(__dirname, "_data", "variations");
  // const usersPath = path.join(__dirname, "_data", "users");
  const masterFolder = "master";

  // Input validation
  // if (!Array.isArray(categories) || !Array.isArray(products) || !Array.isArray(users) || categories.length === 0 || products.length === 0 || users.length === 0
  if (!Array.isArray(categories) || !Array.isArray(products) || categories.length === 0 || products.length === 0) {
    return res.status(400).json({ success: false, message: "All fields must have selections." });
  }

  try {
    // Function to read JSON files from a directory
    const readJsonFiles = async (fileNames, directory) => {
      const data = [];
      for (const fileName of fileNames) {
        const filePath = path.join(directory, fileName);
        if (fs.existsSync(filePath)) {
          const fileData = JSON.parse(await fs.promises.readFile(filePath, "utf-8"));
          data.push(fileData);
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      }
      return data;
    };

    // Read the selected categories, products, and users
    const categoriesData = await readJsonFiles(categories, categoriesPath);
    const variationsData = await readJsonFiles(products, variationsPath);
    // const usersData = await readJsonFiles(users, usersPath);

    // Merge the data
    const mergedData = {
      category_data: categoriesData.length ? categoriesData[0] : {},
      product_data: variationsData.length ? variationsData[0] : {},
      // user_data: usersData.length ? usersData[0] : {}
    };

    // Save the merged data to the master directory
    try {
      await saveDataToFile(masterFolder, "master", mergedData, false);
    } catch (saveError) {
      console.error("Error saving data to file:", saveError.message);
      return res.status(500).json({ success: false, message: "Error saving data." });
    }

    return res.json({ success: true, data: mergedData });
  } catch (error) {
    console.error("Error fetching merged data:", error.message);
    return res.status(500).json({ success: false, message: "Error fetching merged data." });
  }
});

// API endpoint to fetch history of fetched files
app.get("/history", async (req, res) => {
  const categoriesDir = path.join(__dirname, "_data", "categories");
  const variationsDir = path.join(__dirname, "_data", "variations");
  // const usersDir = path.join(__dirname, "_data", "users");

  // Helper function to read files from a directory and return them
  const getFilesFromDirectory = (directory) => {
    if (fs.existsSync(directory)) {
      return fs.readdirSync(directory).filter((file) => file.endsWith(".json")); // Only JSON files
    }
    return [];
  };

  // Get the list of files from each directory
  const categoriesFiles = getFilesFromDirectory(categoriesDir);
  const variationsFiles = getFilesFromDirectory(variationsDir);
  // const usersFiles = getFilesFromDirectory(usersDir);

  // Create a history object
  const history = {
    categories: categoriesFiles,
    variations: variationsFiles,
    // users: usersFiles,
  };

  // Send the history object as a JSON response
  return res.json({
    success: true,
    history,
  });
});

// API endpoint to check if a user exists and to add customer data
app.post("/check-user", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!accessToken || !userId) {
      return res.status(401).json({ success: false, message: "User is not logged in." });
  }

  try {
      // Check if the user exists using the phone number
      const fetchResponse = await axios.get(`http://bgc.sixorbit.com/?urlq=service&version=4.0&key=123&task=customer%2Ffetch&user_id=${userId}&access_token=${accessToken}&search=${phoneNumber}`);

      if (fetchResponse.data.success && fetchResponse.data.data.customers.length > 0) {
          console.log('User already exists.');
          return res.status(200).json({ success: false, message: 'User already exists.' });
      } else {
          const addResponse = await axios.post(`http://bgc.sixorbit.com/?urlq=service&version=4.0&key=123&task=customer/add_customer&user_id=${userId}&access_token=${accessToken}`, req.body);
          
          if (addResponse.data.success) {
              console.log('Customer added successfully!');
              return res.json({ success: true, message: 'Customer added successfully!' });
          } else {
              return res.status(400).json({ success: false, message: addResponse.data.message });
          }
      }
  } catch (error) {
      console.error("Error fetching or adding customer:", error);
      return res.status(500).json({ success: false, message: "Error processing request." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://192.168.0.157:${PORT}`);
});