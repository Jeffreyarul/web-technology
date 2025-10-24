import React, { useState } from 'react';

// Load Lucide icons for a cleaner interface
import { DollarSign, Percent, Calendar, Calculator, AlertTriangle, ArrowRight } from 'lucide-react';

// --- Utility Functions ---

/**
 * Calculates the EMI, Total Interest, and Total Payment.
 * P = Loan Amount
 * R = Monthly Interest Rate (Annual Rate / 12 / 100)
 * N = Loan Tenure in months
 * EMI = P * R * (1 + R)^N / ((1 + R)^N - 1)
 */
const calculateEMI = (P, R_annual, N) => {
    // R is the Monthly Interest Rate
    const R = R_annual / 12 / 100; 

    if (R === 0) {
        // Simple division for 0% interest loans
        const emi = P / N;
        const totalPayment = P;
        const totalInterest = 0;
        return { emi, totalPayment, totalInterest };
    }

    // Formula calculation
    const power = Math.pow(1 + R, N);
    const emi = P * R * power / (power - 1);
    
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    return { emi, totalPayment, totalInterest };
};


// --- Main App Component ---

const App = () => {
    // State for user inputs
    const [loanAmount, setLoanAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [loanTenure, setLoanTenure] = useState('');

    // State for calculation results
    const [emiResult, setEmiResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // State for focus styling
    const [focusedInput, setFocusedInput] = useState(null);


    // Input change handlers
    const handleInputChange = (e, setter) => {
        setter(e.target.value);
        // Clear results and errors when input changes
        setEmiResult(null);
        setErrorMessage('');
    };

    // Validation and Calculation Logic
    const handleCalculate = () => {
        const P = parseFloat(loanAmount);
        const R = parseFloat(interestRate);
        const N = parseInt(loanTenure);

        // 1. Validation Logic
        if (!P || P <= 0 || isNaN(P) ||
            !R || R < 0 || isNaN(R) ||
            !N || N <= 0 || isNaN(N) || !Number.isInteger(N)) {
            
            // Generate alert message as requested, but using a modern UI component
            setErrorMessage('All fields must be positive numbers, and Loan Tenure must be a positive integer in months.');
            setEmiResult(null);
            return;
        }

        // Clear error message on successful validation
        setErrorMessage('');

        // 2. Calculation
        const results = calculateEMI(P, R, N);

        // 3. Set Results
        setEmiResult({
            loanAmount: P,
            emi: results.emi,
            totalInterest: results.totalInterest,
            totalPayment: results.totalPayment
        });
    };

    // Helper function to render input fields
    const renderInput = (id, label, state, setter, Icon, type = 'number') => (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
            <div className={`flex items-center border-2 rounded-lg transition-all ${focusedInput === id ? 'border-indigo-500 ring-4 ring-indigo-200 shadow-md' : 'border-gray-300'}`}>
                <div className="p-3 text-gray-400">
                    <Icon className="w-5 h-5" />
                </div>
                <input
                    type={type}
                    id={id}
                    value={state}
                    onChange={(e) => handleInputChange(e, setter)}
                    onFocus={() => setFocusedInput(id)}
                    onBlur={() => setFocusedInput(null)}
                    min={id === 'loanTenure' ? "1" : "0"}
                    step={id !== 'loanTenure' ? "any" : "1"}
                    placeholder={label}
                    className="flex-grow p-3 focus:outline-none rounded-r-lg bg-white text-gray-800 text-lg"
                    aria-label={label}
                />
            </div>
        </div>
    );

    // Helper function to format currency
    const formatCurrency = (amount) => {
        if (amount === null || isNaN(amount)) return 'N/A';
        return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-start sm:items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 sm:p-10">
                
                <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-8">
                    Equated Monthly Instalment (EMI) Calculator
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Loan Amount Input */}
                    {renderInput('loanAmount', 'Loan Amount (P)', loanAmount, setLoanAmount, DollarSign)}
                    
                    {/* Interest Rate Input */}
                    {renderInput('interestRate', 'Annual Rate (%) (R)', interestRate, setInterestRate, Percent)}
                    
                    {/* Loan Tenure Input */}
                    {renderInput('loanTenure', 'Loan Tenure (in months) (N)', loanTenure, setLoanTenure, Calendar, 'text')}
                </div>

                {/* Calculation Button */}
                <div className="mt-8">
                    <button
                        onClick={handleCalculate}
                        className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-bold rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transform hover:scale-[1.01]"
                    >
                        <Calculator className="w-6 h-6 mr-3" />
                        Calculate EMI
                    </button>
                </div>

                {/* Error Message Display */}
                {errorMessage && (
                    <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start shadow-sm">
                        <AlertTriangle className="w-5 h-5 mt-1 mr-3 flex-shrink-0" />
                        <p className="font-medium text-sm">{errorMessage}</p>
                    </div>
                )}
                
                {/* Results Display (Dynamic) */}
                {emiResult && !errorMessage && (
                    <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            Results <ArrowRight className="w-5 h-5 ml-2 text-indigo-500"/>
                        </h2>

                        {/* Display Loan Amount (P) */}
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-inner">
                            <p className="text-lg font-medium text-gray-600">Total Loan Amount (P)</p>
                            <p className="text-xl font-bold text-gray-800">
                                {formatCurrency(emiResult.loanAmount)}
                            </p>
                        </div>

                        {/* Display EMI */}
                        <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-600 shadow-md">
                            <p className="text-xl font-bold text-indigo-800">Equated Monthly Instalment (EMI)</p>
                            <p className="text-3xl font-extrabold text-indigo-700">
                                {formatCurrency(emiResult.emi)}
                            </p>
                        </div>

                        {/* Display Total Interest */}
                        <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 shadow-sm">
                            <p className="text-lg font-medium text-gray-600">Total Interest to be Paid</p>
                            <p className="text-xl font-bold text-yellow-700">
                                {formatCurrency(emiResult.totalInterest)}
                            </p>
                        </div>
                        
                        {/* Display Total Payment (P + Interest) */}
                         <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-l-4 border-green-600 shadow-sm">
                            <p className="text-lg font-medium text-gray-600">Total Payment (P + Interest)</p>
                            <p className="text-xl font-bold text-green-700">
                                {formatCurrency(emiResult.totalPayment)}
                            </p>
                        </div>

                    </div>
                )}
                
            </div>
        </div>
    );
};

export default App;
