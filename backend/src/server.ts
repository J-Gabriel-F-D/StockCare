import app from "./app";

const PORT = process.env.PORT || 3000;

const main = async () => {
  try {
    await app.listen(PORT);
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

main();
