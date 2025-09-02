import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error(err));

// Schema
const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
}, { timestamps: true });

const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.get("/api/todos", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post("/api/todos", async (req, res) => {
    const todo = new Todo({
        task: req.body.task
    });
    await todo.save();
    res.json(todo);
});

app.put("/api/todos/:id", async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );
    res.json(todo);
});

app.delete("/api/todos/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
