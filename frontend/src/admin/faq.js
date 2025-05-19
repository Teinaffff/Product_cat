import React, { useState, useEffect } from "react";
import { Button, TextField, Typography, Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import axios from "axios";

const FaqManager = () => {
  // State for FAQ data, form fields, and error messages
  const [faqList, setFaqList] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch FAQ entries on component mount
  useEffect(() => {
    fetchFaqs();
  }, []);

  // Fetch FAQ data from the server
  const fetchFaqs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/faq");
      setFaqList(response.data);
    } catch (err) {
      console.error("Error fetching FAQ entries:", err);
      setError("Error fetching FAQ entries");
    }
  };

  // Add a new FAQ
  const handleAddFaq = async () => {
    if (!question || !answer) {
      setError("Question and answer are required.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/faq", { question, answer });
      setFaqList([...faqList, response.data.faq]); // Append new FAQ
      setQuestion("");
      setAnswer("");
      setSuccess("FAQ added successfully");
    } catch (err) {
      console.error("Error adding FAQ:", err);
      setError("Error adding FAQ");
    }
  };

  // Delete an FAQ
  const handleDeleteFaq = async (id) => {
    try {
      await axios.delete("http://localhost:5000/api/faq", { data: { id } });
      setFaqList(faqList.filter((faq) => faq.id !== id)); // Remove FAQ from list
      setSuccess("FAQ deleted successfully");
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      setError("Error deleting FAQ");
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Frequently Asked Questions
      </Typography>

      {/* Error and Success messages */}
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success.main">{success}</Typography>}

      {/* Add FAQ Form */}
      <Box sx={{ marginBottom: 2 }}>
        <TextField
          label="Question"
          variant="outlined"
          fullWidth
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Answer"
          variant="outlined"
          fullWidth
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" onClick={handleAddFaq}>
          Add FAQ
        </Button>
      </Box>

      {/* FAQ List */}
      <Typography variant="h5" gutterBottom>
        Existing FAQs
      </Typography>
      <List>
        {faqList.map((faq) => (
          <ListItem key={faq.id} sx={{ display: "flex", justifyContent: "space-between" }}>
            <ListItemText primary={faq.question} secondary={faq.answer} />
            <IconButton onClick={() => handleDeleteFaq(faq.id)} color="error">
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FaqManager;
