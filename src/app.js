// Global variables
let expenses = [];
let editIndex = -1;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderExpenses();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Enter key support for inputs
    document.getElementById('expense-amount').addEventListener('keypress', handleEnterKey);
    document.getElementById('expense-description').addEventListener('keypress', handleEnterKey);
    document.getElementById('expense-category').addEventListener('keypress', handleEnterKey);
}

// Handle Enter key press
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        if (editIndex >= 0) {
            saveEdit();
        } else {
            addExpense();
        }
    }
}

// Add new expense
function addExpense() {
    console.log('Add expense button clicked');
    
    const amount = document.getElementById('expense-amount').value.trim();
    const description = document.getElementById('expense-description').value.trim();
    const category = document.getElementById('expense-category').value;

    console.log('Input values:', { amount, description, category });

    // Validation
    if (!amount || !description) {
        alert('Please fill in both amount and description');
        return;
    }

    if (parseFloat(amount) <= 0) {
        alert('Please enter a valid amount greater than 0');
        return;
    }

    // Create expense object
    const expense = {
        id: Date.now(),
        amount: parseFloat(amount),
        description: description,
        category: category,
        date: new Date().toISOString().split('T')[0]
    };

    // Add to expenses array
    expenses.push(expense);
    console.log('Expense added:', expense);
    console.log('Total expenses:', expenses.length);
    
    // Render and clear
    renderExpenses();
    clearInputs();
    
    // Show success message
    alert('Expense added successfully!');
}

// Edit expense
function editExpense(index) {
    console.log('Editing expense at index:', index);
    const expense = expenses[index];
    
    if (!expense) {
        console.error('Expense not found at index:', index);
        alert('Expense not found!');
        return;
    }
    
    // Populate form with expense data
    document.getElementById('expense-amount').value = expense.amount;
    document.getElementById('expense-description').value = expense.description;
    document.getElementById('expense-category').value = expense.category;
    
    // Switch to edit mode
    editIndex = index;
    toggleEditMode(true);
    
    // Scroll to form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    
    alert('Expense loaded for editing. Make changes and click "Save Edit".');
}

// Save edited expense
function saveEdit() {
    const amount = document.getElementById('expense-amount').value.trim();
    const description = document.getElementById('expense-description').value.trim();
    const category = document.getElementById('expense-category').value;

    // Validation
    if (!amount || !description) {
        alert('Please fill in both amount and description');
        return;
    }

    if (parseFloat(amount) <= 0) {
        alert('Please enter a valid amount greater than 0');
        return;
    }

    if (editIndex < 0 || editIndex >= expenses.length) {
        alert('Error: Invalid expense to edit');
        return;
    }

    const oldExpense = {...expenses[editIndex]};

    // Update expense
    expenses[editIndex] = {
        ...expenses[editIndex],
        amount: parseFloat(amount),
        description: description,
        category: category
    };

    console.log('Updated expense:', expenses[editIndex]);

    // Render and reset
    renderExpenses();
    cancelEdit();
    
    // Show success message
    alert(`Expense updated: "${oldExpense.description}" → "${description}"`);
}

// Cancel edit
function cancelEdit() {
    editIndex = -1;
    toggleEditMode(false);
    clearInputs();
}

// Toggle between add and edit mode
function toggleEditMode(isEditMode) {
    const addBtn = document.getElementById('add-expense-btn');
    const saveBtn = document.getElementById('save-edit-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');

    if (isEditMode) {
        addBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';
    } else {
        addBtn.style.display = 'inline-block';
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
    }
}

// Delete expense
function deleteExpense(index) {
    console.log('Attempting to delete expense at index:', index);
    
    const expense = expenses[index];
    if (!expense) {
        console.error('Expense not found at index:', index);
        alert('Expense not found!');
        return;
    }
    
    const confirmMessage = `Are you sure you want to delete this expense?\n\nAmount: ₹${expense.amount}\nDescription: ${expense.description}\nCategory: ${expense.category}`;
    
    if (confirm(confirmMessage)) {
        // Remove expense from array
        const deletedExpense = expenses.splice(index, 1)[0];
        console.log('Deleted expense:', deletedExpense);
        
        // Re-render the list
        renderExpenses();
        
        // If we were editing this expense, cancel edit mode
        if (editIndex === index) {
            cancelEdit();
        } else if (editIndex > index) {
            editIndex--; // Adjust edit index
        }
        
        alert(`Expense "${deletedExpense.description}" deleted successfully!`);
    }
}

// Render expenses
function renderExpenses() {
    console.log('Rendering expenses:', expenses);
    const expenseList = document.getElementById('expense-list');
    
    // Clear existing content
    expenseList.innerHTML = '';
    
    if (expenses.length === 0) {
        expenseList.innerHTML = '<li style="list-style: none; text-align: center; padding: 20px; color: #666;">No expenses found. Add your first expense above!</li>';
        updateSummary(0, 0);
        return;
    }
    
    // Sort expenses by date (newest first)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('Sorted expenses:', sortedExpenses);
    
    // Render each expense
    sortedExpenses.forEach((expense, sortedIndex) => {
        // Find the actual index in the original expenses array
        const actualIndex = expenses.findIndex(e => e.id === expense.id);
        console.log(`Rendering expense ${sortedIndex}:`, expense, 'actualIndex:', actualIndex);
        
        const li = document.createElement('li');
        li.style.cssText = `
            list-style: none;
            border: 1px solid #ddd;
            margin: 10px 0;
            padding: 15px;
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f9f9f9;
        `;
        
        li.innerHTML = `
            <div style="flex-grow: 1;">
                <div style="font-size: 18px; font-weight: bold; color: #28a745;">₹${expense.amount.toFixed(2)}</div>
                <div style="font-size: 16px; margin: 5px 0;">${expense.description}</div>
                <div style="font-size: 14px; color: #6c757d; text-transform: uppercase;">${expense.category}</div>
                <div style="font-size: 12px; color: #999;">📅 ${formatDate(expense.date)}</div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="editExpense(${actualIndex})" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Edit</button>
                <button onclick="deleteExpense(${actualIndex})" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Delete</button>
            </div>
        `;
        
        expenseList.appendChild(li);
    });
    
    // Update summary
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    updateSummary(total, expenses.length);
    console.log('Summary updated - Total:', total, 'Count:', expenses.length);
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Update summary section
function updateSummary(total, count) {
    document.getElementById('total-amount').textContent = total.toFixed(2);
    document.getElementById('expense-count').textContent = count;
}

// Clear input fields
function clearInputs() {
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-description').value = '';
    document.getElementById('expense-category').value = 'fuel';
}