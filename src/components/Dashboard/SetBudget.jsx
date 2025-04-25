/* eslint-disable react/jsx-no-undef */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Snackbar from "@mui/material/Snackbar";

// Styled Components (CSS-in-JS)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  width: 450px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-family: "Arial", sans-serif;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  &:focus {
    border-color: #101010;
  }
`;

const SelectField = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  &:focus {
    border-color: #101010;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
  background-color: ${({ color }) => color || "#101010"};
  color: white;
  &:hover {
    background-color: ${({ color }) => (color ? "#2C2C2C" : "#181818")};
  }
`;

const CancelButton = styled(Button)`
  background-color: #f0f0f0;
  color: #333;
  margin-top: 5px;
  &:hover {
    background-color: #e1e1e1;
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 5px;
`;

const Alert = React.forwardRef((props, ref) => (
  <MuiAlerty elevation={6} ref={ref} variant="filled" {...props} />
));

export default function SetBudget() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [income, setIncome] = useState(""); // For total income input
  const [categoryAmount, setCategoryAmount] = useState(""); // For category amount
  const [incomeError, setIncomeError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSetIncome = async () => {
    if (!income) {
      setIncomeError("Income amount is required");
      return;
    }

    try {
      const apiUrl = "http://localhost:8000/api/budget/add-income/";
      const requestData = {
        user_id: "2",
        income,
        email: "one@example.com", // Replace with actual email
      };

      const response = await axios.post(apiUrl, requestData);
      console.log("Income added successfully:", response.data);
      setSnackbarMessage("Income added successfully!");
      setSnackbarSeverity("success");
      setShowIncomeModal(false); // Close the income modal on success
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to add income:", error);
      setSnackbarMessage("Failed to add income. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSetCategory = async () => {
    if (!category || !categoryAmount) {
      setCategoryError("Both category and amount are required");
      return;
    }

    try {
      const apiUrl = "http://localhost:8000/expense/addCategory/";
      const requestData = {
        user_id: "2",
        category_name: category,
        total_categoty_budget: categoryAmount,
        email: "one@example.com",
      };

      const response = await axios.post(apiUrl, requestData);
      console.log("Category added successfully:", response.data);
      setSnackbarMessage("Category added successfully!");
      setSnackbarSeverity("success");
      setShowCategoryModal(false); // Close the category modal on success
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to add category:", error);
      setSnackbarMessage("Failed to add category. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="mb-6 md:mb-10">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2 break-all text-wrap">
            ExpenseEase
          </h3>
          <div className="text-[#101010] opacity-50 text-xs md:text-sm">
            01 - 25 March, 2020
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full mt-11">
          <div className="w-full">
            <div className="text-xl md:text-2xl font-bold pl-2 pb-3 mb-4 border-b-[0.5px] border-[#828282]">
              Set Budget
            </div>

            <div className="flex flex-col gap-4">
              <div className="relative">
                <button
                  className="w-full p-3 md:p-4 border border-gray-200 rounded-lg text-sm md:text-base"
                  onClick={() => setShowIncomeModal(true)}
                >
                  Add Income
                </button>
                <button
                  className="w-full p-3 md:p-4 border border-gray-200 rounded-lg text-sm md:text-base"
                  onClick={() => setShowCategoryModal(true)}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add Income */}
      {showIncomeModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Add Income</h2>
            <InputField
              type="number"
              placeholder="Total Income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
            {incomeError && <ErrorText>{incomeError}</ErrorText>}
            <Button color="#101010" onClick={handleSetIncome}>
              Submit
            </Button>
            <CancelButton onClick={() => setShowIncomeModal(false)}>
              Cancel
            </CancelButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal for Add Category */}
      {showCategoryModal && (
        <ModalOverlay>
          <ModalContent>
            <h2>Add Category</h2>
            <SelectField
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Food and Drinks">Food and Drinks</option>
              <option value="Grocery">Grocery</option>
              <option value="Housing">Housing</option>
              <option value="Transportation">Transportation</option>
              <option value="Vehicle">Vehicle</option>
            </SelectField>
            <InputField
              type="number"
              placeholder="Amount"
              value={categoryAmount}
              onChange={(e) => setCategoryAmount(e.target.value)}
            />
            {categoryError && <ErrorText>{categoryError}</ErrorText>}
            <Button color="#101010" onClick={handleSetCategory}>
              Submit
            </Button>
            <CancelButton onClick={() => setShowCategoryModal(false)}>
              Cancel
            </CancelButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Snackbar for API responses */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

